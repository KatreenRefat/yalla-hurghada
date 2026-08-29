// src/components/hotels/Hoteldetailsmodel/Hoteldetailsmodel.jsx

import { useState } from "react";
import "./Hoteldetailsmodel.css";
import { AiOutlineClose } from "react-icons/ai";
import { FaBed, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useLanguage } from "../../../context/useLanguage";
import AuthChoiceModal from "../../AuthChoiceModal/AuthChoiceModal";

const content = {
  EN: {
    stars: "Stars",
    reviews: "reviews",
    priceLabel: "Price per night",
    included: "What's Included",
    close: "Close",
    book: "Continue to Booking",
    perNight: "/ night",
    items: ["Free WiFi", "Swimming Pool", "24/7 Concierge", "Air Conditioning", "Room Service"],
  },
  AR: {
    stars: "نجوم",
    reviews: "تقييم",
    priceLabel: "السعر لكل ليلة",
    included: "ما يشمله العرض",
    close: "إغلاق",
    book: "المتابعة للحجز",
    perNight: "/ ليلة",
    items: ["واي فاي مجاني", "حمام سباحة", "خدمة الاستقبال 24/7", "تكييف هواء", "خدمة الغرف"],
  },
  RU: {
    stars: "Звёзд",
    reviews: "отзывов",
    priceLabel: "Цена за ночь",
    included: "Что включено",
    close: "Закрыть",
    book: "Перейти к бронированию",
    perNight: "/ ночь",
    items: ["Бесплатный Wi-Fi", "Бассейн", "Консьерж 24/7", "Кондиционер", "Обслуживание номеров"],
  },
};

const HotelDetailsModal = ({ hotel, isOpen, onClose }) => {
  const { language } = useLanguage();
  const t = content[language] || content["EN"];
  const [imgIndex, setImgIndex] = useState(0);
  const [showAuthChoice, setShowAuthChoice] = useState(false);

  if (!isOpen || !hotel) return null;

  const getText = (field) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[language] || field["EN"] || Object.values(field)[0] || "";
  };

  const images = hotel.images?.length
    ? hotel.images
    : hotel.image
      ? [hotel.image]
      : ["https://placehold.co/600x400?text=Hotel"];

  const prevImg = () => setImgIndex((i) => (i - 1 + images.length) % images.length);
  const nextImg = () => setImgIndex((i) => (i + 1) % images.length);

  const starCount = hotel.starRating || Math.round(hotel.rating || 0);

  // ✅ بنفتح AuthChoiceModal فوق الـ Hotel Modal من غير ما نقفله
  const handleBooking = () => {
    setShowAuthChoice(true);
  };

  return (
    <>
      <div className="hotel-modal-overlay" onClick={onClose}>
        <div className="hotel-modal" onClick={(e) => e.stopPropagation()}>

          {/* ── LEFT: Image Gallery ── */}
          <div className="hotel-modal-left">
            <img
              src={images[imgIndex]}
              alt={getText(hotel.title)}
              className="hotel-modal-image"
              onError={(e) => { e.target.src = "https://placehold.co/600x400?text=Hotel"; }}
            />

            {images.length > 1 && (
              <>
                <button onClick={prevImg} style={{
                  position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                  width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.85)",
                  border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, zIndex: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}>
                  <FaChevronLeft />
                </button>
                <button onClick={nextImg} style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.85)",
                  border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, zIndex: 2, boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}>
                  <FaChevronRight />
                </button>

                <div style={{
                  position: "absolute", bottom: 52, left: "50%", transform: "translateX(-50%)",
                  display: "flex", gap: 6, zIndex: 2,
                }}>
                  {images.map((_, i) => (
                    <button key={i} onClick={() => setImgIndex(i)} style={{
                      width: i === imgIndex ? 20 : 8, height: 8, borderRadius: 4,
                      background: i === imgIndex ? "#fff" : "rgba(255,255,255,0.5)",
                      border: "none", cursor: "pointer", transition: "all 0.2s",
                    }} />
                  ))}
                </div>

                <div style={{
                  position: "absolute", bottom: 16, right: 16,
                  background: "rgba(0,0,0,0.5)", color: "#fff",
                  borderRadius: 20, padding: "4px 10px", fontSize: 12, zIndex: 2,
                }}>
                  {imgIndex + 1} / {images.length}
                </div>
              </>
            )}

            <div className="hotel-tags-modal">
              {(hotel.tags || []).slice(0, 3).map((tag) => (
                <span key={tag} className="hotel-tag-modal">{tag}</span>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Details ── */}
          <div className="hotel-modal-right">
            <button className="hotel-modal-close" onClick={onClose}>
              <AiOutlineClose />
            </button>

            <span className="hotel-type-badge">
              {"★".repeat(Math.min(starCount, 5))} {starCount} {t.stars}
            </span>

            <h2>{getText(hotel.title)}</h2>

            <div className="hotel-rating">
              {"⭐".repeat(Math.min(starCount, 5))}
              <span>
                {hotel.rating?.toFixed(1)}
                {hotel.reviews ? ` (${hotel.reviews} ${t.reviews})` : ""}
              </span>
            </div>

            <p className="hotel-location">📍 {getText(hotel.location)}</p>

            <div className="hotel-price-box">
              <p className="hotel-price-label">{t.priceLabel}</p>
              <h3>${hotel.price} {t.perNight}</h3>
            </div>

            <p className="hotel-description">{getText(hotel.description)}</p>

            <div className="hotel-included-services">
              <h4>{t.included}</h4>
              <ul>
                {(hotel.tags || []).map((tag) => (
                  <li key={tag}><FaBed /> {tag}</li>
                ))}
                {t.items.map((item) => (
                  <li key={item}>✓ {item}</li>
                ))}
              </ul>
            </div>

            <div className="hotel-modal-buttons">
              <button className="btn-secondary" onClick={onClose}>{t.close}</button>
              <button className="btn-primary" onClick={handleBooking}>{t.book}</button>
            </div>
          </div>

        </div>
      </div>

      {/* ✅ AuthChoiceModal يظهر فوق الـ Hotel Modal */}
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

export default HotelDetailsModal;