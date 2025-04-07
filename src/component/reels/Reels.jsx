import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Img_Url, Test_Api } from '../Config';
import DeleteModal from '../modal/DeleteModal';

export default function Reels() {
    const [reels, setReels] = useState([]);
    const [reelsData, setReelsData] = useState({ vReels: '' });
    const [preview, setPreview] = useState(null);
    const [deleteID, setDeleteId] = useState(null);
    const fileInputRef = useRef(null); // Ref for the file input

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = (page = 1, limit = 33) => {
        axios
            .post(`${Test_Api}reels/list`, { iPage: page, iLimit: limit })
            .then((response) => {
                console.log("Reels Data ==>", response.data.data);
                setReels(response.data.data || []);

            })
            .catch((error) => {
                console.error("Fetch error:", error);

            });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setReelsData({ ...reelsData, vReels: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('vReels', reelsData.vReels);

        try {
            const response = await axios.post(`${Test_Api}reels/details`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log("Video uploaded successfully:", response.data);
            toast.success("Video uploaded successfully!");
            fetchData();
            setPreview(null);
            setReelsData({ vReels: '' });

            // Reset the file input field
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error("Error uploading video:", error);
            toast.error("Error uploading video.");
        }
    };

    const handleDelete = () => {
        if (!deleteID) {
            console.error("No delete ID selected");
            toast.error("No reel selected for deletion.");
            return;
        }

        axios
            .delete(`${Test_Api}reels/details`, {
                data: { arrReelsId: [deleteID] },
            })
            .then((response) => {
                console.log("Deleted Reels Data ==>", response.data);
                toast.success("Reel deleted successfully!");
                fetchData();
                setDeleteId(null);
            })
            .catch((error) => {
                console.error("Error deleting reel:", error);
                toast.error("Error deleting reel.");
            });
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
            />

            {/* Add Reels Form */}
            <div className="side-container category-form p-3 mt-5">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-lg-12">
                            <label htmlFor="video">vReels</label>
                            <input
                                type="file"
                                accept="video/*"
                                name="file"
                                id="video"
                                className="form-control mb-3"
                                onChange={handleFileChange}
                                ref={fileInputRef} // Attach the ref to the input
                            />
                            {preview && (
                                <video
                                    src={preview}
                                    controls
                                    style={{ width: '200px', height: 'auto', marginTop: '10px' }}
                                />
                            )}
                        </div>
                        <div className="col-lg-12 text-center">
                            <button type="submit" className="btn btn-success">Add Data</button>
                        </div>
                    </div>
                </form>
            </div>
            <div className='text-center mt-4'>
                <h3>Total Reels Data: {reels.length}</h3>
            </div>
            {/* Reels Table */}
            <div className="side-container my-5">
                <div className="table-responsive">
                    <table className="table text-center">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Video</th>
                                <th>Delete/Update</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reels.length > 0 ? (
                                reels.map((item, id) => (
                                    <tr key={id}>
                                        <td>{id + 1}</td>
                                        <td>
                                            <video
                                                crossOrigin="anonymous"
                                                src={`${Img_Url}${item.vReels}`}
                                                controls
                                                style={{ width: '200px', height: '200px' }}
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
                                                onClick={() => toast.info("Update functionality not implemented yet.")}
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

            {/* Delete Modal */}
            <DeleteModal
                deleteID={deleteID}
                handleDelete={handleDelete}
            />
        </div>
    );
}
