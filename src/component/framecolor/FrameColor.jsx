import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Test_Api } from '../Config';
import DeleteModal from '../modal/DeleteModal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from '../pagination/Pagination';

export default function FrameColor() {
    const [framecolor, setFramecolor] = useState([]);
    const [framecolorData, setFramecolorData] = useState({
        _id: '',
        arrColorsFrame: [],
        arrColorsBorder: [],
    });
    const [deleteId, setDeleteId] = useState(null);
    const [editId, setEditId] = useState(null);
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10;  // Display 12 posts per page

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        axios.post(`${Test_Api}frameColor/list`)
            .then(response => {
                console.log("Frame Color data ==>", response.data.data);
                setFramecolor(response.data.data);
            })
            .catch(error => {
                console.log(error);
                toast.error("Error fetching data!");
            });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editId) {
            // Update API Call
            axios.put(`${Test_Api}frameColor/details`, {
                vColorId: framecolorData._id,
                arrColorsFrame: framecolorData.arrColorsFrame,
                arrColorsBorder: framecolorData.arrColorsBorder,
            })
                .then(response => {
                    console.log("Updated frame color ==>", response.data);
                    setFramecolorData({ arrColorsFrame: [], arrColorsBorder: [] });
                    setEditId(null);
                    fetchData();
                    toast.success("Frame color updated successfully!");
                })
                .catch(error => {
                    console.log(error);
                    toast.error("Error updating frame color!");
                });
        } else {
            // Add API Call
            axios.post(`${Test_Api}frameColor/details`, {
                arrColorsFrame: framecolorData.arrColorsFrame,
                arrColorsBorder: framecolorData.arrColorsBorder,
            })
                .then(response => {
                    console.log("Saved frame color ==>", response.data);
                    setFramecolorData({ arrColorsFrame: [], arrColorsBorder: [] });
                    fetchData();
                    toast.success("Frame color added successfully!");
                })
                .catch(error => {
                    console.log(error);
                    toast.error("Error adding frame color!");
                });
        }
    };

    const handleArrayInputChange = (e, key) => {
        const value = e.target.value;

        // Check if the input ends with a comma
        if (value.endsWith(',')) {
            // Remove the comma and add the current input as a new color to the array
            const updatedValue = value.slice(0, -1); // Remove last comma
            const updatedArray = updatedValue.split(',').map(item => item.trim()).filter(item => item !== "");

            setFramecolorData(prev => ({
                ...prev,
                [key]: updatedArray,
            }));
        } else {
            // Otherwise, just split by commas and update
            const updatedArray = value.split(',').map(item => item.trim()).filter(item => item !== "");

            setFramecolorData(prev => ({
                ...prev,
                [key]: updatedArray,
            }));
        }
    };
    const handleEdit = (item) => {
        setEditId(item._id);
        setFramecolorData({
            _id: item._id,
            arrColorsFrame: item.arrColorsFrame,
            arrColorsBorder: item.arrColorsBorder,
        });
        // Open update modal
        const updateModal = new bootstrap.Modal(document.getElementById('updateModal'));
        updateModal.show();
    };

    const handleDelete = () => {
        axios.delete(`${Test_Api}frameColor/details`, {
            data: { vColorId: deleteId }
        })
            .then(response => {
                console.log("Frame color deleted successfully:", response.data);
                fetchData();
                toast.success("Frame color deleted successfully!");
            })
            .catch(error => {
                console.log(error);
                toast.error("Error deleting frame color!");
            });
    };

    // Pagination Logic ---------------------------------------------------------------------
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = framecolor.slice(indexOfFirstPost, indexOfLastPost);

    const totalPages = Math.ceil(framecolor.length / postsPerPage);

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
            <div className='side-container'>
                <div className='category-form p-3 mt-5'>
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-lg-7">
                                <label htmlFor="">arrColorsFrame</label>
                                <input
                                    type="text"
                                    value={framecolorData.arrColorsFrame.join(',')}
                                    className="form-control py-2"
                                    placeholder="Enter colors separated by commas"
                                    onChange={(e) => handleArrayInputChange(e, 'arrColorsFrame')}
                                />
                            </div>
                            <div className="col-lg-5">
                                <label htmlFor="">arrColorsBorder</label>
                                <input
                                    type="text"
                                    value={framecolorData.arrColorsBorder.join(',')}
                                    className="form-control py-2"
                                    placeholder="Enter colors separated by commas"
                                    onChange={(e) => handleArrayInputChange(e, 'arrColorsBorder')}
                                />
                            </div>
                            <div>
                                <button type='submit' className='btn btn-success my-3'>
                                    {editId ? 'Update Data' : 'Add Data'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className='text-center mt-4'>
                <h3>Total Frame Color Data: {framecolor.length}</h3>
            </div>

            <div className='side-container mt-5'>
                <div className='table-responsive'>
                    <table className='table text-center'>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>arrColorsFrame</th>
                                <th>arrColorsBorder</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentPosts.length > 0 ? (
                                currentPosts.map((item, id) => (
                                    <tr key={id}>
                                        <td>{id + 1}</td>
                                        <td>
                                            {item.arrColorsFrame.map((color, index) => (
                                                <div
                                                    key={index}
                                                    style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}
                                                >
                                                    <div
                                                        style={{
                                                            width: '20px',
                                                            height: '20px',
                                                            marginRight: '5px',
                                                            backgroundColor: color,
                                                            border: '1px solid #000',
                                                        }}
                                                    ></div>
                                                    <span>{color}</span>
                                                </div>
                                            ))}
                                        </td>
                                        <td>
                                            {item.arrColorsBorder.map((color, index) => (
                                                <div
                                                    key={index}
                                                    style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}
                                                >
                                                    <div
                                                        style={{
                                                            width: '20px',
                                                            height: '20px',
                                                            marginRight: '5px',
                                                            backgroundColor: color,
                                                            border: '1px solid #000',
                                                        }}
                                                    ></div>
                                                    <span>{color}</span>
                                                </div>
                                            ))}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-danger mx-2 px-3"
                                                title="Delete"
                                                onClick={() => setDeleteId(item._id)}
                                                data-bs-toggle="modal"
                                                data-bs-target="#deleteModal"
                                            >
                                                <i className="fa-solid fa-trash"></i>
                                            </button>
                                            <button
                                                className="btn btn-success mx-2 px-3"
                                                title="Update"
                                                onClick={() => handleEdit(item)}
                                            >
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4">No Data Found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteModal deleteID={deleteId} handleDelete={handleDelete} />


            {/* Pagination */}
            <Pagination
                handlePrevious={handlePrevious}
                handleNext={handleNext}
                currentPage={currentPage}
                totalPages={totalPages}
                handlePaginationClick={handlePaginationClick}
            ></Pagination>
            {/* Toast Container */}
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

            {/* Update Modal */}
            <div className="modal fade" id="updateModal" tabIndex="-1" aria-labelledby="updateModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="updateModalLabel">Update Frame color</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-12 mb-3">
                                        <label htmlFor="">arrColorsFrame</label>
                                        <input
                                            type="text"
                                            value={framecolorData.arrColorsFrame.join(',')}
                                            className="form-control py-2"
                                            placeholder="Enter colors separated by commas"
                                            onChange={(e) => handleArrayInputChange(e, 'arrColorsFrame')}
                                        />
                                    </div>
                                    <div className="col-12 mb-3">
                                        <label htmlFor="">arrColorsBorder</label>
                                        <input
                                            type="text"
                                            value={framecolorData.arrColorsBorder.join(',')}
                                            className="form-control py-2"
                                            placeholder="Enter colors separated by commas"
                                            onChange={(e) => handleArrayInputChange(e, 'arrColorsBorder')}
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                                    Update Frame color
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
