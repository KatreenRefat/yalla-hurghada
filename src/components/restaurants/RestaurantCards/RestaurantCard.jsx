// src/components/Restaurants/RestaurantCards/RestaurantCard.jsx
// ─────────────────────────────────────────────────────────────
// بيتعامل مع البيانات الجاية من Supabase عبر الـ Backend
// ─────────────────────────────────────────────────────────────

import { useState } from "react";
import { FaMapMarkerAlt, FaStar, FaClock, FaUtensils } from "react-icons/fa";
import "./RestaurantCard.css";
import RestaurantDetailsModal from "../Restaurantdetailsmodel/Restaurantdetailsmodel";
import { useLanguage } from "../../../context/useLanguage";

const translations = {
  EN: { viewDetails: "View Details" },
  AR: { viewDetails: "عرض التفاصيل" },
  RU: { viewDetails: "Подробнее" },
};

const RestaurantCard = ({ restaurant, index }) => {
  const { language } = useLanguage();
  const t = translations[language] || translations.EN;
  const [isOpen, setIsOpen] = useState(false);

  if (!restaurant) return null;

  // يدعم string مباشر أو object { EN, AR, RU }
  const loc = (field) =>
    typeof field === "object" && !Array.isArray(field)
      ? field[language] || field.EN || ""
      : field || "";

  const tags = loc(restaurant.tags) || [];

  // الصورة: أول صورة من الـ array
  const mainImage = restaurant.image || (restaurant.images && restaurant.images[0]) || "";

  return (
    <>
      <div
        className="restaurant-card"
        data-aos="fade-up"
        data-aos-duration="600"
        data-aos-delay={index * 80}
        data-aos-once="true"
      >
        {/* ── IMAGE ── */}
        <div className="restaurant-card-image-wrapper">
          <img
            src={mainImage}
            alt={loc(restaurant.title)}
            className="restaurant-card-image"
            onError={(e) => { e.target.src = "https://placehold.co/400x220?text=Restaurant"; }}
          />
          <div className="restaurant-card-badges">
            <span className="restaurant-price-badge">{restaurant.priceLevel}</span>
            {tags.slice(0, 1).map((tag) => (
              <span key={tag} className="restaurant-tag-badge">{tag}</span>
            ))}
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div className="restaurant-card-content">
          <span className="restaurant-cuisine">
            <FaUtensils /> {restaurant.cuisine}
          </span>

          <h3>{loc(restaurant.title)}</h3>

          <p>
            {loc(restaurant.description)?.slice(0, 90)}
            {loc(restaurant.description)?.length > 90 ? "..." : ""}
          </p>

          <span className="restaurant-location">
            <FaMapMarkerAlt /> {loc(restaurant.location)}
          </span>

          <div className="restaurant-rating">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={i < Math.round(restaurant.rating) ? "star-filled" : "star-empty"}
              />
            ))}
            <span>
              {restaurant.rating?.toFixed(1)}
              {restaurant.reviews ? ` (${restaurant.reviews})` : ""}
            </span>
          </div>

          <div className="restaurant-tags">
            {tags.map((tag) => (
              <span key={tag} className="restaurant-ambience-tag">
                <FaUtensils /> {tag}
              </span>
            ))}
          </div>

          <div className="restaurant-card-footer">
            <span className="restaurant-hours">
              <FaClock /> {restaurant.openHours}
            </span>
            <button
              className="restaurant-reserve-btn"
              onClick={() => setIsOpen(true)}
            >
              {t.viewDetails}
            </button>
          </div>
        </div>
      </div>

      <RestaurantDetailsModal
        restaurant={restaurant}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default RestaurantCard;
