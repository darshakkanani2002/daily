import React, { useEffect, useRef, useState } from 'react';
import BussinessLanguageSelect from './BussinessLanguageSelect';
import Select from 'react-select';
import { Img_Url, Test_Api } from '../Config';
import axios from 'axios';
import DeleteModal from '../modal/DeleteModal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from '../pagination/Pagination';
import LanguageSelect from '../language/LanguageSelected';

export default function BussinessPost({ selectedLanguage }) {
    const [bussinessPost, setBussinessPost] = useState([]);
    const [bussinessPostData, setBussinessPostData] = useState({
        _id: '',
        vCatId: '',
        vLanguageId: '',
        vImages: [],
        isTrending: false,
        isPremium: false,
        isTime: false,
    });
    const [options, setOptions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [deleteID, setDeleteId] = useState(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10;
    const [selectedPosts, setSelectedPosts] = useState([]);

    useEffect(() => {
        loadOptions();
    }, [bussinessPostData.vLanguageId]);

    useEffect(() => {
        if (bussinessPostData.vCatId && bussinessPostData.vLanguageId) {
            fetchData();
        }
    }, [bussinessPostData.vCatId, bussinessPostData.vLanguageId]);

    const fetchData = async () => {
        try {
            const response = await axios.post(`${Test_Api}businessCatPost/withoutLoginList`, {
                iPage: 1,
                iLimit: 33,
                vCatId: bussinessPostData.vCatId,
                vLanguageId: bussinessPostData.vLanguageId,
            });
            setBussinessPost(response.data.data);
        } catch (error) {
            console.error('Error fetching business posts:', error);
            toast.error('Failed to fetch posts');
        }
    };

    const handleLanguageSelect = (selectedLanguage) => {
        setBussinessPostData(prevState => ({
            ...prevState,
            vLanguageId: selectedLanguage ? selectedLanguage.value : '',
            vCatId: ''
        }));
        setSelectedCategory(null);
    };

    const handleBusinessLanguageSelect = (selectedLanguage) => {
        setBussinessPostData(prevState => ({
            ...prevState,
            vLanguageId: selectedLanguage ? selectedLanguage.value : '',
            vCatId: ''
        }));
        setSelectedCategory(null);
        setOptions([]);
    };

    const handleChange = (e) => {
        const { name, type, checked, value } = e.target;
        setBussinessPostData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setBussinessPostData(prev => ({
                ...prev,
                vImages: files
            }));

            const previews = files.map(file => URL.createObjectURL(file));
            setPreview(previews);
        } else {
            setPreview([]);
        }
    };

    const handleCategorySelect = (selectedOption) => {
        setSelectedCategory(selectedOption);
        setBussinessPostData(prevState => ({
            ...prevState,
            vCatId: selectedOption ? selectedOption.id : '',
        }));
    };

    const loadOptions = async () => {
        try {
            const response = await axios.post(
                `${Test_Api}businessSubCat/list`,
                { vCatId: bussinessPostData.vLanguageId },
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.data.data) {
                const data = response.data.data.map(category => ({
                    label: category.vName,
                    value: category._id,
                    id: category._id,
                }));
                setOptions(data);
            }
        } catch (error) {
            console.error('Error fetching options:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        const catId = bussinessPostData.vLanguageId || selectedCategory?.id;
        const vCatId = bussinessPostData.vCatId || selectedCategory?.id;

        formData.append('vCatId', vCatId);
        formData.append('vLanguageId', catId);
        formData.append('isTime', bussinessPostData.isTime);
        formData.append('isPremium', bussinessPostData.isPremium);
        formData.append('isTrending', bussinessPostData.isTrending);

        // Append all images
        bussinessPostData.vImages.forEach(file => {
            formData.append('vImages', file);
        });

        try {
            if (isUpdating) {
                formData.append('vHomePostId', currentId);
                await axios.put(`${Test_Api}businessCatPost/details`, { vHomePostId: currentId, vCatId: vCatId, vLanguageId: catId, isTime: bussinessPostData.isTime, isPremium: bussinessPostData.isPremium, isTrending: bussinessPostData.isTrending }, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Post updated successfully!');
            } else {
                await axios.post(`${Test_Api}businessCatPost/details`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                toast.success('Post created successfully!');
            }
            resetForm();
            fetchData();
        } catch (error) {
            console.error('Error saving data:', error);
            toast.error('Failed to save post');
        }
    };

    const handleUpdate = (post) => {
        setIsUpdating(true);
        setCurrentId(post._id);
        setBussinessPostData({
            vCatId: post.vCatId,
            vLanguageId: post.vLanguageId,
            vImages: [], // Reset for new files
            isTrending: post.isTrending,
            isPremium: post.isPremium,
            isTime: post.isTime,
        });

        // Set preview for existing images
        if (post.vImages) {
            const imageArray = Array.isArray(post.vImages) ? post.vImages : [post.vImages];
            setPreview(imageArray.map(img => `${Img_Url}${img}`));
        }
    };

    const handleSelect = (postId) => {
        setSelectedPosts(prev =>
            prev.includes(postId)
                ? prev.filter(id => id !== postId)
                : [...prev, postId]
        );
    };

    const handleSelectAll = () => {
        if (selectedPosts.length === currentPosts.length) {
            setSelectedPosts([]);
        } else {
            setSelectedPosts(currentPosts.map(item => item._id));
        }
    };

    const handleDelete = async () => {
        if (selectedPosts.length === 0) return;

        try {
            await axios.delete(`${Test_Api}businessCatPost/details`, {
                data: { arrImageId: selectedPosts },
            });
            toast.success('Posts deleted successfully!');

            // Reset current page if deleting all items on the current page
            const remainingItems = bussinessPost.length - selectedPosts.length;
            const newTotalPages = Math.ceil(remainingItems / postsPerPage);
            if (currentPage > newTotalPages && newTotalPages > 0) {
                setCurrentPage(newTotalPages);
            }

            fetchData();
            setSelectedPosts([]);
        } catch (error) {
            console.error('Error deleting posts:', error);
            toast.error(error.response?.data?.message || 'Failed to delete posts');
        }
    };

    const resetForm = () => {
        setBussinessPostData({
            vCatId: '',
            vLanguageId: bussinessPostData.vLanguageId,
            vImages: [],
            isTrending: false,
            isPremium: false,
            isTime: false,
        });
        setPreview([]);
        setIsUpdating(false);
        setCurrentId(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Pagination Logic
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = bussinessPost.slice(indexOfFirstPost, indexOfLastPost);
    const totalPages = Math.ceil(bussinessPost.length / postsPerPage);

    const handlePaginationClick = (pageNumber) => setCurrentPage(pageNumber);
    const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const handlePrevious = () => currentPage > 1 && setCurrentPage(currentPage - 1);

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
                        <div className='col-12 mb-3'>
                            <label>Language Id</label>
                            <LanguageSelect
                                value={selectedLanguage}
                                handleLanguageSelect={handleLanguageSelect}
                            />
                        </div>
                        <div className="col-12 mb-3">
                            <label>Business Category</label>
                            <BussinessLanguageSelect
                                value={selectedLanguage}
                                handleBusinessLanguageSelect={handleBusinessLanguageSelect}
                            />
                        </div>
                        <div className="col-12 mb-3">
                            <label>Business Sub Category Name</label>
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
                                checked={bussinessPostData.isTime}
                                onChange={handleChange}
                                className='post-checkbox-input-1'
                            />
                        </div>
                        <div className='col-lg-4 position-relative mb-3'>
                            <label className='post-checkbox-lable'>isTrending</label>
                            <input
                                type="checkbox"
                                name="isTrending"
                                checked={bussinessPostData.isTrending}
                                onChange={handleChange}
                                className='post-checkbox-input-2'
                            />
                        </div>
                        <div className='col-lg-4 position-relative mb-3'>
                            <label className='post-checkbox-lable'>isPremium</label>
                            <input
                                type="checkbox"
                                name="isPremium"
                                checked={bussinessPostData.isPremium}
                                onChange={handleChange}
                                className='post-checkbox-input-2'
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
                <h3>Total Business Posts: {bussinessPost.length}</h3>
            </div>

            <div className="table-responsive side-container mt-2">
                <div className="d-flex justify-content-end mb-2">
                    <button
                        className="btn btn-danger"
                        onClick={() => setDeleteId(selectedPosts)}
                        disabled={selectedPosts.length === 0}
                        data-bs-toggle="modal"
                        data-bs-target="#deleteModal"
                    >
                        <i className="fa-solid fa-trash"></i> Delete Selected
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
                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                        />
                                    </td>
                                    <td>{item.isTime ? 'true' : 'false'}</td>
                                    <td>{item.isTrending ? 'true' : 'false'}</td>
                                    <td>{item.isPremium ? 'true' : 'false'}</td>
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
                            <tr className='text-center'>
                                <td colSpan="10" className='p-2'>
                                    <div className='data-not-found-bg'>
                                        <img src="/images/question.png" alt="question" className='img-fluid' />
                                        <span className='table-data-not-found-text mt-1 d-block'>Data Not Found !</span>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <DeleteModal
                deleteID={deleteID}
                handleDelete={handleDelete}
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