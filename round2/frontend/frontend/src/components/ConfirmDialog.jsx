import React from "react";

export default function ConfirmDialog({
    open,
    title = "Confirm",
    message = "Are you sure?",
    confirmText = "Yes",
    cancelText = "No",
    onConfirm,
    onCancel,
}) {
    if (!open) return null;
    return (
        <div className="modal-overlay"
        onClick={onCancel}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>

                <h3 className="modal-card__title">{title}</h3>
                <p className="modal-card__message">{message}</p>
                <div className="modal-card__actions">
                    <button type="button" className="btn btn-secondary" onClick={onCancel}>{cancelText}</button>
                    <button type="button" className="btn btn-danger" onClick={onConfirm}>{confirmText}</button>
                </div>
            </div>
  
        </div>

    );
}