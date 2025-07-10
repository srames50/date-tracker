import React, { useState } from 'react';

const DateModal = ({ date, onClose }) => {
const [currentIndex, setCurrentIndex] = useState(0);
const photos = date.photoUrls || [];

const prevPhoto = () => {
    setCurrentIndex((currentIndex - 1 + photos.length) % photos.length);
  };

const nextPhoto = () => {
    setCurrentIndex((currentIndex + 1) % photos.length);
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
        </div>

      </div>
    </div>
  );
};

export default DateModal;
