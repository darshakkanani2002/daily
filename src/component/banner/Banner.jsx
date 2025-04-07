import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Img_Url, Test_Api } from '../Config';
import DeleteModal from '../modal/DeleteModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Banner() {
    const [banner, setBanner] = useState([]);
    const [bannerData, setBannerData] = useState({
        _id: '',
        vBannerImg: '',
    });
    const [preview, setPreview] = useState(null);
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [updateId, setUpdateId] = useState(null);
    const [deleteID, setDeleteId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        axios.get(`${Test_Api}banner/details`)
            .then((response) => {
                console.log("Banner image Data ==>", response.data.data);
                setBanner(response.data.data || []);
            })
            .catch(error => {
                console.error("Fetch error:", error);
                toast.error("Failed to fetch banner data!");
            });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBannerData({ ...bannerData, vBannerImg: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('vBannerImg', bannerData.vBannerImg);

        if (isUpdateMode) {
            // Update API
            axios.put(`${Test_Api}banner/details`, formData)
                .then((response) => {
                    console.log("Banner updated successfully:", response.data);
                    toast.success("Banner updated successfully!");
                    fetchData();
                    resetForm();
                })
                .catch((error) => {
                    console.error("Error updating banner:", error);
                    toast.error("Failed to update banner!");
                });
        } else {
            // Create API
            axios.post(`${Test_Api}banner/details`, formData)
                .then((response) => {
                    console.log("Banner saved successfully:", response.data);
                    toast.success("Banner saved successfully!");
                    fetchData();
                    resetForm();
                    setBannerData({ vBannerImg: '' })
                })
                .catch((error) => {
                    console.error("Error saving banner:", error);
                    toast.error("Failed to save banner!");
                });
        }
    };

    const handleUpdate = (item) => {
        setIsUpdateMode(true);
        setUpdateId(item._id);
        setBannerData({ ...bannerData, vBannerImg: item.vBannerImg });
        setPreview(`${Img_Url}${item.vBannerImg}`);
    };

    const handleDelete = () => {
        if (!deleteID) {
            toast.error('No banner selected for deletion.');
            return;
        }

        axios
            .delete(`${Test_Api}banner/details`, { data: { vBannerId: deleteID } })
            .then((response) => {
                toast.success('Banner deleted successfully!');
                fetchData();
                setDeleteId(null);
            })
            .catch((error) => {
                console.error('Error deleting banner:', error);
                toast.error('Failed to delete banner!');
            });
    };

    const resetForm = () => {
        setPreview(null);
        setBannerData({ vBannerImg: '' });
        setIsUpdateMode(false);
        setUpdateId(null);

        // Reset the file input field
        document.getElementById("icon").value = "";
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
                        <div className="col-lg-12">
                            <label htmlFor="icon">Banner Image</label>
                            <input
                                type="file"
                                name="file"
                                id="icon"
                                className="form-control mb-3"
                                onChange={handleFileChange}
                            />
                            {preview && (
                                <img
                                    crossOrigin="anonymous"
                                    src={preview}
                                    alt="Preview"
                                    style={{ width: '100px', height: 'auto', marginTop: '10px' }}
                                />
                            )}
                        </div>

                        <div className="col-lg-12 text-center">
                            <button type="submit" className="btn btn-success">
                                {isUpdateMode ? 'Update Data' : 'Add Data'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <div className='text-center mt-4'>
                <h3>Total Banner Data: {banner.length}</h3>
            </div>

            <div className="side-container my-5">
                <div className="table-responsive">
                    <table className="table text-center">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Banner Image</th>
                                <th>Delete/Update</th>
                            </tr>
                        </thead>
                        <tbody>
                            {banner.length > 0 ? (
                                banner.map((item, id) => (
                                    <tr key={id}>
                                        <td>{id + 1}</td>
                                        <td>
                                            <img
                                                crossOrigin="anonymous"
                                                src={`${Img_Url}${item.vBannerImg}`}
                                                alt={`${item.vBannerImg}`}
                                                className="category-icon"
                                            />
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
                                                className="btn btn-success mx-2 d-none"
                                                onClick={() => handleUpdate(item)}
                                            >
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="text-center">
                                    <td colSpan="3" className="py-3">Data Not Found!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <DeleteModal deleteID={deleteID} handleDelete={handleDelete} />
        </div>
    );
}
