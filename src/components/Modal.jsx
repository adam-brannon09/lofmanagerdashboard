import React from 'react';

function Modal({ selectedRow, closeModal }) {
  return (
    
    <div className="modal-overlay">
    <div className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">Hello!</h3>
        <p className="py-4">{`Modal content for row ${selectedRow}`}</p>
      </div>
      <button onClick={closeModal}>Close</button>
    </div>
  </div>
    
  );
}

export default Modal;
