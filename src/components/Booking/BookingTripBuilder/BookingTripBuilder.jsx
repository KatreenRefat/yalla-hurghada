import { useBooking } from "../../../context/BookingContext";
import { useLanguage } from "../../../context/useLanguage";
import "./BookingTripBuilder.css";

const content = {
  EN: {
    title: (n) => `✓ Your Trip (${n} services)`,
    generate: "✨ Generate My Trip",
  },
  AR: {
    title: (n) => `✓ رحلتك (${n} خدمات)`,
    generate: "✨ أنشئ رحلتي",
  },
  RU: {
    title: (n) => `✓ Ваша поездка (${n} услуг)`,
    generate: "✨ Создать мою поездку",
  },
};

export default function BookingTripBuilder() {
  const { cart, toggleCartItem } = useBooking();
  const { language } = useLanguage();
  const t = content[language] || content.EN;

  if (cart.length === 0) return null;

  return (
    <div className="trip-builder">
      <span className="trip-builder__title">
        {t.title(cart.length)}
      </span>
      {cart.map(item => (
        <span key={item.id} className="trip-builder__chip">
          {item.name}
          <span
            className="trip-builder__chip-remove"
            onClick={() => toggleCartItem(item)}
          >
            ×
          </span>
        </span>
      ))}
      <button className="trip-builder__generate-btn">
        {t.generate}
      </button>
    </div>
  );
}