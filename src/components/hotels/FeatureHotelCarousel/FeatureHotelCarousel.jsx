
import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import FeaturedHotelCarouselCard from "./FeatureHotelCarouselCard";
import "./FeatureHotelCarouselCard.css";
// ✅ صح
import { useLanguage } from "../../../context/useLanguage";
import { gethotels, normalizeHotel } from "../../../services/hotelService";

const content = {
  EN: {
    title: "Featured hotels & Resorts",
    subtitle: "Luxury stays handpicked for your comfort",
    loading: "Loading featured hotels...",
    bookNow: "Book Now →",
    reviews: "reviews",
    perNight: "/ night",
  },
  AR: {
    title: "فنادق ومنتجعات مميزة",
    subtitle: "إقامات فاخرة مختارة خصيصاً لراحتك",
    loading: "جاري تحميل الفنادق المميزة...",
    bookNow: "احجز الآن →",
    reviews: "تقييم",
    perNight: "/ ليلة",
  },
  RU: {
    title: "Избранные отели и курорты",
    subtitle: "Роскошные варианты проживания, отобранные для вашего комфорта",
    loading: "Загрузка избранных отелей...",
    bookNow: "Забронировать →",
    reviews: "отзывов",
    perNight: "/ ночь",
  },
};

// ── تحويل hotel → shape يفهمه FeaturedHotelCarouselCard ──────
const toCarouselShape = (hotel, language) => {
  const getText = (field) => {
    if (!field) return "";
    if (typeof field === "string") return field;
    return field[language] || field["EN"] || "";
  };

  const starCount = hotel.starRating || Math.round(hotel.rating || 0);

  return {
    id:          hotel.id,
    image:       hotel.image || (hotel.images && hotel.images[0]) || "",
    images:      hotel.images || [],
    title:       getText(hotel.title),
    location:    getText(hotel.location),
    description: getText(hotel.description)?.slice(0, 180) + (getText(hotel.description)?.length > 180 ? "..." : ""),
    rating:      hotel.rating,
    reviews:     hotel.reviews || 0,
    price:       hotel.price,
    priceLabel:  language === "AR" ? "ليلة" : language === "RU" ? "ночь" : "night",
    category:    starCount >= 5 ? "5-Star Luxury" : starCount >= 4 ? "4-Star Premium" : "Boutique Hotel",
    badges:      [
      hotel.isTopRated ? "Top Rated" : "Featured",
      getText(hotel.location),
    ].filter(Boolean),
    features: [
      { icon: "wifi",      label: "Free WiFi" },
      { icon: "snowflake", label: "AC" },
      { icon: "waves",     label: "Pool" },
    ],
    info: [
      { icon: "people",    label: `${starCount} Stars` },
      { icon: "clock",     label: "24/7 Service" },
      { icon: "x-circle",  label: "Free Cancellation" },
    ],
  };
};

// ── SKELETON ──────────────────────────────────────────────────
const CarouselSkeleton = () => (
  <div style={{
    background: "var(--yh-card-bg, #fff)", borderRadius: 16, padding: 24,
    display: "flex", gap: 24, height: 460,
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  }}>
    <div style={{
      width: "45%", borderRadius: 12,
      background: "linear-gradient(90deg,#f0f4f8 25%,#e2e8f0 50%,#f0f4f8 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite",
    }} />
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 14, paddingTop: 12 }}>
      {[40, 70, 100, 60, 80, 50].map((w, i) => (
        <div key={i} style={{
          height: 14, borderRadius: 6, background: "#e2e8f0", width: `${w}%`,
        }} />
      ))}
    </div>
    <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
  </div>
);

// ── MAIN ──────────────────────────────────────────────────────
const FeaturedHotelCarousel = () => {
  const { language } = useLanguage();
  const t = content[language] || content["EN"];

  const [featured, setFeatured]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-out", once: true, offset: 50 });

    const fetchFeatured = async () => {
      try {
        const raw = await gethotels();
        const normalized = raw.map(normalizeHotel);
        // أعلى 3 فنادق بالـ rating
        const top = [...normalized]
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3)
          .map((h) => toCarouselShape(h, language));
        setFeatured(top);
      } catch (err) {
        console.error("FeaturedHotelCarousel error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, [language]);

  const nextSlide = () => setCurrentIndex((p) => (p + 1) % Math.max(featured.length, 1));
  const prevSlide = () => setCurrentIndex((p) => (p - 1 + Math.max(featured.length, 1)) % Math.max(featured.length, 1));

  return (
    <div className="container mt-5 mb-5 pb-4">
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
                <FeaturedHotelCarouselCard data={item} />
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

export default FeaturedHotelCarousel;
