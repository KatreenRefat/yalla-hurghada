import { useBooking } from "../../../context/BookingContext";
import { useLanguage } from "../../../context/useLanguage";
import { TABS } from "../../../data/bookingTabsData";
import "./BookingTabs.css";

const content = {
  EN: {
    Packages: "Packages",
    Tours: "Tours",
    hotels: "hotels",
    Restaurants: "Restaurants",
    Transport: "Transport",
  },
  AR: {
    Packages: "الباقات",
    Tours: "الجولات",
    hotels: "الفنادق",
    Restaurants: "المطاعم",
    Transport: "المواصلات",
  },
  RU: {
    Packages: "Пакеты",
    Tours: "Туры",
    hotels: "Отели",
    Restaurants: "Рестораны",
    Transport: "Транспорт",
  },
};

export default function BookingTabs() {
  const { activeTab, setActiveTab } = useBooking();
  const { language } = useLanguage();
  const t = content[language] || content.EN;

  return (
    <div className="booking-tabs">
      {TABS.map(tab => (
        <button
          key={tab.label}
          onClick={() => setActiveTab(tab.label)}
          className={`booking-tabs__btn ${activeTab === tab.label ? "booking-tabs__btn--active" : ""}`}
        >
          {tab.icon} {t[tab.label]}
        </button>
      ))}
    </div>
  );
}