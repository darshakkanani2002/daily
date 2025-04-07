import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { Img_Url, Test_Api } from '../Config';
import axios from 'axios';
import DeleteModal from '../modal/DeleteModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from '../pagination/Pagination';

export default function BussinessSubCategory() {
    const [bussinessSubCategory, setBussinessSubCategory] = useState([]);
    const [bussinessSubCategoryData, setBussinessSubCategoryData] = useState({
        vCatId: '',
        vName: '',
        vIcon: '',
        iNumber: '2'
    });
    const [options, setOptions] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [currentId, setCurrentId] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const fileInputRef = useRef(null);
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10;  // Display 12 posts per page

    useEffect(() => {
        loadOptions();
    }, []);

    const fetchData = (vCatId) => {
        axios.post(`${Test_Api}businessSubCat/list`, { vCatId }).then(response => {
            console.log("Bussiness Sub category Data List ==>", response.data.data);
            setBussinessSubCategory(response.data.data);
        }).catch(error => {
            console.log(error);
            toast.error('Failed to fetch subcategory data!');
        });
    };

    const loadOptions = async () => {
        try {
            const response = await axios.get(`${Test_Api}businessCat/details`);
            const data = response.data.data.map(language => ({
                label: language.vName,
                value: language._id,
                id: language._id,
            }));
            setOptions(data);
        } catch (error) {
            console.error('Error fetching options:', error);
            toast.error('Failed to load options!');
        }
    };

    const handleLanguageSelect = (selectedOption) => {
        setSelectedLanguage(selectedOption);
        setBussinessSubCategoryData((prevState) => ({
            ...prevState,
            vCatId: selectedOption ? selectedOption.id : '',
        }));
        if (selectedOption) {
            fetchData(selectedOption.id);
            console.log('Selected Options ===>', selectedOption);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('vImage', file); // Ensure the correct key name matches API requirements

        try {
            const response = await axios.post(`${Test_Api}addImage/details`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (response.data?.data?.vImage) {
                setBussinessSubCategoryData((prev) => ({ ...prev, vIcon: response.data.data.vImage }));
            }
            console.log('Uploaded Data:', response.data.data);
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Image upload failed!');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Submitted:', bussinessSubCategoryData);
        if (isUpdating) {
            axios.put(`${Test_Api}businessSubCat/details`, { vCatId: bussinessSubCategoryData.vCatId, vSubCatId: currentId, vIcon: bussinessSubCategoryData.vIcon, vName: bussinessSubCategoryData.vName, iNumber: bussinessSubCategoryData.iNumber })
                .then(response => {
                    console.log("Bussiness Sub Category Data Save ==>", response.data.data);
                    toast.success('Subcategory added successfully!');
                    setBussinessSubCategoryData({
                        vCatId: bussinessSubCategoryData.vCatId,
                        vName: '',
                        iNumber: '',
                        vIcon: ''
                    });
                    fetchData(bussinessSubCategoryData.vCatId);
                })
                .catch(error => {
                    console.log(error);
                    toast.error('Failed to add subcategory!');
                });
        } else {

            axios.post(`${Test_Api}businessSubCat/details`, { vCatId: bussinessSubCategoryData.vCatId, vName: bussinessSubCategoryData.vName, vIcon: bussinessSubCategoryData.vIcon, iNumber: bussinessSubCategoryData.iNumber || 2 })
                .then(response => {
                    console.log("Bussiness Sub Category Data Save ==>", response.data.data);
                    toast.success('Subcategory added successfully!');
                    setBussinessSubCategoryData({
                        vCatId: bussinessSubCategoryData.vCatId,
                        vName: '',
                        iNumber: '',
                        vIcon: ''
                    });
                    fetchData(bussinessSubCategoryData.vCatId);
                })
                .catch(error => {
                    console.log(error);
                    toast.error('Failed to add subcategory!');
                });
        }
    };

    // Handle Update
    const handleUpdate = (bussinesssubcat) => {
        setBussinessSubCategoryData({
            vName: bussinesssubcat.vName,
            vCatId: bussinesssubcat.vCatId,
            iNumber: bussinesssubcat.iNumber,
            vIcon: bussinesssubcat.vIcon
        });

        setIsUpdating(true);
        setCurrentId(bussinesssubcat._id);

        // Open update modal
        const updateModal = new bootstrap.Modal(document.getElementById('updateModal'));
        updateModal.show();
    };
    const handleDelete = () => {
        axios.delete(`${Test_Api}businessSubCat/details`, { data: { vSubCatId: deleteId } })
            .then(() => {
                fetchData(bussinessSubCategoryData.vCatId);
                toast.success('Subcategory deleted successfully!');
            })
            .catch(error => {
                console.error(error);
                toast.error('Failed to delete subcategory!');
            });
    };

    // Pagination Logic ---------------------------------------------------------------------
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = bussinessSubCategory.slice(indexOfFirstPost, indexOfLastPost);

    const totalPages = Math.ceil(bussinessSubCategory.length / postsPerPage);

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
            <ToastContainer position="top-center" autoClose={1000} theme="dark" />

            <div className="side-container category-form p-3 mt-5">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-lg-12 mb-3">
                            <label>
                                Bussiness Category <span className="text-danger">*</span>
                            </label>
                            <Select
                                value={selectedLanguage}
                                onChange={handleLanguageSelect}
                                options={options}
                                required
                            />
                        </div>
                        <div className="col-lg-3">
                            <label>
                                Name <span className="text-danger">*</span>
                            </label>
                            <input
                                value={bussinessSubCategoryData.vName}
                                type="text"
                                name="name"
                                id="name"
                                className="form-control mb-3"
                                onChange={(e) =>
                                    setBussinessSubCategoryData({ ...bussinessSubCategoryData, vName: e.target.value })
                                }
                                required
                            />
                        </div>
                        <div className="col-lg-3">
                            <label>
                                iNumber
                            </label>
                            <input
                                value={bussinessSubCategoryData.iNumber}
                                type="text"
                                className="form-control mb-3"
                                onChange={(e) => setBussinessSubCategoryData({ ...bussinessSubCategoryData, iNumber: e.target.value })}

                            />
                        </div>
                        <div className="col-lg-12">
                            <label htmlFor="icon">Icon</label>
                            <input
                                type="file"
                                name="vIcon"
                                id="icon"
                                className="form-control mb-3"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />
                            {bussinessSubCategoryData.vIcon && (
                                <img crossOrigin="anonymous" src={`${Img_Url}${bussinessSubCategoryData.vIcon}`} alt="Original Preview" style={{ width: '100px', height: 'auto', marginTop: '10px' }} />
                            )}
                        </div>

                        <div className="col-lg-12 text-center">
                            <button type="submit" className="btn btn-success">
                                {isUpdating ? 'Update Data' : 'Add Data'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
            <div className='text-center mt-4'>
                <h3>Total Business Sub Category: {bussinessSubCategory.length}</h3>
            </div>
            <div className="side-container my-5">
                <div className="table-responsive">
                    <table className="table text-center">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Name</th>
                                <th>Icon</th>
                                <th>iNumber</th>
                                <th>Delete/Update</th>
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
                                                alt=""
                                                className="category-icon"
                                            />
                                        </td>
                                        <td>
                                            {item.iNumber}
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
                                            <button
                                                className="btn btn-success mx-2"
                                                onClick={() => handleUpdate(item)}
                                            >
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="text-center">
                                    <td colSpan="7" className="py-3">
                                        <div className="data-not-found-bg">
                                            <img
                                                src="/images/question.png"
                                                alt="question"
                                                className="img-fluid"
                                            />
                                            <span className="table-data-not-found-text mt-1 d-block">
                                                Data Not Found!
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {/* Update Modal */}
            <div className="modal fade" id="updateModal" tabIndex="-1" aria-labelledby="updateModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="updateModalLabel">Update Bussiness Sub Category</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-lg-12 mb-3">
                                        <label>
                                            Bussiness Category <span className="text-danger">*</span>
                                        </label>
                                        <Select
                                            value={selectedLanguage}
                                            onChange={handleLanguageSelect}
                                            options={options}
                                            required
                                        />
                                    </div>
                                    <div className="col-lg-3">
                                        <label>
                                            Name <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            value={bussinessSubCategoryData.vName}
                                            type="text"
                                            name="name"
                                            id="name"
                                            className="form-control mb-3"
                                            onChange={(e) =>
                                                setBussinessSubCategoryData({ ...bussinessSubCategoryData, vName: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="col-lg-3">
                                        <label>
                                            iNumber
                                        </label>
                                        <input
                                            value={bussinessSubCategoryData.iNumber}
                                            type="text"
                                            className="form-control mb-3"
                                            onChange={(e) => setBussinessSubCategoryData({ ...bussinessSubCategoryData, iNumber: e.target.value })}

                                        />
                                    </div>
                                    <div className="col-lg-12">
                                        <label htmlFor="icon">Icon</label>
                                        <input
                                            type="file"
                                            name="vIcon"
                                            id="icon"
                                            className="form-control mb-3"
                                            onChange={handleFileChange}
                                            ref={fileInputRef}
                                        />
                                        {bussinessSubCategoryData.vIcon && (
                                            <img crossOrigin="anonymous" src={`${Img_Url}${bussinessSubCategoryData.vIcon}`} alt="Original Preview" style={{ width: '100px', height: 'auto', marginTop: '10px' }} />
                                        )}
                                    </div>
                                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                                        Update Bussiness Sub Category
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* Pagination */}
            <Pagination
                handlePrevious={handlePrevious}
                handleNext={handleNext}
                currentPage={currentPage}
                totalPages={totalPages}
                handlePaginationClick={handlePaginationClick}
            ></Pagination>
            {/* Delete Modal */}
            <DeleteModal deleteID={deleteId} handleDelete={handleDelete}></DeleteModal>
        </div>
    );
}
