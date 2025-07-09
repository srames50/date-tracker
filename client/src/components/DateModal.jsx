// src/components/DateModal.jsx
import React from 'react';
import './DateModal.css';

const DateModal = ({ date, onClose }) => {
  if (!date) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-left">
          <img src={date.photoUrl} alt={date.title} />
        </div>
        <div className="modal-right">
          <h2>{date.title}</h2>
          <p>{date.description}</p>
          {date.date && <p className="date">{new Date(date.date).toLocaleDateString()}</p>}
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default DateModal;
