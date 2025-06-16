// src/components/LogoutConfirmationModal.jsx
import React from 'react';
import './LogoutConfirmationModal.css';

const LogoutConfirmationModal = ({ show, onConfirm, onCancel }) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirm Logout</h2>
        <p>Are you sure you want to log out?</p>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="confirm-btn">Yes, Logout</button>
          <button onClick={onCancel} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmationModal;
