import React, { useState } from "react";
import "./TourDetailsModal.css";
import { AiOutlineClose } from "react-icons/ai";
import { FaUser, FaClock, FaStar } from "react-icons/fa";
import AuthChoiceModal from "../../AuthChoiceModal/AuthChoiceModal";
import { useLanguage } from "../../../context/useLanguage";

const translations = {
  EN: {
    reviews: "reviews",
    perPerson: "per person",
    includedServices: "Included Services",
    close: "Close",
    continueBooking: "Continue to Booking",
  },
  AR: {
    reviews: "تقييم",
    perPerson: "لكل شخص",
    includedServices: "الخدمات المشمولة",
    close: "إغلاق",
    continueBooking: "المتابعة للحجز",
  },
  RU: {
    reviews: "отзывов",
    perPerson: "за человека",
    includedServices: "Включённые услуги",
    close: "Закрыть",
    continueBooking: "Перейти к бронированию",
  },
};

const TourDetailsModal = ({ tour, isOpen, onClose }) => {
  const { language } = useLanguage();
  const t = translations[language] || translations.EN;
  const [showAuthChoice, setShowAuthChoice] = useState(false);

  if (!isOpen || !tour) return null;

  const handleBooking = () => setShowAuthChoice(true);

  return (
    <>
      <div className="tour-modal-overlay" onClick={onClose}>
        <div className="tour-modal" onClick={(e) => e.stopPropagation()}>

          <div className="tour-modal-left">
            <img src={tour.image} alt={tour.title} className="tour-modal-image" />

            <div className="tour-modal-gallery">
              {tour.gallery?.map((img, idx) => (
                <img key={idx} src={img} alt={`thumb-${idx}`} className="tour-modal-thumb" />
              ))}
            </div>

            <div className="tour-tags-modal">
              {tour.tags?.map((tag) => (
                <span key={tag} className="tour-tag-modal">{tag}</span>
              ))}
            </div>
          </div>

          <div className="tour-modal-right">
            <button className="tour-modal-close" onClick={onClose}>
              <AiOutlineClose size={24} />
            </button>

            <span className="tour-type-badge">{tour.type}</span>

            <h2>{tour.title}</h2>

            <div className="tour-rating">
              ⭐⭐⭐⭐⭐
              <span>{tour.rating} ({tour.reviews} {t.reviews})</span>
            </div>

            <p className="tour-location">📍 {tour.location}</p>

            <div className="tour-price-box">
              <h3>${tour.price} {t.perPerson}</h3>
              <div className="tour-features-modal">
                <span><FaClock /> {tour.duration}</span>
                <span><FaUser /> {tour.groupSize}</span>
                <span><FaStar /> {tour.rating}</span>
              </div>
            </div>

            <p className="tour-description">{tour.description}</p>

            <div className="tour-included-services">
              <h4>{t.includedServices}</h4>
              <ul>
                {tour.includedServices?.map((service, idx) => (
                  <li key={idx}>✔ {service}</li>
                ))}
              </ul>
            </div>

            <div className="tour-modal-buttons">
              <button className="btn-secondary" onClick={onClose}>{t.close}</button>
              <button className="btn-primary" onClick={handleBooking}>{t.continueBooking}</button>
            </div>
          </div>
        </div>
      </div>

      <AuthChoiceModal
        isOpen={showAuthChoice}
        onClose={() => setShowAuthChoice(false)}
        onCloseAll={() => { setShowAuthChoice(false); onClose(); }}
      />
    </>
  );
};

export default TourDetailsModal;