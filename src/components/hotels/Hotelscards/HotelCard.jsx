import "./HotelCard.css";
import HotelDetailsModal from "../Hoteldetailsmodel/Hoteldetailsmodel";
import { useState } from "react";
// ✅ صح
import { useLanguage } from "../../../context/useLanguage";
import {
  FaWifi, FaSwimmingPool, FaUtensils, FaCar, FaStar, FaMapMarkerAlt,
} from "react-icons/fa";

const content = {
  EN: { topRated: "Top Rated", stars: "Stars", from: "From", night: "/night", viewDetails: "View Details" },
  AR: { topRated: "الأعلى تقييماً", stars: "نجوم", from: "يبدأ من", night: "/ليلة", viewDetails: "عرض التفاصيل" },
  RU: { topRated: "Лучший выбор", stars: "Звёзд", from: "От", night: "/ночь", viewDetails: "Подробнее" },
};

const HotelCard = ({ hotel, index }) => {
  const { language } = useLanguage();
  const t = content[language] || content["EN"];
  const [isOpen, setIsOpen] = useState(false);

  if (!hotel) return null;

  // يدعم string مباشر أو object متعدد اللغات
  const getText = (field) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[language] || field["EN"] || Object.values(field)[0] || "";
  };

  // الصورة: ممكن تكون string أو array
  const mainImage = Array.isArray(hotel.images)
    ? hotel.images[0]
    : hotel.image || "";

  const starCount = hotel.starRating || Math.round(hotel.rating || 0);

  return (
    <>
      <div
        className="hotel-card"
        data-aos="fade-up"
        data-aos-duration="600"
        data-aos-delay={index * 100}
        data-aos-once="true"
      >
        {/* ── IMAGE ── */}
        <div className="hotel-card-image-wrapper">
          <img
            src={mainImage}
            alt={getText(hotel.title)}
            className="hotel-card-image"
            onError={(e) => { e.target.src = "https://placehold.co/400x230?text=Hotel"; }}
          />
          {hotel.isTopRated && (
            <span className="hotel-top-rated-badge">{t.topRated}</span>
          )}
          <div className="hotel-tags">
            {(hotel.tags || []).slice(0, 3).map((tag) => (
              <span key={tag} className="hotel-tag">{tag}</span>
            ))}
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div className="hotel-card-content">
          <span className="hotel-location">
            <FaMapMarkerAlt />
            {getText(hotel.location)}
          </span>

          <h3>{getText(hotel.title)}</h3>

          <p>
            {getText(hotel.description)?.slice(0, 120)}
            {getText(hotel.description)?.length > 120 ? "..." : ""}
          </p>

          {/* Stars */}
          <div className="hotel-rating">
            <div className="stars">
              {[...Array(Math.min(starCount, 5))].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
            <span>
              {hotel.rating?.toFixed(1)} {t.stars}
              {hotel.reviews ? ` (${hotel.reviews})` : ""}
            </span>
          </div>

          {/* Feature icons */}
          <div className="hotel-features">
            <span title="WiFi"><FaWifi /></span>
            <span title="Pool"><FaSwimmingPool /></span>
            <span title="Restaurant"><FaUtensils /></span>
            <span title="Transfer"><FaCar /></span>
          </div>

          {/* Price + Button */}
          <div className="hotel-card-footer">
            <div className="hotel-price">
              <span>{t.from}</span>
              <div className="price-row">
                <h4>${hotel.price}</h4>
                <small>{t.night}</small>
              </div>
            </div>
            <button className="hotel-book-btn" onClick={() => setIsOpen(true)}>
              {t.viewDetails}
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <HotelDetailsModal
        hotel={hotel}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};

export default HotelCard;
