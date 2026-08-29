import { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { getTours, normalizeTour } from "../../../services/tourService";
import FeaturedToursCarouselCard from "./FeaturedToursCarouselCard";
import "./FeaturedToursCarouselCard.css";
import { useLanguage } from "../../../context/useLanguage";

const translations = {
  EN: {
    title: "Featured VIP Tour Packages",
    subtitle: "Premium tour experiences in Hurghada & Egypt",
  },
  AR: {
    title: "باقات الجولات VIP المميزة",
    subtitle: "تجارب سياحية فاخرة في الغردقة ومصر",
  },
  RU: {
    title: "Избранные VIP-туры",
    subtitle: "Премиальные туры в Хургаде и Египте",
  },
};

// خصائص ثابتة (الباك ماعندوش الـ fields دي حالياً) بتتكرر على كل كروت VIP
const DEFAULT_FEATURES = [
  { icon: "person", label: "Expert Guide" },
  { icon: "headset", label: "24/7 Support" },
  { icon: "plane", label: "Hotel Pickup" },
  { icon: "snowflake", label: "AC Transfer" },
];
const DEFAULT_INFO = [
  { icon: "people", label: "2 - 15 Persons" },
  { icon: "clock", label: "Full Day" },
  { icon: "x-circle", label: "Free Cancellation Up to 24h" },
];

function toFeaturedFormat(tour) {
  return {
    id: tour.id,
    category: tour.tags?.[0] || "Tour",
    title: tour.title,
    location: tour.location,
    rating: tour.rating,
    reviews: tour.reviews,
    description: tour.description,
    features: DEFAULT_FEATURES,
    info: DEFAULT_INFO,
    price: tour.price,
    image: tour.image,
    badges: tour.isTopRated ? ["Top Rated", "VIP"] : ["VIP"],
  };
}

const FeaturedToursCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const t = translations[language] || translations.EN;

  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-out", once: true, offset: 50 });
  }, []);

  useEffect(() => {
    let active = true;
    getTours()
      .then((data) => {
        if (!active) return;
        const normalized = data.map(normalizeTour).map(toFeaturedFormat);
        // أعلى تقييم الأول، أفضل 6 كحد أقصى للكاروسيل
        normalized.sort((a, b) => b.rating - a.rating);
        setTours(normalized.slice(0, 6));
      })
      .catch(() => setTours([]))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  if (loading || tours.length === 0) return null;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % tours.length);
  };
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + tours.length) % tours.length);
  };

  return (
    <div className="container mt-5">
      <div className="featured-header" data-aos="fade-up">
        <h2 className="featured-title">{t.title}</h2>
        <p className="featured-subtitle">{t.subtitle}</p>
      </div>
      <div className="custom-carousel">
        <button className="carousel-arrow prev" onClick={prevSlide}>←</button>
        <div className="carousel-slides">
          {tours.map((item, index) => (
            <div
              key={item.id}
              className={`carousel-slide ${index === currentIndex ? "active" : ""}`}
              style={{
                transform: `translateX(${(index - currentIndex) * 100}%)`,
                opacity: index === currentIndex ? 1 : 0,
                position: index === currentIndex ? "relative" : "absolute",
              }}
            >
              <FeaturedToursCarouselCard data={item} />
            </div>
          ))}
        </div>
        <button className="carousel-arrow next" onClick={nextSlide}>→</button>
        <div className="carousel-dots">
          {tours.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedToursCarousel;