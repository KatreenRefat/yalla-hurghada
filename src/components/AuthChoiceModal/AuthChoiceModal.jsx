// src/components/common/AuthChoiceModal/AuthChoiceModal.jsx

import "./AuthChoiceModal.css";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/useLanguage";

const content = {
  EN: {
    title: "Before you book...",
    question: "Do you have an account?",
    yes: "Yes, Login",
    no: "No, Sign Up",
    cancel: "Cancel",
  },
  AR: {
    title: "قبل الحجز...",
    question: "هل لديك حساب؟",
    yes: "نعم، تسجيل دخول",
    no: "لا، إنشاء حساب",
    cancel: "إلغاء",
  },
  RU: {
    title: "Перед бронированием...",
    question: "У вас есть аккаунт?",
    yes: "Да, войти",
    no: "Нет, зарегистрироваться",
    cancel: "Отмена",
  },
};

export default function AuthChoiceModal({ isOpen, onClose, onCloseAll }) {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = content[language] || content.EN;

  if (!isOpen) return null;

  const handleLogin = () => {
    onCloseAll();
    navigate("/login", { state: { from: { pathname: "/bookings" } } });
  };

  const handleSignup = () => {
    onCloseAll();
    navigate("/signup", { state: { from: { pathname: "/bookings" } } });
  };

  return (
    <div className="acm-overlay" onClick={onClose}>
      <div className="acm-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="acm-title">{t.title}</h3>
        <p className="acm-question">{t.question}</p>
        <div className="acm-buttons">
          <button className="acm-btn-yes" onClick={handleLogin}>{t.yes}</button>
          <button className="acm-btn-no" onClick={handleSignup}>{t.no}</button>
        </div>
        <button className="acm-cancel" onClick={onClose}>{t.cancel}</button>
      </div>
    </div>
  );
}