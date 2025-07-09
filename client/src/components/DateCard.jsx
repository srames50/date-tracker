// src/components/DateCard.jsx
import React from 'react';
import './DateCard.css'; // we’ll style it like a Polaroid

const DateCard = ({ date, onClick }) => {
  return (
    <div className="date-card" onClick={() => onClick(date)}>
      <img
        src={date.photoUrl || 'https://via.placeholder.com/300x200?text=No+Photo'}
        alt={date.title}
      />
      <h3>{date.title}</h3>
    </div>
  );
};

export default DateCard;
