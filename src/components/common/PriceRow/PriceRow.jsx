// src/components/common/PriceRow/PriceRow.jsx

import "./PriceRow.css";

export default function PriceRow({ label, value, color, bold }) {
  return (
    <div className={`price-row ${bold ? "price-row--bold" : ""}`}>
      <span className="price-row__label">{label}</span>
      <span
        className="price-row__value"
        style={{ color: color || "#374151" }}
      >
        {value}
      </span>
    </div>
  );
}