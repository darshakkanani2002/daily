import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toast notifications
import { Test_Api } from '../Config';
import DeleteModal from '../modal/DeleteModal';
import Pagination from '../pagination/Pagination';

export default function BussinessCategory() {
    const [bussinesscat, setBussinesscat] = useState([]);
    const [bussinesscatData, setBussinesscatData] = useState({
        vName: '',
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
    const [currentId, setCurrentId] = useState(null);
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10;  // Display 12 posts per page
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        axios.get(`${Test_Api}businessCat/details`)
            .then(response => {
                console.log("Bussiness Category Data List ==>", response.data.data);
                setBussinesscat(response.data.data);
            })
            .catch(error => {
                console.error(error);
                toast.error('Failed to fetch data!');
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isUpdating) {
            axios.put(`${Test_Api}businessCat/details`, { vName: bussinesscatData.vName, vCatId: currentId }).then(response => {
                console.log("Bussiness Update Data List ==>", response.data.data);
                setBussinesscatData({
                    vName: '',
                });
                toast.success('Category added  successfully!');
                fetchData();
            }).catch(error => {
                console.log(error);

            })
        } else {
            axios.post(`${Test_Api}businessCat/details`, { vName: bussinesscatData.vName })
                .then(response => {
                    console.log("Bussiness Category Data save ==>", response.data.data);
                    setBussinesscatData({
                        vName: '',
                    });
                    fetchData();
                    toast.success('Category added successfully!');
                })
                .catch(error => {
                    console.error(error);
                    toast.error('Failed to add category!');
                });
        }
    };

    // Handle Update
    const handleUpdate = (bussinesscat) => {
        setBussinesscatData({ vName: bussinesscat.vName });
        setIsUpdating(true);
        setCurrentId(bussinesscat._id);

        // Open update modal
        const updateModal = new bootstrap.Modal(document.getElementById('updateModal'));
        updateModal.show();
    };
    // Handle Delete
    const handleDelete = () => {
        axios.delete(`${Test_Api}businessCat/details`, { data: { vCatId: deleteId } })
            .then(() => {
                fetchData();
                toast.success('Category deleted successfully!');
            })
            .catch(error => {
                console.error(error);
                toast.error('Failed to delete category!');
            });
    };


    // Pagination Logic ---------------------------------------------------------------------
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = bussinesscat.slice(indexOfFirstPost, indexOfLastPost);

    const totalPages = Math.ceil(bussinesscat.length / postsPerPage);

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
            <div className="py-3">
                <div className="side-container">
                    <div className="category-form p-3">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-lg-7">
                                    <label htmlFor="" className="form-label">Name</label>
                                    <input
                                        type="text"
                                        value={bussinesscatData.vName}
                                        className="form-control py-2"
                                        placeholder="Name"
                                        onChange={(e) => setBussinesscatData({ ...bussinesscatData, vName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <button type="submit" className="btn btn-success my-3">
                                        {isUpdating ? 'Update Data' : 'Add Data'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className='text-center mt-4'>
                <h3>Total Business Category: {bussinesscat.length}</h3>
            </div>
            <div className="side-container">
                <div>
                    <table className="table text-center mt-4">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>vName</th>
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
                                            <button
                                                className="btn btn-danger mx-2 px-3"
                                                onClick={() => setDeleteId(item._id)}
                                                data-bs-toggle="modal"
                                                data-bs-target="#deleteModal"
                                                title="Delete"
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                            <button
                                                className="btn btn-success mx-2 px-3"
                                                onClick={() => handleUpdate(item)}
                                                title="Update"
                                            >
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="py-3">
                                        <div className="data-not-found-bg">
                                            <img src="/images/question.png" alt="question" className="img-fluid" />
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
                            <h5 className="modal-title" id="updateModalLabel">Update Bussiness Category</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-lg-7 mb-3">
                                        <label htmlFor="" className="form-label">Name</label>
                                        <input
                                            type="text"
                                            value={bussinesscatData.vName}
                                            className="form-control py-2"
                                            placeholder="Name"
                                            onChange={(e) => setBussinesscatData({ ...bussinesscatData, vName: e.target.value })}
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                                        Update Bussiness Category
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            {/* Delete Modal */}
            <DeleteModal deleteID={deleteId} handleDelete={handleDelete}></DeleteModal>
        </div>
    );
}
