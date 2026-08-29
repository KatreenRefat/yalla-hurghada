import { useState, useEffect } from "react";
import "./PopularHotels.css";
import { FiMapPin, FiStar } from "react-icons/fi";
import { gethotels, normalizeHotel } from "../../../services/hotelService";
import { useLanguage } from "../../../context/useLanguage";
import AuthChoiceModal from "../../AuthChoiceModal/AuthChoiceModal"; 

const content = {
  EN: { label: "Stay In Comfort", title: "Featured hotels", perNight: "Per Night", bookNow: "Book Now" },
  AR: { label: "أقامة مريحة", title: "فنادق مميزة", perNight: "لكل ليلة", bookNow: "احجز الآن" },
  RU: { label: "Комфортное проживание", title: "Избранные отели", perNight: "За ночь", bookNow: "Забронировать" },
};

const HotelCardSkeleton = () => (
  <div style={{
    background: "var(--yh-card-bg, #fff)", borderRadius: 20, overflow: "hidden",
    boxShadow: "var(--yh-shadow-sm)", border: "1px solid var(--yh-border, #e2e8f0)",
  }}>
    <div style={{
      height: 240,
      background: "linear-gradient(90deg,#f0f4f8 25%,#e2e8f0 50%,#f0f4f8 75%)",
      backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite",
    }} />
    <div style={{ padding: 20 }}>
      {[50, 80, 60, 40].map((w, i) => (
        <div key={i} style={{ height: 13, borderRadius: 6, background: "#e2e8f0", width: `${w}%`, marginBottom: 12 }} />
      ))}
    </div>
    <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
  </div>
);

function Popularhotels() {
  const { language } = useLanguage();
  const t = content[language] || content["EN"];

  const [hotels, sethotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAuthChoice, setShowAuthChoice] = useState(false);

  useEffect(() => {
    const fetchTop = async () => {
      try {
        const raw = await gethotels();
        const normalized = raw.map(normalizeHotel);
        const top3 = [...normalized]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3);
        sethotels(top3);
      } catch (err) {
        console.error("Popularhotels error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTop();
  }, []);

  const getText = (field) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[language] || field["EN"] || "";
  };

  const handleBookingClick = () => {
    setShowAuthChoice(true);
  };

  return (
    <>
      <section className="popular-hotels" data-aos="fade-up" data-aos-duration="800">
        <div className="ph-container">

          <div className="ph-header" data-aos="fade-up" data-aos-delay="100">
            <div className="ph-title-group">
              <span className="ph-label">{t.label}</span>
              <h2 className="ph-title">{t.title}</h2>
            </div>
            {/* ❌ زر View All اتشال من هنا */}
          </div>

          <div className="hotels-grid">
            {loading
              ? [1, 2, 3].map((i) => <HotelCardSkeleton key={i} />)
              : hotels.map((hotel, index) => (
                  <div
                    className="hotel-card"
                    key={hotel.id}
                    data-aos="fade-up"
                    data-aos-delay={200 + index * 150}
                  >
                    <div className="hotel-image-wrapper">
                      <img
                        src={hotel.image}
                        alt={getText(hotel.title)}
                        className="hotel-image"
                        onError={(e) => { e.target.src = "https://placehold.co/400x240?text=Hotel"; }}
                      />
                    </div>

                    <div className="hotel-content">
                      <div className="hotel-location">
                        <FiMapPin /> {getText(hotel.location)}
                      </div>

                      <h3 className="hotel-title">{getText(hotel.title)}</h3>

                      <div className="hotel-rating">
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <FiStar
                              key={i}
                              className={i < Math.floor(hotel.rating) ? "filled" : ""}
                            />
                          ))}
                        </div>
                        <span className="rating-text">{hotel.rating?.toFixed(1)}</span>
                      </div>

                      <div className="hotel-footer">
                        <div className="hotel-price-row">
                          <span className="per-night">{t.perNight}</span>
                          <span className="hotel-price">${hotel.price}</span>
                        </div>
                        <button
                          className="book-now-btn"
                          onClick={() => handleBookingClick(hotel.id)}
                        >
                          {t.bookNow}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
          </div>

        </div>
      </section>

      <AuthChoiceModal
        isOpen={showAuthChoice}
        onClose={() => setShowAuthChoice(false)}
        onCloseAll={() => setShowAuthChoice(false)}
      />
    </>
  );
}

export default Popularhotels;