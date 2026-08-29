// src/components/Restaurants/Restaurantdetailsmodel/Restaurantdetailsmodel.jsx

import { useState } from "react";
import "./Restaurantdetailsmodel.css";
import { AiOutlineClose } from "react-icons/ai";
import { FaUtensils, FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";
import { useLanguage } from "../../../context/useLanguage";
import AuthChoiceModal from "../../AuthChoiceModal/AuthChoiceModal";

const translations = {
  EN: {
    reviews: "reviews",
    priceLabel: "Average Price",
    perPerson: "per person",
    whatsIncluded: "What's Included",
    tableReservation: "Table Reservation",
    menuAvailable: "Menu Available",
    support: "24/7 Support",
    openHours: "Open Hours",
    close: "Close",
    bookTable: "Book Table",
    photos: "Photos",
  },
  AR: {
    reviews: "تقييم",
    priceLabel: "متوسط السعر",
    perPerson: "للفرد",
    whatsIncluded: "ما يشمله",
    tableReservation: "حجز طاولة",
    menuAvailable: "القائمة متاحة",
    support: "دعم على مدار الساعة",
    openHours: "ساعات العمل",
    close: "إغلاق",
    bookTable: "احجز طاولة",
    photos: "الصور",
  },
  RU: {
    reviews: "отзывов",
    priceLabel: "Средняя цена",
    perPerson: "за человека",
    whatsIncluded: "Что включено",
    tableReservation: "Бронирование столика",
    menuAvailable: "Меню доступно",
    support: "Поддержка 24/7",
    openHours: "Часы работы",
    close: "Закрыть",
    bookTable: "Забронировать столик",
    photos: "Фото",
  },
};

const RestaurantDetailsModal = ({ restaurant, isOpen, onClose }) => {
  const { language } = useLanguage();
  const t = translations[language] || translations.EN;
  const [imgIndex, setImgIndex] = useState(0);
  const [showAuthChoice, setShowAuthChoice] = useState(false);

  if (!isOpen || !restaurant) return null;

  const loc = (field) =>
    typeof field === "object" && !Array.isArray(field)
      ? field[language] || field.EN || ""
      : field || "";

  const tags = loc(restaurant.tags) || [];

  const images = restaurant.images?.length
    ? restaurant.images
    : restaurant.image
    ? [restaurant.image]
    : ["https://placehold.co/600x400?text=Restaurant"];

  const prevImg = () => setImgIndex((i) => (i - 1 + images.length) % images.length);
  const nextImg = () => setImgIndex((i) => (i + 1) % images.length);

  const handleBooking = () => {
    setShowAuthChoice(true);
  };

  return (
    <>
      <div className="restaurant-modal-overlay" onClick={onClose}>
        <div className="restaurant-modal" onClick={(e) => e.stopPropagation()}>

          {/* ── LEFT: Image Gallery ── */}
          <div className="restaurant-modal-left">
            <img
              src={images[imgIndex]}
              alt={loc(restaurant.title)}
              className="restaurant-modal-image"
              onError={(e) => { e.target.src = "https://placehold.co/600x400?text=Restaurant"; }}
            />

            {images.length > 1 && (
              <>
                <button onClick={prevImg} style={{
                  position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                  width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.85)",
                  border: "none", cursor: "pointer", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 13, zIndex: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                }}>
                  <FaChevronLeft />
                </button>
                <button onClick={nextImg} style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.85)",
                  border: "none", cursor: "pointer", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 13, zIndex: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
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

            <div className="restaurant-tags-modal">
              {tags.slice(0, 3).map((tag) => (
                <span key={tag} className="restaurant-tag-modal">{tag}</span>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Details ── */}
          <div className="restaurant-modal-right">
            <button className="restaurant-modal-close" onClick={onClose}>
              <AiOutlineClose />
            </button>

            <span className="restaurant-type-badge">{restaurant.cuisine}</span>

            <h2>{loc(restaurant.title)}</h2>

            <div className="restaurant-rating">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={i < Math.round(restaurant.rating) ? "star-filled" : "star-empty"}
                />
              ))}
              <span>
                {restaurant.rating?.toFixed(1)}
                {restaurant.reviews ? ` (${restaurant.reviews} ${t.reviews})` : ""}
              </span>
            </div>

            <p className="restaurant-location">
              📍 {loc(restaurant.location)}
            </p>

            <div className="restaurant-price-box">
              <p className="restaurant-price-label">{t.priceLabel}</p>
              <h3>
                {restaurant.price ? `$${restaurant.price}` : restaurant.priceLevel}
              </h3>
              {restaurant.price ? (
                <span className="restaurant-price-sub">{t.perPerson}</span>
              ) : null}
            </div>

            <p className="restaurant-description">
              {loc(restaurant.description)}
            </p>

            <div className="restaurant-included-services">
              <h4>{t.whatsIncluded}</h4>
              <ul>
                {tags.map((tag) => (
                  <li key={tag}><FaUtensils /> {tag}</li>
                ))}
                <li>✓ {t.tableReservation}</li>
                <li>✓ {t.menuAvailable}</li>
                <li>✓ {t.support}</li>
              </ul>
            </div>

            <div className="restaurant-info">
              <h4>{t.openHours}</h4>
              <p>{restaurant.openHours}</p>
            </div>

            <div className="restaurant-modal-buttons">
              <button className="btn-secondary" onClick={onClose}>{t.close}</button>
              <button className="btn-primary" onClick={handleBooking}>{t.bookTable}</button>
            </div>
          </div>

        </div>
      </div>

      {/* AuthChoiceModal فوق الـ Restaurant Modal */}
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

export default RestaurantDetailsModal;