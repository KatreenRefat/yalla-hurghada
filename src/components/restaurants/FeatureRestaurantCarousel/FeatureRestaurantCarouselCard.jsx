// src/components/Restaurants/FeatureRestaurantCarousel/FeatureRestaurantCarouselCard.jsx

import "./FeatureRestaurantCarouselCard.css";
import { Link } from "react-router-dom";
import { useLanguage } from "../../../context/useLanguage";
import {
  FaWifi, FaSnowflake, FaCrown, FaUser, FaHeadset,
  FaUsers, FaClock, FaTimesCircle, FaBed, FaUtensilSpoon, FaWater,
} from "react-icons/fa";

const iconMap = {
  wifi: <FaWifi />, snowflake: <FaSnowflake />, crown: <FaCrown />,
  person: <FaUser />, headset: <FaHeadset />, people: <FaUsers />,
  clock: <FaClock />, "x-circle": <FaTimesCircle />, bed: <FaBed />,
  utensils: <FaUtensilSpoon />, waves: <FaWater />,
};

const translations = {
  EN: { reviews: "reviews", bookNow: "Book Now →" },
  AR: { reviews: "تقييم", bookNow: "احجز الآن ←" },
  RU: { reviews: "отзывов", bookNow: "Забронировать →" },
};

const FeatureRestaurantCarouselCard = ({ data }) => {
  const { language } = useLanguage();
  const t = translations[language] || translations.EN;

  return (
    <div className="featured-carousel-card">
      <div className="featured-carousel-card-image">
        <img src={data.image} alt={data.title} />
        <div className="featured-carousel-badge">
          {data.badges.map((badge, i) => (
            <span key={i} className="featured-carousel-badge-item">{badge}</span>
          ))}
        </div>
      </div>

      <div className="featured-carousel-card-content">
        <span className="featured-carousel-category">{data.category}</span>
        <h3>{data.title}</h3>
        <p className="featured-carousel-location">📍 {data.location}</p>
        <p className="featured-carousel-rating">
          ⭐ {data.rating}{" "}
          <span className="featured-carousel-reviews">({data.reviews} {t.reviews})</span>
        </p>
        <p className="featured-carousel-description">{data.description}</p>

        <div className="featured-carousel-features">
          {data.features.map((feature, i) => (
            <div key={i} className="featured-carousel-feature-item">
              <span className="feature-icon">{iconMap[feature.icon]}</span>
              <span>{feature.label}</span>
            </div>
          ))}
        </div>

        <div className="featured-carousel-info">
          {data.info.map((info, i) => (
            <div key={i} className="featured-carousel-info-item">
              <span className="info-icon">{iconMap[info.icon]}</span>
              <span>{info.label}</span>
            </div>
          ))}
        </div>

        <div className="featured-carousel-footer">
          <div className="featured-carousel-price">
            <span className="price-amount">
              {data.price ? `$${data.price}` : data.priceLevel}
            </span>
          </div>
          <Link to="/bookings" className="featured-carousel-btn">{t.bookNow}</Link>
        </div>
      </div>
    </div>
  );
};

export default FeatureRestaurantCarouselCard;