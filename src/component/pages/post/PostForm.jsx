import React from 'react'
import LanguageSelect from '../../language/LanguageSelected'
import Select from 'react-select';

export default function PostForm({
    options,
    handleSubmit,
    selectedLanguage,
    handleLanguageSelect,
    postData,
    setPostData,
    selectedCategory,
    handleCategorySelect,
    handleFileChange,
    fileInputRef,
    preview,
    vLanguageId,
    isUpdating,
    handleChange }) {
    return (
        <div>
            <div className='side-container category-form p-3'>
                <form onSubmit={handleSubmit}>
                    <div className='row'>
                        <div className='col-lg-12 mb-3'>
                            <label>Select Language <span className='text-danger'>*</span></label>
                            <LanguageSelect
                                value={selectedLanguage} // Ensure this matches the format expected by LanguageSelect
                                handleLanguageSelect={handleLanguageSelect}
                            />
                        </div>
                        <div className='col-lg-12 mb-3'>
                            <label htmlFor="category">Category Name<span className='text-danger'>*</span></label>
                            <Select
                                id="category"
                                className='mb-3'
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
                                checked={postData.isTime}
                                onChange={handleChange}
                                className='post-checkbox-input-1'
                            />
                        </div>
                        <div className='col-lg-4 position-relative mb-3'>
                            <label className='post-checkbox-lable'>isTrending</label>
                            <input
                                type="checkbox"
                                name="isTrending"
                                checked={postData.isTrending}
                                onChange={handleChange}
                                className='post-checkbox-input-2'
                            />
                        </div>

                        <div className='col-lg-4 position-relative mb-3'>
                            <label className='post-checkbox-lable'>isPremium</label>
                            <input
                                type="checkbox"
                                name="isPremium"
                                checked={postData.isPremium}
                                onChange={handleChange}
                                className='post-checkbox-input-2'
                            />
                        </div>
                        <div className='col-lg-6 mb-3'>
                            <label htmlFor="image">Image</label>
                            <input type="file" name="file" id="image" className='form-control'
                                onChange={handleFileChange}
                                ref={fileInputRef}
                                multiple
                            />
                            <div className="preview-container d-flex gap-2">
                                {preview && preview.length > 0 && preview.map((src, index) => (
                                    <img
                                        key={index}
                                        crossOrigin="anonymous"
                                        src={src}
                                        alt={`Preview ${index + 1}`}
                                        className="img-fluid mt-2 post-select-icon"
                                    />
                                ))}
                            </div>
                        </div>
                        <div className='col-lg-12 mb-2 text-center'>
                            <button type='submit' className='btn btn-success'>{isUpdating ? ("Update Dtata") : ("Add Data")}</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
