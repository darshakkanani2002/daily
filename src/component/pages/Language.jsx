import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Test_Api } from '../Config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteModal from '../modal/DeleteModal';

export default function Language() {
    const [language, setLanguage] = useState([]);
    const [languageData, setLanguageData] = useState({
        vName: '',
        vCode: '',
    });
    const [deleteId, setDeleteId] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    // Fetch Data
    const fetchData = () => {
        axios.get(`${Test_Api}language/details`).then(response => {
            setLanguage(response.data.data);
        }).catch(error => {
            console.log(error);
        });
    };

    // Handle Submit (Create or Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isUpdating) {
            const updateData = {
                vLanguageId: currentId,
                vName: languageData.vName,
                vCode: languageData.vCode,
            };
            try {
                await axios.put(`${Test_Api}language/details`, updateData)
                    .then(() => {
                        setLanguageData({ vName: '', vCode: '' });
                        fetchData();
                        toast.success('Language updated successfully!');
                    }).catch(error => console.log(error));
            } catch (error) {
                console.log(error);
            }
        } else {
            try {
                await axios.post(`${Test_Api}language/details`, languageData)
                    .then(() => {
                        setLanguageData({ vName: '', vCode: '' });
                        fetchData();
                        toast.success('Language created successfully!');
                    }).catch(error => console.log(error));
            } catch (error) {
                console.log(error);
            }
        }
    };

    // Handle Update
    const handleUpdate = (language) => {
        setLanguageData({ vName: language.vName, vCode: language.vCode });
        setIsUpdating(true);
        setCurrentId(language._id);

        // Open update modal
        const updateModal = new bootstrap.Modal(document.getElementById('updateModal'));
        updateModal.show();
    };

    // Handle Delete
    const handleDelete = () => {
        axios.delete(`${Test_Api}language/details`, { data: { vLanguageId: deleteId } })
            .then(() => {
                fetchData();
                toast.success('Language deleted successfully!');
            }).catch(error => console.log(error));
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
                                    <input
                                        type="text"
                                        value={languageData.vName}
                                        className="form-control py-2"
                                        placeholder="Language"
                                        onChange={(e) => setLanguageData({ ...languageData, vName: e.target.value })}
                                    />
                                </div>
                                <div className="col-lg-5">
                                    <input
                                        type="text"
                                        value={languageData.vCode}
                                        className="form-control py-2"
                                        placeholder="vCode"
                                        onChange={(e) => setLanguageData({ ...languageData, vCode: e.target.value })}
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
                <h3>Total Language Data: {language.length}</h3>
            </div>
            <div className="side-container">
                <div>
                    <table className="table text-center">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Language</th>
                                <th>Vcode</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {language.length > 0 ? (
                                language.map((item, id) => (
                                    <tr key={id}>
                                        <td>{id + 1}</td>
                                        <td>{item.vName}</td>
                                        <td>{item.vCode}</td>
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
                                    <td colSpan="4" className="py-3">
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

            {/* Delete Modal */}
            <DeleteModal deleteID={deleteId} handleDelete={handleDelete} />

            {/* Update Modal */}
            <div className="modal fade" id="updateModal" tabIndex="-1" aria-labelledby="updateModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="updateModalLabel">Update Language</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="updateLanguageName" className="form-label">Language Name</label>
                                    <input
                                        type="text"
                                        id="updateLanguageName"
                                        value={languageData.vName}
                                        className="form-control"
                                        onChange={(e) => setLanguageData({ ...languageData, vName: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="updateLanguageCode" className="form-label">Language Code</label>
                                    <input
                                        type="text"
                                        id="updateLanguageCode"
                                        value={languageData.vCode}
                                        className="form-control"
                                        onChange={(e) => setLanguageData({ ...languageData, vCode: e.target.value })}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                                    Update Language
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
