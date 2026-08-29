import { useState, useEffect } from "react";
import "./FeaturedTours.css";
import { FiMapPin, FiClock, FiStar } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/useLanguage";
import AuthChoiceModal from "../../AuthChoiceModal/AuthChoiceModal"; 

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const content = {
  EN: { label: "Explore Our Best", title: "Featured Tours", from: "From", bookNow: "Book Now", loading: "Loading tours..." },
  AR: { label: "اكتشف أفضلنا", title: "رحلات مميزة", from: "من", bookNow: "احجز الآن", loading: "جاري التحميل..." },
  RU: { label: "Лучшее от нас", title: "Избранные туры", from: "От", bookNow: "Забронировать", loading: "Загрузка..." },
};

const detectBadge = (tour) => {
  const s = (tour.Service || tour.service || "").toLowerCase();
  if (s.includes("diving") || s.includes("snorkel")) return "Diving";
  if (s.includes("safari") || s.includes("desert"))  return "Safari";
  if (s.includes("yacht") || s.includes("boat"))     return "Yacht";
  if (s.includes("island"))                           return "Island";
  return "Tour";
};

const detectDuration = (tour) => {
  const s = (tour.Service || tour.service || tour.description || "").toLowerCase();
  if (s.includes("full day") || s.includes("day trip")) return "Full Day";
  if (s.includes("half day"))                            return "Half Day";
  if (s.includes("hour"))                                return "6 Hours";
  return "Day Trip";
};

const TourCardSkeleton = () => (
  <div className="tour-card skeleton-card">
    <div style={{
      height: 160,
      background: "linear-gradient(90deg,#f0f4f8 25%,#e2e8f0 50%,#f0f4f8 75%)",
      backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite",
    }} />
    <div style={{ padding: 15 }}>
      {[50, 80, 60, 40, 60].map((w, i) => (
        <div key={i} style={{ height: 11, borderRadius: 6, background: "#e2e8f0", width: `${w}%`, marginBottom: 10 }} />
      ))}
    </div>
    <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
  </div>
);

function FeaturedTours() {
  const navigate  = useNavigate();
  const { language } = useLanguage();
  const t = content[language] || content["EN"];

  const [tours, setTours]   = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAuthChoice, setShowAuthChoice] = useState(false);

  useEffect(() => {
    const fetchTop = async () => {
      try {
        const res  = await fetch(`${BASE_URL}/tours`);
        const json = await res.json();
        const raw  = json.data || json || [];

        const top3 = [...raw]
          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
          .slice(0, 3)
          .map((tour) => ({
            id:          tour.id,
            title:       (tour.name || "").replace(/\n/g, " ").trim(),
            location:    tour.location || "Hurghada",
            description: (tour.description || "").replace(/\n/g, " ").trim(),
            image:       Array.isArray(tour.image_url) ? tour.image_url[0] : tour.image_url || "",
            price:       tour["Approx Price"] || tour.approx_price || tour.price || 0,
            rating:      tour.rating || 4.5,
            reviews:     tour.reviews_count || Math.floor((tour.rating || 4.5) * 20),
            badge:       detectBadge(tour),
            duration:    detectDuration(tour),
          }));

        setTours(top3);
      } catch (err) {
        console.error("FeaturedTours error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTop();
  }, []);

  const handleBookNow = (e) => {
    e.stopPropagation();
    setShowAuthChoice(true);
  };

  return (
    <>
      <section className="featured-tours">
        <div className="ft-container">

          <div className="ft-header">
            <div className="ft-title-group">
              <span className="ft-label">{t.label}</span>
              <h2 className="ft-title">{t.title}</h2>
            </div>
            {/* ❌ زر View All اتشال من هنا */}
          </div>

          <div className="tours-grid">
            {loading
              ? [1, 2, 3].map((i) => <TourCardSkeleton key={i} />)
              : tours.map((tour, index) => (
                  <div
                    className="tour-card"
                    key={tour.id}
                    data-aos="fade-up"
                    data-aos-delay={200 + index * 100}
                    onClick={() => navigate(`/tour/${tour.id}`)}
                  >
                    <div className="tour-image-wrapper">
                      <img
                        src={tour.image}
                        alt={tour.title}
                        className="tour-image"
                        onError={(e) => { e.target.src = "https://placehold.co/400x220?text=Tour"; }}
                      />
                      <span className="tour-badge">{tour.badge}</span>
                    </div>

                    <div className="tour-content">
                      <div className="tour-location">
                        <FiMapPin />
                        <span>{tour.location}</span>
                      </div>

                      <h3 className="tour-title">{tour.title}</h3>

                      <div className="tour-rating">
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <FiStar key={i} className={i < Math.floor(tour.rating) ? "filled" : ""} />
                          ))}
                        </div>
                        <span className="rating-text">
                          {tour.rating?.toFixed(1)} ({tour.reviews})
                        </span>
                      </div>

                      <div className="tour-duration">
                        <FiClock />
                        <span>{tour.duration}</span>
                      </div>

                      <div className="tour-footer">
                        <div className="tour-price">
                          <span className="from">{t.from}</span>
                          <span className="price">${tour.price}</span>
                        </div>
                        <button
                          className="book-now-btn"
                          onClick={(e) => handleBookNow(e, tour.id)}
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

export default FeaturedTours;