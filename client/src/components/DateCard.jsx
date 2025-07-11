import React from 'react';
import './DateCard.css';

const DateCard = ({ date, onClick }) => {
  const coverImage = date.photoUrls && date.photoUrls.length > 0
    ? date.photoUrls[0]
    : null;

  return (
    <div className="date-card" onClick={() => onClick(date)}>
      {coverImage && (
        <img src={coverImage} alt={date.title} />
      )}
      <h3>{date.title}</h3>
      <p className="card-date">{new Date(date.date).toLocaleDateString()}</p>
    </div>
  );
};

export default DateCard;
