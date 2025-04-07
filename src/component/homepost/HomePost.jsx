import React, { useEffect, useRef, useState } from 'react';
import LanguageSelect from '../language/LanguageSelected';
import Select from 'react-select';
import axios from 'axios';
import { Img_Url, Test_Api } from '../Config';
import DeleteModal from '../modal/DeleteModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from '../pagination/Pagination';

export default function HomePost({ selectedLanguage }) {
    const [homepost, setHomepost] = useState([]);
    const [homepostData, setHomePostData] = useState({
        _id: '',
        vCatId: '',
        vLanguageId: '',
        vImages: [],
        dtDate: '',
        isTrending: false,
        isPremium: false,
        isTime: false,
    });
    const [options, setOptions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const fileInputRef = useRef(null);
    const [deleteID, setDeleteId] = useState(null);
    const [preview, setPreview] = useState([]);
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10;
    const [selectedPosts, setSelectedPosts] = useState([]);

    useEffect(() => {
        loadOptions();
    }, [homepostData.vLanguageId]);

    useEffect(() => {
        if (homepostData.vCatId && homepostData.vLanguageId) {
            fetchData();
        }
    }, [homepostData.vCatId, homepostData.vLanguageId]);

    const fetchData = async (page = 1, limit = 33) => {
        try {
            const response = await axios.post(`${Test_Api}homePost/withoutLoginList`, {
                iPage: 1,
                iLimit: 33,
                vCatId: homepostData.vCatId,
                vLanguageId: homepostData.vLanguageId,
            });
            console.log('Home Post Data List', response.data.data);
            setHomepost(response.data.data);
        } catch (error) {
            console.error('Error fetching home posts:', error.response ? error.response.data : error.message);
        }
    };

    const handleLanguageSelect = (selectedLanguage) => {
        setHomePostData((prevState) => ({
            ...prevState,
            vLanguageId: selectedLanguage ? selectedLanguage.value : '',
            vCatId: ''
        }));
        setSelectedCategory(null);
        setOptions([]);
    };

    const loadOptions = async () => {
        try {
            console.log('Fetching categories with vLanguageId:', homepostData.vLanguageId);

            const response = await axios.post(
                `${Test_Api}homeCategory/list`,
                { vLanguageId: homepostData.vLanguageId },
                { headers: { 'Content-Type': 'application/json' } }
            );

            console.log('Categories API Response:', response.data.data);

            if (response.data.data) {
                const data = response.data.data.map((category) => ({
                    label: category.vName,
                    value: category._id,
                    id: category._id,
                }));
                setOptions(data);
            } else {
                console.error('No data found in response');
            }
        } catch (error) {
            console.error('Error fetching options:', error.response ? error.response.data : error.message);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const formattedDate = homepostData.dtDate
            ? new Date(homepostData.dtDate).toISOString().split('T')[0].replace(/-/g, '/')
            : '';
        
        const formData = new FormData();
        const catId = homepostData.vLanguageId || selectedCategory?.id;
        const vCatId = homepostData.vCatId || selectedCategory?.id;

        formData.append('vCatId', vCatId);
        formData.append('vLanguageId', catId);
        formData.append('isTime', homepostData.isTime);
        formData.append('isPremium', homepostData.isPremium);
        formData.append('isTrending', homepostData.isTrending);
        formData.append('dtDate', formattedDate);

        // Append multiple images
        homepostData.vImages.forEach((file) => {
            formData.append('vImages', file);
        });

        if (isUpdating) {
            formData.append('vHomePostId', currentId);

            axios.put(`${Test_Api}homePost/details`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
                .then(response => {
                    console.log('Home Post Updated:', response.data.data);
                    toast.success('Home Post updated successfully!');
                    resetForm();
                    fetchData();
                })
                .catch(error => {
                    console.error('Error updating data:', error.response ? error.response.data : error.message);
                    toast.error('Error updating home post');
                });
        } else {
            axios.post(`${Test_Api}homePost/details`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
                .then(response => {
                    console.log('Home Post Saved:', response.data.data);
                    toast.success('Home Post saved successfully!');
                    resetForm();
                    fetchData();
                })
                .catch(error => {
                    console.error('Error saving data:', error.response ? error.response.data : error.message);
                    toast.error('Error saving home post');
                });
        }
    };

    const resetForm = () => {
        setHomePostData({
            vCatId: '',
            vLanguageId: homepostData.vLanguageId, // Keep language selection
            vImages: [],
            dtDate: '',
            isTrending: false,
            isPremium: false,
            isTime: false,
        });
        setPreview([]);
        setIsUpdating(false);
        setCurrentId(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleCategorySelect = (selectedOption) => {
        setSelectedCategory(selectedOption);
        setHomePostData((prevState) => ({
            ...prevState,
            vCatId: selectedOption ? selectedOption.id : '',
        }));
    };

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setHomePostData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setHomePostData((prev) => ({
                ...prev,
                vImages: files,
            }));

            const previews = files.map(file => URL.createObjectURL(file));
            setPreview(previews);
        } else {
            setPreview([]);
        }
    };

    const handleUpdate = (post) => {
        const formattedDate = post.dtDate
            ? new Date(post.dtDate).toLocaleDateString('en-CA')
            : '';
            
        setIsUpdating(true);
        setCurrentId(post._id);
        setHomePostData({
            vCatId: post.vCatId,
            vLanguageId: post.vLanguageId,
            vImages: [], // Reset for new files
            dtDate: formattedDate,
            isTrending: post.isTrending,
            isPremium: post.isPremium,
            isTime: post.isTime,
        });

        // Set preview for existing images
        if (post.vImages) {
            const imageArray = Array.isArray(post.vImages) ? post.vImages : [post.vImages];
            setPreview(imageArray.map(img => `${Img_Url}${img}`));
        } else {
            setPreview([]);
        }
    };

    const handleSelect = (postId) => {
        setSelectedPosts((prev) =>
            prev.includes(postId)
                ? prev.filter((id) => id !== postId)
                : [...prev, postId]
        );
    };

    const handleSelectAll = () => {
        if (selectedPosts.length === currentPosts.length) {
            setSelectedPosts([]);
        } else {
            setSelectedPosts(currentPosts.map((item) => item._id));
        }
    };

    const handleDeleteSelected = () => {
        if (selectedPosts.length === 0) return;

        axios
            .delete(`${Test_Api}homePost/details`, {
                data: { arrImageId: selectedPosts },
            })
            .then(response => {
                console.log('Deleted:', response.data);
                fetchData();
                toast.success('Selected posts deleted successfully!');
                setSelectedPosts([]);
            })
            .catch(error => {
                console.error('Error deleting posts:', error.response ? error.response.data : error.message);
                toast.error('Error deleting posts');
            });
    };

    // Pagination Logic
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = homepost.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(homepost.length / postsPerPage);

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
            />
            <div className="side-container category-form p-3 mt-5">
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-12 mb-3">
                            <label>Language Id</label>
                            <LanguageSelect
                                value={selectedLanguage}
                                handleLanguageSelect={handleLanguageSelect}
                            />
                        </div>
                        <div className="col-12 mb-3">
                            <label>Category Name</label>
                            <Select
                                id="category"
                                className="mb-3"
                                value={selectedCategory}
                                onChange={handleCategorySelect}
                                options={options}
                                required
                            />
                        </div>
                        <div className='col-lg-4 position-relative mb-3'>
                            <label className='post-checkbox-lable'>isTime</label>
                            <input
                                type="checkbox"
                                name="isTime"
                                checked={homepostData.isTime}
                                onChange={handleChange}
                                className='post-checkbox-input-1'
                            />
                        </div>
                        <div className='col-lg-4 position-relative mb-3'>
                            <label className='post-checkbox-lable'>isTrending</label>
                            <input
                                type="checkbox"
                                name="isTrending"
                                checked={homepostData.isTrending}
                                onChange={handleChange}
                                className='post-checkbox-input-2'
                            />
                        </div>
                        <div className='col-lg-4 position-relative mb-3'>
                            <label className='post-checkbox-lable'>isPremium</label>
                            <input
                                type="checkbox"
                                name="isPremium"
                                checked={homepostData.isPremium}
                                onChange={handleChange}
                                className='post-checkbox-input-2'
                            />
                        </div>
                        <div className="col-lg-3">
                            <label>Date <span className="text-danger">*</span></label>
                            <input
                                value={homepostData.dtDate || ''}
                                type="date"
                                className="form-control mb-3"
                                onChange={(e) => setHomePostData({ ...homepostData, dtDate: e.target.value })}
                                required
                            />
                        </div>
                        <div className="col-lg-12">
                            <label>Images</label>
                            <input 
                                type="file" 
                                className="form-control mb-3" 
                                onChange={handleFileChange} 
                                ref={fileInputRef} 
                                multiple 
                                required={!isUpdating}
                            />
                            {preview.length > 0 && (
                                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                                    {preview.map((src, index) => (
                                        <img 
                                            key={index} 
                                            crossOrigin="anonymous" 
                                            src={src} 
                                            alt={`Preview ${index}`} 
                                            style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className='col-lg-12 mb-2 text-center'>
                            <button type="submit" className="btn btn-success me-2">
                                {isUpdating ? 'Update Data' : 'Add Data'}
                            </button>
                            {isUpdating && (
                                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
            <div className='text-center mt-4'>
                <h3>Total Home Post: {homepost.length}</h3>
            </div>
            <div className="table-responsive side-container mt-5">
                <div className="d-flex justify-content-end mb-2">
                    <button
                        className="btn btn-danger"
                        onClick={() => setDeleteId(selectedPosts)}
                        disabled={selectedPosts.length === 0}
                        data-bs-toggle="modal"
                        data-bs-target="#deleteModal"
                    >
                        <i className="fa-solid fa-trash"></i>
                    </button>
                </div>
                <table className="table text-center">
                    <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={selectedPosts.length === currentPosts.length && currentPosts.length > 0}
                                />
                            </th>
                            <th>No.</th>
                            <th>Images</th>
                            <th>Date</th>
                            <th>isTime</th>
                            <th>isTrending</th>
                            <th>isPremium</th>
                            <th>iLike</th>
                            <th>iDownload</th>
                            <th>iShare</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPosts.length > 0 ? (
                            currentPosts.map((item, id) => (
                                <tr key={id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedPosts.includes(item._id)}
                                            onChange={() => handleSelect(item._id)}
                                        />
                                    </td>
                                    <td>{id + 1 + (currentPage - 1) * postsPerPage}</td>
                                    <td>
                                        <img
                                            crossOrigin="anonymous"
                                            src={`${Img_Url}${item.vImages}`}
                                            alt={`${item.vImages}`}
                                            className="category-icon"
                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                        />
                                    </td>
                                    <td>{formatDate(item.dtDate)}</td>
                                    <td>{item.isTime ? "true" : "false"}</td>
                                    <td>{item.isTrending ? "true" : "false"}</td>
                                    <td>{item.isPremium ? "true" : "false"}</td>
                                    <td>{item.iLike}</td>
                                    <td>{item.iDownload}</td>
                                    <td>{item.iShare}</td>
                                    <td>
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
                                <td colSpan="11" className="p-2">
                                    <div className="data-not-found-bg">
                                        <img src="/images/question.png" alt="question" className="img-fluid" />
                                        <span className="table-data-not-found-text mt-1 d-block">
                                            Data Not Found !
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <DeleteModal
                deleteID={deleteID}
                handleDelete={handleDeleteSelected}
            />

            <Pagination
                handlePrevious={handlePrevious}
                handleNext={handleNext}
                currentPage={currentPage}
                totalPages={totalPages}
                handlePaginationClick={handlePaginationClick}
            />
        </div>
    );
}