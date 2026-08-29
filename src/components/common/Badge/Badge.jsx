// src/components/common/Badge/Badge.jsx

import "./Badge.css";

export default function Badge({ children, color }) {
  return (
    <span
      className="badge"
      style={{ background: color || "#10b981" }}
    >
      {children}
    </span>
  );
}