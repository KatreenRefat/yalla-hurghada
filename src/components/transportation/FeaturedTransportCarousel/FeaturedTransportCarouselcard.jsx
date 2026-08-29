import "./FeaturedTransportCarouselcard.css"; // Changed "Tours" to "Transport"
import { Link } from "react-router-dom";
import {
  FaWifi, FaSnowflake, FaCrown, FaPlane, FaUser,
  FaHeadset, FaPeopleCarry, FaSuitcase, FaClock, FaTimesCircle,
} from "react-icons/fa";

const iconMap = {
  wifi: <FaWifi />,
  snowflake: <FaSnowflake />,
  crown: <FaCrown />,
  plane: <FaPlane />,
  person: <FaUser />,
  headset: <FaHeadset />,
  people: <FaPeopleCarry />,
  bag: <FaSuitcase />,
  clock: <FaClock />,
  "x-circle": <FaTimesCircle />,
};

const FeaturedTransportCarouselCard = ({ data }) => {
  return (
    <div className="vip-card">
      <div className="vip-card-image">
        <img
          src={data.image}
          alt={data.title}
          onError={(e) => { e.target.src = "https://placehold.co/600x400?text=Tour"; }}
        />
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
        <p className="mb-2">⭐ {data.rating} ({data.reviews} reviews)</p>
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
          <span className="h5">${data.price} /person</span>
          <Link to="/bookings" className="btn btn-primary">Book This Tour →</Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturedTransportCarouselCard;