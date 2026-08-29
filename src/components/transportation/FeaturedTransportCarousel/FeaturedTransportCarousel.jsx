// src/components/Transport/FeaturedTransportCarousel/FeaturedTransportCarousel.jsx
// ─────────────────────────────────────────────────────────────
// بيجيب أعلى 3 مركبات rating من الـ Backend ويعرضهم في الـ Carousel
// ─────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import FeaturedTransportCarouselCard from "./FeaturedTransportCarouselcard";
import "./FeaturedTransportCarouselcard.css";
import { useLanguage } from  "../../../context/useLanguage";
import { getTransportations, normalizeTransportation } from "../../../services/transportService";

const content = {
  EN: {
    title: "Featured VIP Transport Services",
    subtitle: "Premium transport options for your journey",
    loading: "Loading featured transport...",
  },
  AR: {
    title: "خدمات النقل VIP المميزة",
    subtitle: "خيارات نقل فاخرة لرحلتك",
    loading: "جاري تحميل خدمات النقل المميزة...",
  },
  RU: {
    title: "Избранные VIP транспортные услуги",
    subtitle: "Премиальные варианты транспорта для вашей поездки",
    loading: "Загрузка избранного транспорта...",
  },
};

// ── تحويل transport → shape يفهمه FeaturedTransportCarouselCard ──
const toCarouselShape = (transport, language) => {
  const getText = (field) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[language] || field["EN"] || "";
  };

  const typeLabels = {
    "bus":            { EN: "Bus", AR: "أتوبيس", RU: "Автобус" },
    "private-driver": { EN: "Private Car", AR: "سيارة خاصة", RU: "Личный авто" },
    "car":            { EN: "Car", AR: "سيارة", RU: "Автомобиль" },
  };

  const typeLabel = typeLabels[transport.type]?.[language] || transport.type || "Transport";

  return {
    id:          transport.id,
    image:       transport.image || (transport.images && transport.images[0]) || "",
    title:       getText(transport.title),
    location:    getText(transport.location),
    description: getText(transport.description)?.slice(0, 180) + (getText(transport.description)?.length > 180 ? "..." : ""),
    rating:      transport.rating,
    reviews:     transport.reviews || 0,
    price:       transport.price,
    category:    typeLabel,
    badges:      [
      transport.brand || typeLabel,
      transport.isTopRated ? "Top Rated" : "Featured",
    ].filter(Boolean),
    features: [
      { icon: "snowflake", label: "AC" },
      { icon: "wifi",      label: "Wi-Fi" },
      { icon: "crown",     label: "VIP" },
    ],
    info: [
      { icon: "person",   label: `${transport.availableSeats} Seats` },
      { icon: "bag",      label: transport.bags || "2 Bags" },
      { icon: "x-circle", label: "Free Cancellation" },
    ],
  };
};

// ── SKELETON ──────────────────────────────────────────────────
const CarouselSkeleton = () => (
  <div style={{
    background: "#fff", borderRadius: 16, padding: 24,
    display: "flex", gap: 24, height: 460,
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  }}>
    <div style={{
      width: "45%", borderRadius: 12,
      background: "linear-gradient(90deg,#f0f4f8 25%,#e2e8f0 50%,#f0f4f8 75%)",
      backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite",
    }} />
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14, paddingTop: 12 }}>
      {[40, 70, 100, 60, 80, 50].map((w, i) => (
        <div key={i} style={{ height: 14, borderRadius: 6, background: "#e2e8f0", width: `${w}%` }} />
      ))}
    </div>
    <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
  </div>
);

// ── MAIN ──────────────────────────────────────────────────────
const FeaturedTransportCarousel = () => {
  const { language } = useLanguage();
  const t = content[language] || content["EN"];

  const [featured, setFeatured]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-out", once: true, offset: 50 });

    const fetchFeatured = async () => {
      try {
        const raw = await getTransportations();
        const normalized = raw.map(normalizeTransportation);
        // أعلى 3 بالـ rating
        const top = [...normalized]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3)
          .map((item) => toCarouselShape(item, language));
        setFeatured(top);
      } catch (err) {
        console.error("FeaturedTransportCarousel error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, [language]);

  const nextSlide = () => setCurrentIndex((p) => (p + 1) % Math.max(featured.length, 1));
  const prevSlide = () => setCurrentIndex((p) => (p - 1 + Math.max(featured.length, 1)) % Math.max(featured.length, 1));

  return (
    <div className="container mt-5">
      <div className="featured-header" data-aos="fade-up">
        <h2 className="featured-title">{t.title}</h2>
        <p className="featured-subtitle">{t.subtitle}</p>
      </div>

      {loading ? (
        <CarouselSkeleton />
      ) : featured.length === 0 ? null : (
        <div className="custom-carousel">
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
                <FeaturedTransportCarouselCard data={item} />
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

export default FeaturedTransportCarousel;
