import RestaurantImage from "../../../assets/hero-resturant.jpeg";
import "./Herosectionrestaurant.css";
import { useLanguage } from "../../../context/useLanguage";

const translations = {
  EN: {
    badge: "FINE DINING",
    title1: "Best Restaurants",
    title2: "in",
    city: "Hurghada",
    subtitle: "Savor the flavors of Hurghada with our curated selection of top restaurants.",
  },
  AR: {
    badge: "مطاعم فاخرة",
    title1: "أفضل المطاعم",
    title2: "في",
    city: "الغردقة",
    subtitle: "استمتع بنكهات الغردقة مع مجموعتنا المختارة من أفضل المطاعم.",
  },
  RU: {
    badge: "ИЗЫСКАННАЯ КУХНЯ",
    title1: "Лучшие рестораны",
    title2: "в",
    city: "Хургаде",
    subtitle: "Насладитесь вкусами Хургады с нашей подборкой лучших ресторанов.",
  },
};

export default function RestaurantHeroSection() {
  const { language } = useLanguage();
  const t = translations[language] || translations.EN;

  return (
    <section className="restaurant-hero">
      <div className="restaurant-hero-bg">
        <img
          className="restaurant-hero-image"
          src={RestaurantImage}
          alt="restaurant"
        />
        <div className="restaurant-hero-overlay"></div>
      </div>

      <div className="container restaurant-hero-inner">
        <div className="restaurant-hero-content">
          <span className="restaurant-hero-badge">{t.badge}</span>
          <h1>
            {t.title1} <br />
            {t.title2} <span className="highlighthero-blue">{t.city}</span>
          </h1>
          <p>{t.subtitle}</p>
        </div>
      </div>
    </section>
  );
}