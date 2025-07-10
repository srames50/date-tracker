import React, { useState } from 'react';
import './DateModal.css';

const DateModal = ({ date, onClose, onDelete }) => {
const [currentIndex, setCurrentIndex] = useState(0);
const photos = date.photoUrls || [];

const prevPhoto = () => {
    setCurrentIndex((currentIndex - 1 + photos.length) % photos.length);
  };

const nextPhoto = () => {
    setCurrentIndex((currentIndex + 1) % photos.length);
  };

const handleDelete = async () => {
  const confirm = window.confirm('Are you sure you want to delete this date?');
  if (!confirm) return;

  try {
    const res = await fetch(`http://localhost:5050/api/dates/${date._id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      onDelete(date._id); // Update frontend state
      onClose();          // Close modal
    } else {
      console.error('Failed to delete');
    }
  } catch (err) {
    console.error(err);
  }
};


  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>

        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">&times;</button>

        <div className="modal-left">
            {photos.length > 0 ? (
                <div className="slideshow">
                {photos.length > 1 && (
                    <button className="prev" onClick={prevPhoto} aria-label="Previous photo">&#8249;</button>
                )}
                <img src={photos[currentIndex]} alt={`Photo ${currentIndex + 1}`} />
                {photos.length > 1 && (
                    <button className="next" onClick={nextPhoto} aria-label="Next photo">&#8250;</button>
                )}
                </div>
            ) : (
                <p>No photos available</p>
            )}
        </div>


        <div className="modal-right">
          <h2>{date.title}</h2>
          <p>{date.description}</p>
          <p className="date">{new Date(date.date).toLocaleDateString()}</p>
          <button onClick={handleDelete} className="delete-btn">Delete Date</button>
        </div>

      </div>
    </div>
  );
};

export default DateModal;
