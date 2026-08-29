import { useState } from "react";
import TransportDetailsModal from "../TransportDetailsModal/TransportDetailsModal";
import "./TransportCard.css";
// ✅ صح
import { useLanguage } from "../../../context/useLanguage";

const translations = {
  EN: { topRated: "Top Rated", from: "From", perTrip: "/trip", viewDetails: "View Details" },
  AR: { topRated: "الأعلى تقييماً", from: "من", perTrip: "/رحلة", viewDetails: "عرض التفاصيل" },
  RU: { topRated: "Высокий рейтинг", from: "От", perTrip: "/поездка", viewDetails: "Подробнее" },
};

const TransportCard = ({ transport, index }) => {
  const { language } = useLanguage();
  const t = translations[language] || translations.EN;
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!transport) return null;

  // يدعم string مباشر أو object { EN, AR, RU }
  const loc = (field) =>
    typeof field === "object" && !Array.isArray(field)
      ? field[language] || field.EN || ""
      : field || "";

  const tags = loc(transport.tags) || [];
  const mainImage = transport.image || (transport.images && transport.images[0]) || "";

  return (
    <>
      <div
        className="transport-card"
        data-aos="fade-up"
        data-aos-duration="800"
        data-aos-delay={index * 100}
        data-aos-once="true"
      >
        {/* ── IMAGE ── */}
        <div className="transport-card-image-wrapper">
          <img
            src={mainImage}
            alt={loc(transport.title)}
            className="transport-card-image"
            onError={(e) => { e.target.src = "https://placehold.co/400x220?text=Transport"; }}
          />
          {transport.isTopRated && (
            <span className="transport-top-rated-badge">{t.topRated}</span>
          )}
          <div className="transport-tags">
            {tags.slice(0, 2).map((tag) => (
              <span key={tag} className="transport-tag">{tag}</span>
            ))}
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div className="transport-card-content">
          <span className="transport-location">📍 {loc(transport.location)}</span>

          <h3>
            {loc(transport.title)}
            {transport.brand && <span style={{ fontWeight: 400, fontSize: 14, color: "#6b7280", marginLeft: 6 }}>· {transport.brand}</span>}
          </h3>

          <p>
            {loc(transport.description)?.slice(0, 90)}
            {loc(transport.description)?.length > 90 ? "..." : ""}
          </p>

          <div className="transport-rating">
            ⭐⭐⭐⭐⭐
            <span>
              {transport.rating?.toFixed(1)}
              {transport.reviews ? ` (${transport.reviews})` : ""}
            </span>
          </div>

          <div className="transport-features">
            <span>👥 {transport.passengers}</span>
            <span>🧳 {transport.bags}</span>
          </div>

          <div className="transport-card-footer">
            <div className="transport-price">
              <span>{t.from}</span>
              <h4>${transport.price}</h4>
              <small>{t.perTrip}</small>
            </div>
            <button
              className="transport-details-btn"
              onClick={() => setIsModalOpen(true)}
            >
              {t.viewDetails}
            </button>
          </div>
        </div>
      </div>

      <TransportDetailsModal
        transport={transport}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default TransportCard;
