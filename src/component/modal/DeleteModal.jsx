import React from 'react'

export default function DeleteModal({ deleteID, handleDelete }) {
    return (
        <div>
            <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                <div className="modal-dialog d-flex m-auto modal-dialog-centered">
                    <div className="modal-content ">
                        <div className="modal-header justify-content-between px-3 py-3">
                            <h5 className="modal-title" id="deleteModalLabel">Delete Category</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body px-3 py-3">
                            Are you sure you want to delete this category?
                        </div>
                        <div className="modal-footer px-3 py-3">
                            <button type="button" className="btn btn-success p-2 mx-2" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" className="btn btn-danger p-2 mx-2" data-bs-dismiss="modal" onClick={handleDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
