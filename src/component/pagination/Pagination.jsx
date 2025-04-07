import React from 'react'

export default function Pagination({ handlePrevious, handleNext, currentPage, totalPages, handlePaginationClick }) {
    const renderPageButtons = () => {
        const pageButtons = [];

        if (totalPages <= 5) {
            // If there are 5 or fewer pages, show all page buttons
            for (let i = 1; i <= totalPages; i++) {
                pageButtons.push(
                    <button
                        key={i}
                        className={`page-button ${currentPage === i ? 'active' : ''}`}
                        onClick={() => handlePaginationClick(i)}
                    >
                        {i}
                    </button>
                );
            }
        } else {
            // Show first 3 pages, then ellipsis, then last page
            for (let i = 1; i <= 3; i++) {
                pageButtons.push(
                    <button
                        key={i}
                        className={`page-button ${currentPage === i ? 'active' : ''}`}
                        onClick={() => handlePaginationClick(i)}
                    >
                        {i}
                    </button>
                );
            }

            if (currentPage > 3 && currentPage < totalPages - 2) {
                pageButtons.push(
                    <span key="ellipsis" className="ellipsis">...</span>
                );
                pageButtons.push(
                    <button
                        key={totalPages}
                        className={`page-button ${currentPage === totalPages ? 'active' : ''}`}
                        onClick={() => handlePaginationClick(totalPages)}
                    >
                        {totalPages}
                    </button>
                );
            }
        }

        return pageButtons;
    };

    return (
        <div>
            {/* Pagination Controls */}
            <div className="container mb-5">
                {/* Form and other post logic */}
                {/* Pagination */}
                <div className="pagination-controls">
                    <button
                        className="arrow-button"
                        onClick={handlePrevious}
                        disabled={currentPage === 1}
                    >
                        <i className="fa-solid fa-angles-left"></i>
                    </button>

                    {/* Page Buttons */}
                    {renderPageButtons()}
                    <button
                        className="arrow-button"
                        onClick={handleNext}
                        disabled={currentPage === totalPages}
                    >
                        <i className="fa-solid fa-angles-right"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}
