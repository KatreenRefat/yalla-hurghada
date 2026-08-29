import "./Herosection.css";
import HeroImage from '../../../assets/herosection.jpeg';
import { useLanguage } from "../../../context/useLanguage";;

const content = {
  EN: {
    badge: "PREMIUM STAYS",
    title1: "Find Your Perfect",
    title2: "Hotel in",
    city: "Hurghada",
    subtitle: "Discover luxury resorts, beachfront hotels, and cozy stays at the best prices.",
  },
  AR: {
    badge: "إقامات مميزة",
    title1: "اعثر على فندقك المثالي",
    title2: "في",
    city: "الغردقة",
    subtitle: "اكتشف المنتجعات الفاخرة والفنادق على الشاطئ وأماكن الإقامة المريحة بأفضل الأسعار.",
  },
  RU: {
    badge: "ПРЕМИУМ ОТЕЛИ",
    title1: "Найдите идеальный",
    title2: "отель в",
    city: "Хургаде",
    subtitle: "Откройте для себя роскошные курорты, пляжные отели и уютные апартаменты по лучшим ценам.",
  },
};

export default function Herosection() {
  const { language } = useLanguage();
  const t = content[language];

  return (
    <section className="hotel-hero">
      <div className="hotel-hero-bg">
        <img className="hotel-hero-image" src={HeroImage} alt="hotel" />
        <div className="hotel-hero-overlay"></div>
      </div>
      <div className="container hotel-hero-inner">
        <div className="hotel-hero-content">
          <span className="hotel-hero-badge">{t.badge}</span>
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
