import "./FeatureHotelCarouselCard.css";
import { Link } from "react-router-dom";
import { useLanguage } from "../../../context/useLanguage";
import {
  FaWifi, FaSnowflake, FaCrown, FaUser, FaHeadset,
  FaUsers, FaClock, FaTimesCircle, FaBed, FaUtensilSpoon, FaWater,
} from "react-icons/fa";

const iconMap = {
  wifi: <FaWifi />,
  snowflake: <FaSnowflake />,
  crown: <FaCrown />,
  person: <FaUser />,
  headset: <FaHeadset />,
  people: <FaUsers />,
  clock: <FaClock />,
  "x-circle": <FaTimesCircle />,
  bed: <FaBed />,
  utensils: <FaUtensilSpoon />,
  waves: <FaWater />,
};

const content = {
  EN: {
    reviews: "reviews",
    bookNow: "Book Now →",
    per: "/",
  },
  AR: {
    reviews: "تقييم",
    bookNow: "احجز الآن →",
    per: "/",
  },
  RU: {
    reviews: "отзывов",
    bookNow: "Забронировать →",
    per: "/",
  },
};

const FeatureHotelCarouselCard = ({ data }) => {
  const { language } = useLanguage();
  const t = content[language];

  return (
    <div className="vip-card">
      <div className="vip-card-image">
        <img src={data.image} alt={data.title} />
        <div className="vip-badges">
          {data.badges.map((badge, i) => (
            <span key={i} className="vip-badge">{badge}</span>
          ))}
        </div>
      </div>

      <div className="vip-card-content">
        <span className="category-badge">{data.category}</span>
        <h3>{data.title}</h3>
        <p className="text-muted mb-1">📍 {data.location}</p>
        <p className="mb-2">⭐ {data.rating} ({data.reviews} {t.reviews})</p>
        <p className="mb-2">{data.description}</p>

        <div className="d-flex flex-wrap mb-2 gap-2">
          {data.features.map((feature, i) => (
            <div key={i} className="feature-icon d-flex align-items-center me-3">
              <span className="me-1">{iconMap[feature.icon]}</span>
              <span>{feature.label}</span>
            </div>
          ))}
        </div>

        <div className="d-flex flex-wrap mb-3 gap-2">
          {data.info.map((info, i) => (
            <div key={i} className="info-card d-flex align-items-center p-2 border rounded">
              <span className="me-1">{iconMap[info.icon]}</span>
              <span>{info.label}</span>
            </div>
          ))}
        </div>

        <div className="d-flex justify-content-between align-items-center mt-auto w-100">
          <span className="h5">${data.price} {t.per} {data.priceLabel}</span>
          <Link to="/bookings" className="btn btn-primary">{t.bookNow}</Link>
        </div>
      </div>
    </div>
  );
};

export default FeatureHotelCarouselCard;