import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { Img_Url, Test_Api } from '../Config';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteModal from '../modal/DeleteModal';
import LanguageSelect from '../language/LanguageSelected';

export default function Category() {
    const [languages, setLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState(null);
    const [category, setCategory] = useState([]);
    const [categoryData, setCategoryData] = useState({
        vName: '',
        iNumber: '2',
        vIcon: '',
        vLanguageId: '',
        iAppType: '0',
    });

    const [options, setOptions] = useState([]);
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [deleteID, setDeleteId] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [currentId, setCurrentId] = useState(null);

    useEffect(() => {
        loadOptions();
    }, []);

    // Fetching Data
    const fetchData = (vLanguageId) => {
        axios
            .post(`${Test_Api}category/list`, { vLanguageId })
            .then((response) => {
                console.log('category Data ==>', response.data.data);
                setCategory(response.data.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // Load Category Options
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

    // Handle Language Select
    const handleLanguageSelect = (selectedOption) => {
        setSelectedLanguage(selectedOption);
        setCategoryData((prevState) => ({
            ...prevState,
            vLanguageId: selectedOption ? selectedOption.id : '',
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
                setCategoryData((prev) => ({ ...prev, vIcon: response.data.data.vImage }));
            }
            console.log('Uploaded Data:', response.data.data);
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Image upload failed!');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Determine vLanguageId: First preference from selectedLanguage, fallback to categoryData
        const languageId = selectedLanguage?.id || categoryData?.vLanguageId;

        // Validate if languageId is available
        if (!languageId) {
            toast.error('Please select a language!');
            return;
        }

        // Prepare the form data to send to the server
        const formData = new FormData();
        formData.append('vName', categoryData.vName);
        formData.append('iCatFontSize', categoryData.iCatFontSize);
        formData.append('iCatLine', categoryData.iCatLine);
        formData.append('vLanguageId', languageId.toString());

        // Append vIcon directly as a file
        if (categoryData.vIcon) {
            formData.append('vIcon', categoryData.vIcon); // vIcon is the file object, no need for .toString()
        }
        // For update request, append vLanguageId from categoryData (if exists), otherwise use the selectedLanguage
        if (isUpdating) {
            // Only append vLanguageId if it's not already part of categoryData (for update purposes)
            if (categoryData.vLanguageId !== languageId) {
                formData.append('vLanguageId', languageId.toString()); // Ensure it's a string
            }
            formData.append('vCatId', currentId);

            // Perform PUT request to update the category
            axios
                .put(`${Test_Api}category/details`, { vLanguageId: categoryData.vLanguageId, vCatId: currentId, vName: categoryData.vName, vIcon: categoryData.vIcon.toString(), iAppType: categoryData.iAppType, iNumber: categoryData.iNumber }, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then((response) => {
                    toast.success('Category updated successfully!');
                    fetchData(languageId); // Re-fetch data based on languageId
                    setCategoryData(categoryData.vLanguageId);
                    resetForm(); // Reset the form for the next action
                })
                .catch((error) => {
                    console.error(error);
                    toast.error('An error occurred while updating the category.');
                });
        } else {
            // For create request, always append vLanguageId in formData
            formData.append('vLanguageId', languageId.toString()); // Ensure it's a string
            formData.append('iAppType', categoryData.iAppType ?? 0); // Default value: 0
            formData.append('iNumber', categoryData.iNumber ?? 2); // Default value: 2

            // Perform POST request to create a new category
            axios
                .post(`${Test_Api}category/details`, { vLanguageId: categoryData.vLanguageId, vName: categoryData.vName, vIcon: categoryData.vIcon.toString() }, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                })
                .then((response) => {
                    toast.success('Category created successfully!');
                    fetchData(languageId); // Re-fetch data based on languageId
                    setCategoryData(categoryData.vLanguageId);
                    resetForm(); // Reset the form for the next action
                })
                .catch((error) => {
                    console.error(error);
                    toast.error('An error occurred while creating the category.');
                });
        }
    };



    // Handle Update Data
    const handleUpdate = (category) => {
        setCategoryData({
            _id: category._id,
            vName: category.vName,
            iAppType: category.iAppType,
            iNumber: category.iNumber,
            vLanguageId: category.vLanguageId,
            vIcon: category.vIcon,
        });
        if (fileInputRef.current) {
            fileInputRef.current.value = categoryData.vIcon; // Clear the file input field
        }
        setIsUpdating(true);
        setCurrentId(category._id);
        setPreview(`${Img_Url}${category.vIcon}`);
        // Open update modal
        const updateModal = new bootstrap.Modal(document.getElementById('updateModal'));
        updateModal.show();
    };

    // Delete Category Data API
    const handleDelete = () => {
        const languagesId = categoryData.vLanguageId || selectedLanguage?.id;
        axios
            .delete(`${Test_Api}category/details`, {
                data: { vCatId: deleteID },
            })
            .then((response) => {
                console.log('Deleted Category Data ==>', response.data);
                fetchData(languagesId);
                toast.success('Category deleted successfully!');
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // Reset Form
    const resetForm = () => {
        setCategoryData({
            vName: '',
            iAppType: '',
            vIcon: null,
            vLanguageId: '',
            iNumber: '',
        });
        setPreview(null); // Remove the image preview
        if (fileInputRef.current) {
            fileInputRef.current.value = ''; // Clear the file input field
        }
    };

    return (
        <div>
            <div className="py-3">
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
                <div className="side-container category-form p-3">
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-lg-12 mb-3">
                                <label>
                                    Select Language <span className="text-danger">*</span>
                                </label>
                                <LanguageSelect
                                    value={selectedLanguage}
                                    selectedLanguage={selectedLanguage}
                                    handleLanguageSelect={handleLanguageSelect}
                                />
                            </div>
                            <div className="col-lg-3">
                                <label>
                                    Name <span className="text-danger">*</span>
                                </label>
                                <input
                                    value={categoryData.vName}
                                    type="text"
                                    name="name"
                                    id="name"
                                    className="form-control mb-3"
                                    onChange={(e) =>
                                        setCategoryData({ ...categoryData, vName: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="col-lg-3">
                                <label htmlFor="fontsize">
                                    iNumber
                                </label>
                                <input
                                    value={categoryData.iNumber}
                                    type="text"
                                    name="fontsize"
                                    id="fontsize"
                                    className="form-control mb-3"
                                    onChange={(e) =>
                                        setCategoryData({
                                            ...categoryData,
                                            iNumber: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="col-lg-3">
                                <label htmlFor="vspace">iAppType</label>
                                <input
                                    value={categoryData.iAppType}
                                    type="text"
                                    name="vspace"
                                    id="vspace"
                                    className="form-control mb-3"
                                    onChange={(e) =>
                                        setCategoryData({ ...categoryData, iAppType: e.target.value })
                                    }
                                />
                            </div>
                            <div className="col-lg-3 d-none">
                                <label htmlFor="vspace">iCatLine</label>
                                <input
                                    value={categoryData.iCatLine}
                                    type="text"
                                    name="vspace"
                                    id="vspace"
                                    className="form-control mb-3"
                                    onChange={(e) =>
                                        setCategoryData({ ...categoryData, iCatLine: e.target.value })
                                    }
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
                                {categoryData.vIcon && (
                                    <img crossOrigin="anonymous" src={`${Img_Url}${categoryData.vIcon}`} alt="Original Preview" style={{ width: '100px', height: 'auto', marginTop: '10px' }} />
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
                    <h3>Total Category Data: {category.length}</h3>
                </div>
                <div className="side-container my-5">
                    <div className="table-responsive">
                        <table className="table text-center">
                            <thead>
                                <tr>
                                    <th>No.</th>
                                    <th>Name</th>
                                    <th>iNumber</th>
                                    <th>iAppType</th>
                                    <th>Icon</th>
                                    <th>Delete/Update</th>
                                </tr>
                            </thead>
                            <tbody>
                                {category.length > 0 ? (
                                    category.map((item, id) => (
                                        <tr key={id}>
                                            <td>{id + 1}</td>
                                            <td>{item.vName}</td>
                                            <td>{item.iNumber}</td>
                                            <td>{item.iAppType}</td>
                                            <td>
                                                <img
                                                    crossOrigin="anonymous"
                                                    src={`${Img_Url}${item.vIcon}`}
                                                    alt=""
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

                {/* Delete Modal */}
                <DeleteModal
                    deleteID={deleteID}
                    handleDelete={handleDelete}
                />

                {/* Update Modal */}
                <div className="modal fade" id="updateModal" tabIndex="-1" aria-labelledby="updateModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="updateModalLabel">Update Categroy</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit}>
                                    <div className="col-lg-3">
                                        <label>
                                            Name <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            value={categoryData.vName}
                                            type="text"
                                            name="name"
                                            id="name"
                                            className="form-control mb-3"
                                            onChange={(e) =>
                                                setCategoryData({ ...categoryData, vName: e.target.value })
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="col-lg-3">
                                        <label htmlFor="fontsize">
                                            iNumber
                                        </label>
                                        <input
                                            value={categoryData.iNumber}
                                            type="text"
                                            name="fontsize"
                                            id="fontsize"
                                            className="form-control mb-3"
                                            onChange={(e) =>
                                                setCategoryData({
                                                    ...categoryData,
                                                    iNumber: e.target.value,
                                                })
                                            }
                                        />
                                    </div>
                                    <div className="col-lg-3">
                                        <label htmlFor="vspace">iAppType</label>
                                        <input
                                            value={categoryData.iAppType}
                                            type="text"
                                            name="vspace"
                                            id="vspace"
                                            className="form-control mb-3"
                                            onChange={(e) =>
                                                setCategoryData({ ...categoryData, iAppType: e.target.value })
                                            }
                                        />
                                    </div>
                                    <div className="col-lg-3 d-none">
                                        <label htmlFor="vspace">iCatLine</label>
                                        <input
                                            value={categoryData.iCatLine}
                                            type="text"
                                            name="vspace"
                                            id="vspace"
                                            className="form-control mb-3"
                                            onChange={(e) =>
                                                setCategoryData({ ...categoryData, iCatLine: e.target.value })
                                            }
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
                                        {categoryData.vIcon && (
                                            <img crossOrigin="anonymous" src={`${Img_Url}${categoryData.vIcon}`} alt="Original Preview" style={{ width: '100px', height: 'auto', marginTop: '10px' }} />
                                        )}
                                    </div>
                                    <button type="submit" className="btn btn-primary" data-bs-dismiss="modal">
                                        Update Category
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
