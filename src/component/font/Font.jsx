import React, { useEffect, useRef, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteModal from '../modal/DeleteModal';
import axios from 'axios';
import { Test_Api } from '../Config';

export default function Font() {
    const [font, setFont] = useState([]);
    const [fontData, setFontData] = useState({
        vFontUrl: '', // Font URL (file)
    });
    const [deleteID, setDeleteId] = useState(null);
    const fileInputRef = useRef(null); // Ref for the file input

    // Fetch font data on component mount
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        axios
            .post(`${Test_Api}addFont/list`)
            .then((response) => {
                console.log("Fetched font data:", response.data.data);
                setFont(response.data.data || []); // Set font list from response data
            })
            .catch((error) => {
                console.error("Fetch error:", error);
            });
    };

    // Handle file input change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFontData({ ...fontData, vFontUrl: file });
        }
    };

    // Handle form submission (file upload)
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('font', fontData.vFontUrl); // Append the font file to formData

        try {
            const response = await axios.post(`${Test_Api}addFont/details`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log("Font file saved successfully:", response.data);
            toast.success("Font file saved successfully!");
            fetchData(); // Reload the font list
            setFontData({ vFontUrl: '' }); // Clear the fontData after saving

            // Reset the file input field
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error("Error uploading font:", error);
            toast.error("Error uploading font.");
        }
    };

    // Handle font deletion
    const handleDelete = () => {
        if (!deleteID) {
            console.error("No delete ID selected");
            toast.error("No font selected for deletion.");
            return;
        }

        axios
            .delete(`${Test_Api}addFont/details`, {
                data: { vFontId: deleteID }, // Send font ID to be deleted
            })
            .then((response) => {
                console.log("Deleted font data:", response.data);
                toast.success("Font deleted successfully!");
                fetchData(); // Reload the font list after deletion
                setDeleteId(null); // Reset delete ID
            })
            .catch((error) => {
                console.error("Error deleting font:", error);
                toast.error("Error deleting font.");
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

            {/* Add Font Form */}
            <div className="side-container category-form p-3 mt-5">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-lg-12">
                            <label htmlFor="font">Font</label>
                            <input
                                type="file"
                                name="file"
                                id="font"
                                className="form-control mb-3"
                                onChange={handleFileChange}
                                ref={fileInputRef} // Attach the ref to the input
                            />
                        </div>
                        <div className="col-lg-12 text-center">
                            <button type="submit" className="btn btn-success">Add Font</button>
                        </div>
                    </div>
                </form>
            </div>

            <div className='text-center mt-4'>
                <h3>Total Font Data: {font.length}</h3>
            </div>
            {/* Font List Table */}
            <div className="side-container my-5">
                <div className="table-responsive">
                    <table className="table text-center">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Font</th>
                                <th>Delete/Update</th>
                            </tr>
                        </thead>
                        <tbody>
                            {font.length > 0 ? (
                                font.map((item, id) => (
                                    <tr key={id}>
                                        <td>{id + 1}</td>
                                        <td>{item.vFontUrl}</td>
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
                                                onClick={() => toast.info("Update functionality not implemented yet.")} // Update functionality not implemented
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
