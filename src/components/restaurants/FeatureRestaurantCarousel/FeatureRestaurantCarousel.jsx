// src/components/Restaurants/FeatureRestaurantCarousel/FeatureRestaurantCarousel.jsx
// ─────────────────────────────────────────────────────────────
// بيجيب أعلى 3 مطاعم rating من الـ Backend ويعرضهم في الـ Carousel
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import FeatureRestaurantCarouselCard from "./FeatureRestaurantCarouselCard";
import { useLanguage } from "../../../context/useLanguage";
import { getRestaurants, normalizeRestaurant } from "../../../services/restaurantService";
import "./FeatureRestaurantCarouselCard.css";

const translations = {
  EN: { title: "Featured Restaurants", subtitle: "Luxury dining experiences handpicked for you" },
  AR: { title: "المطاعم المميزة", subtitle: "تجارب عشاء فاخرة مختارة خصيصاً لك" },
  RU: { title: "Рекомендуемые рестораны", subtitle: "Роскошные гастрономические впечатления специально для вас" },
};

// ── تحويل restaurant → shape يفهمه FeatureRestaurantCarouselCard ──
const toCarouselShape = (restaurant, language) => {
  const getText = (field) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[language] || field["EN"] || "";
  };

  return {
    id:          restaurant.id,
    image:       restaurant.image || (restaurant.images && restaurant.images[0]) || "",
    title:       getText(restaurant.title),
    location:    getText(restaurant.location),
    description: getText(restaurant.description)?.slice(0, 200) + (getText(restaurant.description)?.length > 200 ? "..." : ""),
    rating:      restaurant.rating,
    reviews:     restaurant.reviews || 0,
    price:       restaurant.price,
    priceLevel:  restaurant.priceLevel || "$",
    category:    restaurant.cuisine || "Restaurant",
    badges:      [restaurant.cuisine || "Featured", getText(restaurant.location)].filter(Boolean),
    features: [
      { icon: "utensils", label: restaurant.cuisine || "Fine Dining" },
      { icon: "clock",    label: restaurant.openHours || "10AM - 11PM" },
      { icon: "crown",    label: restaurant.isTopRated ? "Top Rated" : "Featured" },
    ],
    info: [
      { icon: "people",   label: `${restaurant.reviews || 0} Reviews` },
      { icon: "headset",  label: "Reservations" },
      { icon: "x-circle", label: "Free Cancellation" },
    ],
  };
};

// ── SKELETON ──────────────────────────────────────────────────
const CarouselSkeleton = () => (
  <div style={{
    display: "flex", background: "var(--yh-card-bg, #fff)",
    borderRadius: "var(--yh-radius-lg, 16px)",
    boxShadow: "var(--yh-shadow-md, 0 4px 20px rgba(0,0,0,0.08))",
    overflow: "hidden", minHeight: 400,
  }}>
    <div style={{
      width: "50%",
      background: "linear-gradient(90deg,#f0f4f8 25%,#e2e8f0 50%,#f0f4f8 75%)",
      backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite",
    }} />
    <div style={{ flex: 1, padding: 28, display: "flex", flexDirection: "column", gap: 14 }}>
      {[40, 70, 100, 60, 80, 50].map((w, i) => (
        <div key={i} style={{ height: 14, borderRadius: 6, background: "#e2e8f0", width: `${w}%` }} />
      ))}
    </div>
    <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
  </div>
);

// ── MAIN ──────────────────────────────────────────────────────
const FeatureRestaurantCarousel = () => {
  const { language } = useLanguage();
  const t = translations[language] || translations.EN;

  const [featured, setFeatured]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const raw = await getRestaurants();
        const normalized = raw.map(normalizeRestaurant);
        // أعلى 3 مطاعم بالـ rating
        const top = [...normalized]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3)
          .map((r) => toCarouselShape(r, language));
        setFeatured(top);
      } catch (err) {
        console.error("FeatureRestaurantCarousel error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, [language]);

  const total = Math.max(featured.length, 1);
  const nextSlide = () => setCurrentIndex((p) => (p + 1) % total);
  const prevSlide = () => setCurrentIndex((p) => (p - 1 + total) % total);

  return (
    <div className="container mt-5 mb-5 pb-4">
      <div className="featured-header">
        <h2 className="featured-title">{t.title}</h2>
        <p className="featured-subtitle">{t.subtitle}</p>
      </div>

      {loading ? (
        <CarouselSkeleton />
      ) : featured.length === 0 ? null : (
        <div className="custom-carousel" style={{ position: "relative" }}>
          <button className="carousel-arrow prev" onClick={prevSlide}>←</button>

          <div className="carousel-slides">
            {featured.map((item, index) => (
              <div
                key={item.id}
                className={`carousel-slide ${index === currentIndex ? "active" : ""}`}
                style={{
                  transform: `translateX(${(index - currentIndex) * 100}%)`,
                  opacity: index === currentIndex ? 1 : 0,
                  position: index === currentIndex ? "relative" : "absolute",
                }}
              >
                <FeatureRestaurantCarouselCard data={item} />
              </div>
            ))}
          </div>

          <button className="carousel-arrow next" onClick={nextSlide}>→</button>

          <div className="carousel-dots">
            {featured.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentIndex ? "active" : ""}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureRestaurantCarousel;