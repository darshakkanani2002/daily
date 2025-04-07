import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import axios from 'axios';
import { Img_Url, Test_Api } from '../../Config';
import LanguageSelect from '../../language/LanguageSelected';
import DeleteModal from '../../modal/DeleteModal';
import { toast, ToastContainer, } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from '../../pagination/Pagination';
import PostList from './PostList';
import PostForm from './PostForm';
export default function Post({ selectedLanguage }) {
    const [options, setOptions] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [post, setPost] = useState([]);
    const [postData, setPostData] = useState({
        _id: '',
        vCatId: '',
        vPostId: '',
        vLanguageId: '',
        vImages: '',
        vLanguageCode: '',
        isTime: false,
        isTrending: false,
        isPremium: false,
    });

    const fileInputRef = useRef(null);
    const [preview, setPreview] = useState(null);
    const [deleteID, setDeleteId] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false)
    const [currentId, setCurrentId] = useState(null)
    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 10;  // Display 12 posts per page
    const [selectedPosts, setSelectedPosts] = useState([]);

    useEffect(() => {
        if (postData.vLanguageId) {
            loadOptions();
        }
    }, [postData.vLanguageId]);

    // Fetch Data --------------------------------------------------------------------
    const fetchData = (vCatId, page = 1, limit = 33) => {
        if (!vCatId) {
            console.error('vCatId is missing.');
            return;
        }
        axios.post(`${Test_Api}post/withoutLoginList`, { vCatId, iPage: page, iLimit: limit })
            .then(response => {
                console.log("Post Data List ==>", response.data.data);
                setPost(response.data.data); // Ensure response.data.data exists
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };


    // Category Load Option Data ---------------------------------------------------------------------------------------
    const loadOptions = async () => {
        if (!postData.vLanguageId) return;

        try {
            console.log('Fetching categories with vLanguageId:', postData.vLanguageId);

            const response = await axios.post(`${Test_Api}category/list`, {
                vLanguageId: postData.vLanguageId
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Categories API Response:', response.data.data);

            if (response.data.data) {
                const data = response.data.data.map(category => ({
                    label: category.vName,
                    value: category._id,
                    id: category._id
                }));
                setOptions(data);
            } else {
                console.error('No data found in response');
            }
        } catch (error) {
            console.error('Error fetching options:', error.response ? error.response.data : error.message);
        }
    };

    // For language Id select Data ---------------------------------------------------------------------------------------
    const handleLanguageSelect = (selectedLanguage) => {
        setPostData(prevState => ({
            ...prevState,
            vLanguageId: selectedLanguage ? selectedLanguage.value : '',
            vCatId: '' // Reset category ID
        }));
        setSelectedCategory(null); // Reset selected category
        if (selectedLanguage) {
            console.log("Selected Language ===>", selectedLanguage);
        }
    };

    // Category Select Handle ---------------------------------------------------------------------------------------------
    const handleCategorySelect = (selectedOption) => {
        setSelectedCategory(selectedOption);
        setPostData(prevState => ({
            ...prevState,
            vCatId: selectedOption ? selectedOption.id : ''
        }));
        console.log("Selected Category ===>", selectedOption);

        // Fetch data for the selected category
        if (selectedOption && selectedOption.id) {
            fetchData(selectedOption.id); // Pass the selected category id to fetch data
        }
    };

    // Handle Cahnge for isTime and isTrending Checkbox----------------------------------------
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Log to console if isTime checkbox is changed
        if (name === 'isTime') {
            console.log('isTime:', checked);
        } else if (name === 'isTrending') {
            console.log('isTrending', checked)
        } else if (name === 'isPremium') {
            console.log('isPremium', checked)
        }

        setPostData({
            ...postData,
            [name]: type === 'checkbox' ? checked : value
        });
    };
    // Handle File Change -----------------------------------------------------------------
    // Inside the Post component

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length) {
            setPostData({ ...postData, vImages: files }); // Store all selected files
            setPreview(files.map(file => URL.createObjectURL(file))); // Create previews
        }
    };


    const handleUpdate = (post) => {
        setIsUpdating(true); // Set the state to updating mode
        setCurrentId(post._id); // Store the current post ID

        setPostData({
            _id: post._id, // Set the _id as the vFrameId
            vCatId: post.vCatId, // Ensure category ID is set
            isTime: post.isTime,
            isPremium: post.isPremium,
            isTrending: post.isTrending,
            vLanguageId: post.vLanguageId,
        });

        // Set preview image for the current post
        if (post.vImages) {
            setPreview(`${Img_Url}${post.vImages}`); // Construct full URL if needed
        } else {
            setPreview(null); // Reset preview if no image
        }
    };

// Handle form submission to ensure multiple images are sent correctly
const handleSubmit = (e, _id = postData._id) => {
    e.preventDefault();

    const catId = postData.vCatId || selectedCategory?.id;
    const formData = new FormData();

    // Append all post data
    formData.append('vLanguageId', postData.vLanguageId);
    formData.append('vCatId', postData.vCatId);
    formData.append('isTime', postData.isTime);
    formData.append('isPremium', postData.isPremium);
    formData.append('isTrending', postData.isTrending);

    // Append multiple images
    if (postData.vImages && postData.vImages.length) {
        postData.vImages.forEach((image, index) => {
            formData.append(`vImages`, image);  // Backend should accept multiple files
        });
    }

    if (isUpdating) {
        if (!postData._id) {
            toast.error("vPostId is missing! Please try again.");
            return;
        }

        formData.append('vPostId', postData._id); // Ensure vPostId is sent

        axios.put(`${Test_Api}post/details`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then(response => {
                console.log("Post Updated Data:", response.data.data);
                setIsUpdating(false);
                toast.success("Post updated successfully!");

                fetchData(catId);
                setPostData({
                    ...postData,
                    vImages: postData.vImages.length ? postData.vImages : response.data.data.vImages // Retain images if no new ones are uploaded
                });
            })
            .catch(error => {
                console.error("Update failed:", error.response?.data || error.message);
                toast.error("Update failed. Please check the category selection.");
            });

    } else {
        // Creating a new post
        axios.post(`${Test_Api}post/details`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
            .then(response => {
                const responseData = response.data.data;
                setPostData(prevState => ({
                    ...prevState,
                    vCatId: responseData.vCatId,
                    _id: responseData._id,
                    vLanguageCode: responseData.vLanguageCode
                }));
                console.log("Created Post Data ==>", response.data);

                resetForm();
                toast.success("Post created successfully!");
                fetchData(catId);
            })
            .catch(error => {
                console.error("Creation failed:", error.response?.data || error.message);
                toast.error("Creation failed. Please check the category selection.");
            });
    }
};


    // Toggle single selection
    const handleSelect = (postId) => {
        setSelectedPosts((prev) =>
            prev.includes(postId)
                ? prev.filter((id) => id !== postId)
                : [...prev, postId]
        );
    };

    // Toggle select all
    const handleSelectAll = () => {
        if (selectedPosts.length === currentPosts.length) {
            setSelectedPosts([]);
        } else {
            setSelectedPosts(currentPosts.map((item) => item._id));
        }
    };

    // Delete Handle ----------------------------------------------
    const handleDelete = () => {
        const catId = postData.vCatId || selectedCategory?.id;
        if (selectedPosts.length === 0) return; // Ensure there are selected posts

        axios
            .delete(`${Test_Api}post/details`, {
                data: { arrImageId: selectedPosts }, // Send all selected post IDs
            })
            .then(response => {
                console.log('Deleted:', response.data);
                fetchData(catId);
                toast.success('Selected posts deleted successfully!');
                setSelectedPosts([]); // Clear selection after deletion
            })
            .catch(error => {
                console.error('Error deleting posts:', error.response ? error.response.data : error.message);
            });
    };



    // --------------------------------------------------------------------
    const resetForm = () => {
        setPostData({
            vLanguageId: postData.vLanguageId,
            vCatId: postData.vCatId,
            vImages: '',
            vLanguageCode: postData.vLanguageCode
        });
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';  // Reset file input
        }
        setIsUpdating(false);  // Reset update mode
    };

    // Pagination Logic ---------------------------------------------------------------------
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = post.slice(indexOfFirstPost, indexOfLastPost);

    const totalPages = Math.ceil(post.length / postsPerPage);

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
                transition:Bounce
            />
            <div className='my-3'>
                {/* Post Form --------------------------------------------------------------------------- */}
                <PostForm
                    handleSubmit={handleSubmit}
                    selectedLanguag={selectedLanguage}
                    handleLanguageSelect={handleLanguageSelect}
                    postData={postData}
                    setPostData={setPostData}
                    selectedCategory={selectedCategory}
                    handleCategorySelect={handleCategorySelect}
                    handleFileChange={handleFileChange}
                    vLanguageId={postData.vLanguageId}
                    fileInputRef={fileInputRef}
                    preview={preview}
                    isUpdating={isUpdating}
                    options={options}
                    handleChange={handleChange}
                />

                <div className='text-center mt-4'>
                    <h3>Total Post Data: {post.length}</h3>
                </div>
                {/* Post List Data ---------------------------------------------------------------------- */}
                <PostList
                    post={post}
                    currentPosts={currentPosts}
                    setDeleteId={setDeleteId}
                    handleUpdate={handleUpdate}
                    handleSelect={handleSelect}
                    handleSelectAll={handleSelectAll}
                    selectedPosts={selectedPosts}
                ></PostList>
                {/* Delete Modal */}
                <DeleteModal deleteID={deleteID} handleDelete={handleDelete}></DeleteModal>
            </div>

            {/* Pagination Controls */}
            <div className="container">
                {/* Form and other post logic */}
                {/* Pagination */}
                <Pagination
                    handlePrevious={handlePrevious}
                    handleNext={handleNext}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePaginationClick={handlePaginationClick}
                ></Pagination>
            </div>
        </div>
    );
}
