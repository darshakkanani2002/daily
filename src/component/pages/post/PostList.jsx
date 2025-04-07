import React from 'react'
import { Img_Url } from '../../Config'

export default function PostList({ post, currentPosts, setDeleteId, handleUpdate, handleSelect, handleSelectAll, selectedPosts }) {
    return (
        <div>
            <div className='side-container mt-5'>
                <div className='table-responsive'>
                    <div className="d-flex justify-content-end mb-2">
                        <button
                            className="btn btn-danger"
                            onClick={() => setDeleteId([homepostData._id])}
                            disabled={selectedPosts.length === 0}
                            data-bs-toggle="modal"
                            data-bs-target="#deleteModal"
                        >
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    </div>
                    <table className='table text-center'>
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
                                {/* <th>Language Code</th> */}
                                <th>iLike</th>
                                <th>iDownload</th>
                                <th>iShare</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(post) && post.length > 0 ? (
                                currentPosts.map((item, id) => (
                                    <tr key={id}>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={selectedPosts.includes(item._id)}
                                                onChange={() => handleSelect(item._id)}
                                            />
                                        </td>
                                        <td>{id + 1}</td>
                                        <td>
                                            <img crossOrigin="anonymous" src={`${Img_Url}${item.vImages}`} alt="images" style={{ width: '60px', height: 'auto' }} />
                                        </td>
                                        <td>{item.isTime ? 'true' : 'false'}</td>
                                        <td>{item.isTrending ? 'true' : 'false'}</td>
                                        <td>{item.isPremium ? 'true' : 'false'}</td>
                                        <td>{item.iLike}</td>
                                        <td>{item.iDownload}</td>
                                        <td>{item.iShare}</td>
                                        <td>
                                            {/* <button className='btn btn-danger mx-2' title='Delete' onClick={() => setDeleteId(item._id)} data-bs-toggle="modal" data-bs-target="#deleteModal">
                                                <i className="fa-solid fa-trash"></i>
                                            </button> */}
                                            <button className='btn btn-success mx-2' title='Update' onClick={() => handleUpdate(item)}>
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
            </div>
        </div>
    )
}
