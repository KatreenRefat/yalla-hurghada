// src/components/Transport/TransportationHero/TransportationHero.jsx

import { useState } from "react";
import "./TransportationHero.css";
// ✅ صح
import { useLanguage } from "../../../context/useLanguage";

const translations = {
  EN: {
    badge: "Premium Transport Services",
    title: <>Discover Premium Transport in <span className="highlight-blue">Hurghada</span></>,
    description: "VIP transfers, private drivers, and premium vehicles for a first-class Hurghada experience.",
    categories: [
      { id: 1, label: "All", value: "all", icon: "✓" },
      { id: 2, label: "Car", value: "car", icon: "🚗" },
      { id: 3, label: "Bus", value: "bus", icon: "🚌" },
      { id: 7, label: "Private Driver", value: "private-driver", icon: "👤" },
    ],
  },
  AR: {
    badge: "خدمات النقل المميزة",
    title: <>اكتشف النقل المميز في <span className="highlight-blue">الغردقة</span></>,
    description: "نقل VIP وسائقون خاصون ومركبات فاخرة لتجربة من الدرجة الأولى في الغردقة.",
    categories: [
      { id: 1, label: "الكل", value: "all", icon: "✓" },
      { id: 2, label: "سيارة", value: "car", icon: "🚗" },
      { id: 3, label: "أتوبيس", value: "bus", icon: "🚌" },
      { id: 7, label: "سائق خاص", value: "private-driver", icon: "👤" },
    ],
  },
  RU: {
    badge: "Премиум транспортные услуги",
    title: <>Откройте премиум транспорт в <span className="highlight-blue">Хургаде</span></>,
    description: "VIP-трансферы, личные водители и премиальные автомобили для первоклассного отдыха в Хургаде.",
    categories: [
      { id: 1, label: "Все", value: "all", icon: "✓" },
      { id: 2, label: "Автомобиль", value: "car", icon: "🚗" },
      { id: 3, label: "Автобус", value: "bus", icon: "🚌" },
      { id: 7, label: "Личный водитель", value: "private-driver", icon: "👤" },
    ],
  },
};

const TransportationHero = ({ heroData, onSearch }) => {
  const { language } = useLanguage();
  const t = translations[language] || translations.EN;

  const [activeCategory, setActiveCategory] = useState(t.categories[0].value);

  const [searchData, setSearchData] = useState({
    pickup: "Hurghada",
    dropoff: "",
    date: "",
    passengers: "2 Adults",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSearchData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const finalSearchData = { ...searchData, category: activeCategory };
    onSearch?.(finalSearchData);
    console.log("Transportation Search Data:", finalSearchData);
  };

  return (
    <section className="transportation-hero">
      <div className="transportation-hero-bg">
        <img
          className="transportation-hero-image"
          src={heroData.backgroundImage}
          alt=""
          aria-hidden="true"
        />
        <div className="transportation-hero-overlay"></div>
      </div>

      <div className="container transportation-hero-inner">
        <div className="transportation-hero-content">
          <span className="transportation-hero-badge">{t.badge}</span>
          <h1>{t.title}</h1>
          <p>{t.description}</p>
        </div>
      </div>
    </section>
  );
};

export default TransportationHero;
