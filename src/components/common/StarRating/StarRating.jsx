// src/components/common/StarRating/StarRating.jsx

import "./StarRating.css";

export default function StarRating({ rating }) {
  return (
    <span className="star-rating">
      <span className="star-rating__stars">
        {"★".repeat(Math.floor(rating))}{"☆".repeat(5 - Math.floor(rating))}
      </span>
      <span className="star-rating__value">{rating}</span>
    </span>
  );
}