import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Img_Url, Test_Api } from '../Config';
import LanguageSelect from '../language/LanguageSelected';
import DeleteModal from '../modal/DeleteModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from '../pagination/Pagination';

export default function UpcomingEvent() {
    const [languages, setLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [upcoming, setUpcoming] = useState([]);
    const [upcomingData, setUpcomingData] = useState({
        _id: '',
        vLanguageId: '',
        vName: '',
        dtDate: '',
        vImages: '',
    });
    const fileInputRef = useRef(null);
    const [options, setOptions] = useState([]);
    const [deleteID, setDeleteId] = useState(null);
    const [editId, setEditId] = useState(null);
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const [preview, setPreview] = useState(null);
    const postsPerPage = 10;  // Display 12 posts per page

    useEffect(() => {
        loadOptions();
    }, []);

    const fetchData = (vLanguageId) => {
        axios
            .post(`${Test_Api}upcomingEvent/list`, { vLanguageId })
            .then((response) => {
                const formattedData = response.data.data.map((item) => ({
                    ...item,
                    dtDate: formatDate(item.dtDate),
                }));
                console.log("Upcoming Event Data List ==>", response.data.data)
                setUpcoming(formattedData);

            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    };

    const loadOptions = async () => {
        try {
            const response = await axios.get(`${Test_Api}language/details`);
            const data = response.data.data.map((language) => ({
                label: language.vName,
                value: language._id,
                id: language._id,
            }));
            setOptions(data);
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    const handleLanguageSelect = (selectedOption) => {
        setSelectedLanguage(selectedOption);
        setUpcomingData((prevState) => ({
            ...prevState,
            vLanguageId: selectedOption ? selectedOption.id : '',
        }));
        if (selectedOption) {
            fetchData(selectedOption.id);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formattedDate = upcomingData.dtDate
            ? new Date(upcomingData.dtDate).toISOString().split('T')[0].replace(/-/g, '/')
            : '';

        const formData = new FormData();
        formData.append('vLanguageId', upcomingData.vLanguageId);
        formData.append('vName', upcomingData.vName);
        formData.append('dtDate', formattedDate);
        if (upcomingData.vImages) {
            formData.append('vImages', upcomingData.vImages);
        }

        if (editId) {
            formData.append('vEventId', editId);

            axios
                .put(`${Test_Api}upcomingEvent/details`, { vEventId: editId, vLanguageId: upcomingData.vLanguageId, vName: upcomingData.vName, dtDate: formattedDate }, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                })
                .then((response) => {
                    toast.success('Event updated successfully!');
                    setUpcomingData({ vName: '', dtDate: '', vLanguageId: '', vImages: '' });
                    setEditId(null);
                    fetchData(selectedLanguage?.id);
                    resetForm();
                })
                .catch((error) => {
                    console.error('Error updating data:', error);
                    toast.error('Failed to update event.');
                });
        } else {
            axios
                .post(`${Test_Api}upcomingEvent/details`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                })
                .then((response) => {
                    toast.success('Event added successfully!');
                    setUpcomingData({ vName: '', dtDate: '', vLanguageId: '', vImages: '' });
                    fetchData(selectedLanguage?.id);
                    resetForm();
                })
                .catch((error) => {
                    console.error('Error adding data:', error);
                    toast.error('Failed to add event.');
                });
        }
    };


    const handleUpdate = (item) => {
        const formattedDate = item.dtDate
            ? new Date(item.dtDate).toLocaleDateString('en-CA') // Convert to YYYY-MM-DD format in local timezone
            : ''; // Handle cases where dtDate is null or undefined

        setEditId(item._id);
        setUpcomingData({
            _id: item._id,
            vLanguageId: item.vLanguageId,
            vName: item.vName,
            dtDate: formattedDate, // Correctly formatted local date
            vImages: item.vImages,
        });
        // Set preview image for the current post
        if (item.vImages) {
            setPreview(`${Img_Url}${item.vImages}`); // Construct full URL if needed
        } else {
            setPreview(null); // Reset preview if no image
        }

    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUpcomingData({ ...upcomingData, vImages: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleDelete = () => {
        if (!deleteID) {
            toast.error('No event selected for deletion.');
            return;
        }

        axios
            .delete(`${Test_Api}upcomingEvent/details`, { data: { arrEventId: [deleteID] } })
            .then((response) => {
                toast.success('Event deleted successfully!');
                fetchData(selectedLanguage?.id);
                setDeleteId(null);
            })
            .catch((error) => {
                console.error('Error deleting event:', error);
                toast.error('Failed to delete event.');
            });
    };

    const resetForm = () => {
        setUpcomingData({
            vLanguageId: '',
            vName: '',
            dtDate: '',
            vImages: '',
        });
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';  // Reset file input
        }
        setEditId(false);  // Reset update mode
    };

    // Pagination Logic ---------------------------------------------------------------------
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = upcoming.slice(indexOfFirstPost, indexOfLastPost);

    const totalPages = Math.ceil(upcoming.length / postsPerPage);

    const handlePaginationClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };
    return (
        <div>
            <ToastContainer
                position="top-center"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition:Bounce
            />
            <div className="side-container category-form p-3 mt-5">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-lg-12 mb-3">
                            <label>
                                Select Language <span className="text-danger">*</span>
                            </label>
                            <LanguageSelect value={selectedLanguage} handleLanguageSelect={handleLanguageSelect} />
                        </div>
                        <div className="col-lg-3">
                            <label>
                                Name <span className="text-danger">*</span>
                            </label>
                            <input
                                value={upcomingData.vName}
                                type="text"
                                className="form-control mb-3"
                                onChange={(e) => setUpcomingData({ ...upcomingData, vName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="col-lg-3">
                            <label>
                                Date <span className="text-danger">*</span>
                            </label>
                            <input
                                value={upcomingData.dtDate || ''} // Ensure a fallback for null or undefined
                                type="date"
                                className="form-control mb-3"
                                onChange={(e) => setUpcomingData({ ...upcomingData, dtDate: e.target.value })}
                                required
                            />
                        </div>
                        <div className="col-lg-12">
                            <label>Image</label>
                            <input type="file" className="form-control mb-3" onChange={handleFileChange} ref={fileInputRef} />
                            {preview && (
                                <img
                                    crossOrigin="anonymous"
                                    src={preview} // Show the local file preview URL
                                    alt="Preview"
                                    style={{ width: '100px', marginTop: '10px' }}
                                />
                            )}
                        </div>
                        <div className="col-lg-12 text-center">
                            <button type="submit" className="btn btn-success">
                                {editId ? 'Update Data' : 'Add Data'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <div className='text-center mt-4'>
                <h3>Total Upcoming Event: {upcoming.length}</h3>
            </div>
            <div className="table-responsive side-container mt-5">
                <table className="table text-center">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Image</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPosts.length > 0 ? (
                            currentPosts.map((item, id) => (
                                <tr key={id}>
                                    <td>{id + 1}</td>
                                    <td>{item.vName}</td>
                                    <td>{item.dtDate}</td>
                                    <td>
                                        <img crossOrigin="anonymous" src={`${Img_Url}${item.vImages}`} alt="Event" style={{ width: '50px' }} />
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-danger mx-2"
                                            onClick={() => setDeleteId(item._id)}
                                            data-bs-toggle="modal"
                                            data-bs-target="#deleteModal"
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                        <button className="btn btn-success mx-2" onClick={() => handleUpdate(item)}>
                                            <i className="fa-solid fa-pen-to-square"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr className='text-center'>
                                <td colSpan="5" className='p-2'>
                                    <div className='data-not-found-bg'>
                                        <img src="/images/question.png" alt="question" className='img-fluid' />
                                        <span className='table-data-not-found-text mt-1 d-block'>Data Not Found !</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <DeleteModal deleteID={deleteID} handleDelete={handleDelete} />

            {/* Pagination Controls */}
            <div className="container">
                {/* Form and other post logic */}
                {/* Pagination */}
                <Pagination
                    handlePrevious={handlePrevious}
                    handleNext={handleNext}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePaginationClick={handlePaginationClick}
                ></Pagination>
            </div>
        </div>
    );
}
