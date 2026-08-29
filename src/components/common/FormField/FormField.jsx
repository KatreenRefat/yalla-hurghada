// src/components/common/FormField/FormField.jsx

import "./FormField.css";

export default function FormField({ label, placeholder, value, onChange, type = "text", icon }) {
  return (
    <div className="form-field">
      <label className="form-field__label">{label}</label>
      <div className="form-field__input-wrapper">
        {icon && <span className="form-field__icon">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`form-field__input ${icon ? "form-field__input--with-icon" : ""}`}
        />
      </div>
    </div>
  );
}