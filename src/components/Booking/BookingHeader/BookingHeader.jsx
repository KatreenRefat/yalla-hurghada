import "./BookingHeader.css";
import { useLanguage } from "../../../context/useLanguage";

const content = {
  EN: {
    title: "🌴 Build Your Hurghada Trip",
    subtitle: "Combine tours, hotels, restaurants, and transport into one perfect vacation",
  },
  AR: {
    title: "🌴 صمّم رحلتك في الغردقة",
    subtitle: "اجمع الجولات والفنادق والمطاعم والمواصلات في إجازة مثالية واحدة",
  },
  RU: {
    title: "🌴 Создайте свою поездку в Хургаду",
    subtitle: "Объедините туры, отели, рестораны и транспорт в одном идеальном отпуске",
  },
};

export default function BookingHeader() {
  const { language } = useLanguage();
  const t = content[language] || content.EN;

  return (
    <div className="booking-header">
      <h1 className="booking-header__title">{t.title}</h1>
      <p className="booking-header__subtitle">{t.subtitle}</p>
    </div>
  );
}