import React, { useEffect, useRef, useState } from 'react';
import LanguageSelect from '../language/LanguageSelected';
import axios from 'axios';
import { Img_Url, Test_Api } from '../Config';
import DeleteModal from '../modal/DeleteModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Category from '../pages/Category';
import Pagination from '../pagination/Pagination';

export default function HomeCategory() {
    const [languages, setLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [homecategory, setHomecategory] = useState([]);
    const [homecategoryData, setHomecategoryData] = useState({
        _id: '',
        vLanguageId: '',
        vName: '',
        iNumber: '2',
        iAppType: '0',
        vIcon: '',  // Store the image path here

    });
    const [options, setOptions] = useState([]);
    const [editId, setEditId] = useState(null);
    const [deleteID, setDeleteId] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);  // To show the preview
    const fileInputRef = useRef(null);
    const [currentId, setCurrentId] = useState(null);
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10;  // Display 12 posts per page

    useEffect(() => {
        loadOptions();
    }, []);

    const fetchData = (vLanguageId) => {
        axios.post(`${Test_Api}homeCategory/list`, { vLanguageId }).then(response => {
            setHomecategory(response.data.data);
            console.log("Home Category Data List ==>", response.data.data)
        }).catch(error => {
            console.log(error);
        });
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

    const handleLanguageSelect = (selectedLanguage) => {
        setSelectedLanguage(selectedLanguage);
        setHomecategoryData((prevState) => ({
            ...prevState,
            vLanguageId: selectedLanguage ? selectedLanguage.id : '',
        }));
        if (selectedLanguage) {
            fetchData(selectedLanguage.id);
            console.log("Selected Options ===>", selectedLanguage);
        }
    };

    // const handleImageChange = (e) => {
    //     const file = e.target.files[0];
    //     if (!file) {
    //         const formData = new FormData();
    //         formData.append('vImage', file);

    //         axios.post(`${Test_Api}addImage/details`, { vIcon: homecategoryData.vIcon })
    //             .then(response => {
    //                 const imagePath = response.data.data.vImage;
    //                 setHomecategoryData((prevState) => ({
    //                     ...prevState,
    //                     vIcon: response.data.vImage,  // Save the image URL in vIcon
    //                 }));
    //                 setImagePreview(URL.createObjectURL(file));  // Set image preview
    //                 toast.success('Image uploaded successfully!');
    //                 console.log("image upload data ==>", response.data.data)
    //             })
    //             .catch(error => {
    //                 console.error('Error uploading image:', error);
    //                 toast.error('Failed to upload image.');
    //             });
    //     }
    // };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('vImage', file); // Ensure the correct key name matches API requirements

        try {
            const response = await axios.post(`${Test_Api}addImage/details`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response.data?.data?.vImage) {
                setHomecategoryData((prev) => ({ ...prev, vIcon: response.data.data.vImage }));
            }
            console.log('Uploaded Data:', response.data.data);
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Image upload failed!');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            vLanguageId: homecategoryData.vLanguageId,
            vName: homecategoryData.vName,
            iNumber: homecategoryData.iNumber,
            iAppType: homecategoryData.iAppType,
            // vIcon: homecategoryData.vIcon,
        };

        if (editId) {
            payload.vCatId = editId;
            const formData = new FormData();
            formData.append('vCatId', currentId);
            axios.put(`${Test_Api}homeCategory/details`, { vCatId: currentId, vIcon: homecategoryData.vIcon, vLanguageId: homecategoryData.vLanguageId, vName: homecategoryData.vName, iAppType: homecategoryData.iAppType, iNumber: homecategoryData.iNumber }, payload)
                .then(response => {
                    setHomecategoryData({
                        vLanguageId: '',
                        vName: '',
                        iNumber: '',
                        vIcon: '',
                        iAppType: '',
                    });
                    fetchData(selectedLanguage?.id); // Refetch data
                    toast.success('Home Category updated successfully!');
                    console.log("Updated Home Category Data =>", response.data.data);
                })
                .catch(error => {
                    console.error(error);
                    toast.error('Failed to update home category.');
                });
        } else {
            const formData = new FormData();
            formData.append('vCatId', currentId);
            formData.append('iAppType', homecategoryData.iAppType ?? 0); // Default value: 0
            formData.append('iNumber', homecategoryData.iNumber ?? 2); // Default value: 2
            // payload.vIcon = homecategoryData.vIcon;
            axios.post(`${Test_Api}homeCategory/details`, { vIcon: homecategoryData.vIcon, vLanguageId: homecategoryData.vLanguageId, vName: homecategoryData.vName }, payload, formData)
                .then(response => {
                    const newHomeCategory = response.data.data;

                    // Prepend the new data to the homecategory list
                    setHomecategory((prevState) => [newHomeCategory, ...prevState]);

                    // Clear the form after success
                    setHomecategoryData({
                        vLanguageId: homecategoryData.vLanguageId,
                        vName: '',
                        iNumber: '',
                        vIcon: '',
                    });

                    toast.success('Home Category saved successfully!');
                    console.log("New Home Category Data =>", newHomeCategory);
                })
                .catch(error => {
                    console.error(error);
                    toast.error('Failed to save home category.');
                });
        }
    };


    const handleUpdate = (item) => {
        setEditId(item._id);
        setHomecategoryData({
            vLanguageId: item.vLanguageId,
            vName: item.vName,
            iNumber: item.iNumber,
            vIcon: item.vIcon,
            iAppType: item.iAppType
        });
        setCurrentId(item._id);
        // Open update modal
        const updateModal = new bootstrap.Modal(document.getElementById('updateModal'));
        updateModal.show();
    };

    const handleDelete = () => {
        if (!deleteID) {
            toast.error('No event selected for deletion.');
            return;
        }

        axios
            .delete(`${Test_Api}homeCategory/details`, { data: { vCatId: deleteID } })
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

    // Pagination Logic ---------------------------------------------------------------------
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = homecategory.slice(indexOfFirstPost, indexOfLastPost);

    const totalPages = Math.ceil(homecategory.length / postsPerPage);

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
            <ToastContainer autoClose={2000} theme="dark" />
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
                                value={homecategoryData.vName}
                                type="text"
                                className="form-control mb-3"
                                onChange={(e) => setHomecategoryData({ ...homecategoryData, vName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="col-lg-3">
                            <label>
                                iNumber
                            </label>
                            <input
                                value={homecategoryData.iNumber}
                                type="text"
                                className="form-control mb-3"
                                onChange={(e) => setHomecategoryData({ ...homecategoryData, iNumber: e.target.value })}

                            />
                        </div>
                        <div className="col-lg-3">
                            <label>
                                iAppType
                            </label>
                            <input
                                value={homecategoryData.iAppType}
                                type="text"
                                className="form-control mb-3"
                                onChange={(e) => setHomecategoryData({ ...homecategoryData, iAppType: e.target.value })}

                            />
                        </div>
                        <div className="col-lg-12">
                            <label>
                                Icon <span className="text-danger">*</span>
                            </label>
                            <input
                                type="file"
                                className="form-control mb-3"
                                onChange={handleImageChange}
                                ref={fileInputRef}
                            />
                            {imagePreview && <img crossOrigin="anonymous" src={imagePreview} alt="Preview" style={{ width: '100px', marginTop: '10px' }} />}
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
                <h3>Total Home Category: {homecategory.length}</h3>
            </div>
            <div className="table-responsive side-container mt-5">
                <table className="table text-center">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>Name</th>
                            <th>Icon</th>
                            <th>iNumber</th>
                            <th>iAppType</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPosts.length > 0 ? (
                            currentPosts.map((item, id) => (
                                <tr key={id}>
                                    <td>{id + 1}</td>
                                    <td>{item.vName}</td>
                                    <td>
                                        <img
                                            crossOrigin="anonymous"
                                            src={`${Img_Url}${item.vIcon}`}
                                            alt="Category Icon"
                                            className="category-icon"
                                        />
                                    </td>
                                    <td>{item.iNumber}</td>
                                    <td>{item.iAppType}</td>
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
                            <tr className="text-center">
                                <td colSpan="6" className="p-2">
                                    <div className="data-not-found-bg">
                                        <img src="/images/question.png" alt="question" className="img-fluid" />
                                        <span className="table-data-not-found-text mt-1 d-block">Data Not Found!</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <DeleteModal deleteID={deleteID} handleDelete={handleDelete} />

            {/* Pagination */}
            <Pagination
                handlePrevious={handlePrevious}
                handleNext={handleNext}
                currentPage={currentPage}
                totalPages={totalPages}
                handlePaginationClick={handlePaginationClick}
            ></Pagination>
            {/* Update Modal */}
            <div className="modal fade" id="updateModal" tabIndex="-1" aria-labelledby="updateModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="updateModalLabel">Update Home Categoery</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
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
                                            value={homecategoryData.vName}
                                            type="text"
                                            className="form-control mb-3"
                                            onChange={(e) => setHomecategoryData({ ...homecategoryData, vName: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="col-lg-3">
                                        <label>
                                            iNumber <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            value={homecategoryData.iNumber}
                                            type="text"
                                            className="form-control mb-3"
                                            onChange={(e) => setHomecategoryData({ ...homecategoryData, iNumber: e.target.value })}

                                        />
                                    </div>
                                    <div className="col-lg-3">
                                        <label>
                                            iAppType <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            value={homecategoryData.iAppType}
                                            type="text"
                                            className="form-control mb-3"
                                            onChange={(e) => setHomecategoryData({ ...homecategoryData, iAppType: e.target.value })}

                                        />
                                    </div>
                                    <div className="col-lg-12">
                                        <label>
                                            Icon <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="file"
                                            className="form-control mb-3"
                                            onChange={handleImageChange}
                                            ref={fileInputRef}
                                        />
                                        {imagePreview && <img crossOrigin="anonymous" src={imagePreview} alt="Preview" style={{ width: '100px', marginTop: '10px' }} />}
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                                    Update Home Category
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
