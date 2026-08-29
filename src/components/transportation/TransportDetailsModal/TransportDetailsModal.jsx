// src/components/Transport/TransportDetailsModal/TransportDetailsModal.jsx

import { useState } from "react";
import "./TransportDetailsModal.css";
import { AiOutlineClose } from "react-icons/ai";
import { FaUser, FaSuitcase, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useLanguage } from "../../../context/useLanguage";
import AuthChoiceModal from "../../AuthChoiceModal/AuthChoiceModal";

const translations = {
  EN: {
    perTrip: "per trip",
    seats: "Seats",
    included: "Included Services",
    close: "Close",
    book: "Continue to Booking",
    reviews: "reviews",
    brand: "Brand",
    type: "Type",
  },
  AR: {
    perTrip: "لكل رحلة",
    seats: "مقاعد",
    included: "الخدمات المشمولة",
    close: "إغلاق",
    book: "المتابعة للحجز",
    reviews: "تقييم",
    brand: "الماركة",
    type: "النوع",
  },
  RU: {
    perTrip: "за поездку",
    seats: "мест",
    included: "Включённые услуги",
    close: "Закрыть",
    book: "Перейти к бронированию",
    reviews: "отзывов",
    brand: "Марка",
    type: "Тип",
  },
};

const typeLabels = {
  "bus":            { EN: "Bus", AR: "أتوبيس", RU: "Автобус" },
  "private-driver": { EN: "Private Car", AR: "سيارة خاصة", RU: "Личный авто" },
  "car":            { EN: "Car", AR: "سيارة", RU: "Автомобиль" },
};

const TransportDetailsModal = ({ transport, isOpen, onClose }) => {
  const { language } = useLanguage();
  const t = translations[language] || translations.EN;
  const [imgIndex, setImgIndex] = useState(0);
  const [showAuthChoice, setShowAuthChoice] = useState(false);

  if (!isOpen || !transport) return null;

  const loc = (field) =>
    typeof field === "object" && !Array.isArray(field)
      ? field[language] || field.EN || ""
      : field || "";

  const tags = loc(transport.tags) || [];

  const images = transport.images?.length
    ? transport.images
    : transport.image
    ? [transport.image]
    : ["https://placehold.co/600x400?text=Transport"];

  const prevImg = () => setImgIndex((i) => (i - 1 + images.length) % images.length);
  const nextImg = () => setImgIndex((i) => (i + 1) % images.length);

  const typeLabel = typeLabels[transport.type]?.[language] || transport.type || "";

  const handleBooking = () => {
    setShowAuthChoice(true);
  };

  return (
    <>
      <div className="transport-modal-overlay" onClick={onClose}>
        <div className="transport-modal" onClick={(e) => e.stopPropagation()}>

          {/* ── LEFT: Image Gallery ── */}
          <div className="transport-modal-left">
            <img
              src={images[imgIndex]}
              alt={loc(transport.title)}
              className="transport-modal-image"
              onError={(e) => { e.target.src = "https://placehold.co/600x400?text=Transport"; }}
            />

            {images.length > 1 && (
              <>
                <button onClick={prevImg} style={{
                  position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                  width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.85)",
                  border: "none", cursor: "pointer", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 13, zIndex: 2,
                }}>
                  <FaChevronLeft />
                </button>
                <button onClick={nextImg} style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.85)",
                  border: "none", cursor: "pointer", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 13, zIndex: 2,
                }}>
                  <FaChevronRight />
                </button>

                <div style={{
                  position: "absolute", bottom: 52, left: "50%", transform: "translateX(-50%)",
                  display: "flex", gap: 6, zIndex: 2,
                }}>
                  {images.map((_, i) => (
                    <button key={i} onClick={() => setImgIndex(i)} style={{
                      width: i === imgIndex ? 20 : 8, height: 8,
                      borderRadius: 4, border: "none", cursor: "pointer",
                      background: i === imgIndex ? "#fff" : "rgba(255,255,255,0.5)",
                      transition: "all 0.2s",
                    }} />
                  ))}
                </div>

                <div style={{
                  position: "absolute", bottom: 16, right: 16, zIndex: 2,
                  background: "rgba(0,0,0,0.5)", color: "#fff",
                  borderRadius: 20, padding: "3px 10px", fontSize: 12,
                }}>
                  {imgIndex + 1} / {images.length}
                </div>
              </>
            )}

            <div className="transport-tags-modal">
              {tags.slice(0, 3).map((tag) => (
                <span key={tag} className="transport-tag-modal">{tag}</span>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Details ── */}
          <div className="transport-modal-right">
            <button className="transport-modal-close" onClick={onClose}>
              <AiOutlineClose size={22} />
            </button>

            <span className="transport-type-badge">{typeLabel}</span>

            <h2>
              {loc(transport.title)}
              {transport.brand && (
                <span style={{ fontSize: 15, fontWeight: 400, color: "#6b7280", marginLeft: 8 }}>
                  · {transport.brand}
                </span>
              )}
            </h2>

            <div className="transport-rating">
              ⭐⭐⭐⭐⭐
              <span>
                {transport.rating?.toFixed(1)}
                {transport.reviews ? ` (${transport.reviews} ${t.reviews})` : ""}
              </span>
            </div>

            <p className="transport-location">📍 {loc(transport.location)}</p>

            <div className="transport-price-box">
              <h3>
                ${transport.price}{" "}
                <span style={{ fontSize: 14, fontWeight: 400, color: "#6b7280" }}>{t.perTrip}</span>
              </h3>
              <div className="transport-features-modal">
                <FaUser /> {transport.availableSeats} {t.seats}
                <FaSuitcase style={{ marginLeft: 12 }} /> {transport.bags}
              </div>
            </div>

            <p className="transport-description">{loc(transport.description)}</p>

            <div className="transport-included-services">
              <h4>{t.included}</h4>
              <ul>
                {(transport.includedServices || []).map((service, idx) => (
                  <li key={idx}>&#10004; {service}</li>
                ))}
              </ul>
            </div>

            <div className="transport-modal-buttons">
              <button className="btn-secondary" onClick={onClose}>{t.close}</button>
              <button className="btn-primary" onClick={handleBooking}>{t.book}</button>
            </div>
          </div>

        </div>
      </div>

      {/* ✅ AuthChoiceModal فوق الـ Transport Modal */}
      <AuthChoiceModal
        isOpen={showAuthChoice}
        onClose={() => setShowAuthChoice(false)}
        onCloseAll={() => {
          setShowAuthChoice(false);
          onClose();
        }}
      />
    </>
  );
};

export default TransportDetailsModal;