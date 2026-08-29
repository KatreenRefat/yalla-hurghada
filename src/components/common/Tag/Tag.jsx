// src/components/common/Tag/Tag.jsx

import "./Tag.css";

export default function Tag({ label, color, textColor }) {
  return (
    <span
      className="tag"
      style={{
        background: color || "#e0f2fe",
        color: textColor || "#0369a1",
      }}
    >
      {label}
    </span>
  );
}