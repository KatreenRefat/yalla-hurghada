import { useBooking } from "../../../context/BookingContext";
import { useLanguage } from "../../../context/useLanguage";
import { PROMO_CODES } from "../../../data/bookingPromoCodesData";
import PriceRow from "../../common/PriceRow/PriceRow";
import RewardsPanel from "../RewardsPanel/RewardsPanel";
import PromoCodes from "../PromoCodes/PromoCodes";
import "./BookingSummary.css";

const content = {
  EN: {
    title: "Booking Summary",
    emptyIcon: "＋",
    emptyText: "No services selected yet",
    emptySubtext: "Browse and add items to build your trip.",
    subtotal: (n) => `Subtotal (${n} items)`,
    taxes: "Taxes (14%)",
    serviceFee: "Service Fee",
    promo: (p) => `Promo (${p}% off)`,
    grandTotal: "Grand Total",
    earnPoints: (p) => `⭐ You'll earn +${p} points`,
  },
  AR: {
    title: "ملخص الحجز",
    emptyIcon: "＋",
    emptyText: "لم يتم اختيار أي خدمات بعد",
    emptySubtext: "تصفح وأضف العناصر لبناء رحلتك.",
    subtotal: (n) => `المجموع الفرعي (${n} عناصر)`,
    taxes: "الضرائب (14%)",
    serviceFee: "رسوم الخدمة",
    promo: (p) => `خصم (${p}%)`,
    grandTotal: "الإجمالي الكلي",
    earnPoints: (p) => `⭐ ستكسب +${p} نقطة`,
  },
  RU: {
    title: "Сводка бронирования",
    emptyIcon: "＋",
    emptyText: "Услуги ещё не выбраны",
    emptySubtext: "Просмотрите и добавьте элементы для вашей поездки.",
    subtotal: (n) => `Подытог (${n} позиций)`,
    taxes: "Налоги (14%)",
    serviceFee: "Сервисный сбор",
    promo: (p) => `Промо (${p}% скидка)`,
    grandTotal: "Итого",
    earnPoints: (p) => `⭐ Вы заработаете +${p} баллов`,
  },
};

export default function BookingSummary() {
  const {
    cart, extras,
    promoCode,
    getSubtotal, getTax, getServiceFee, getDiscountAmount, getGrandTotal,
    getEarnedPoints,
  } = useBooking();
  const { language } = useLanguage();
  const t = content[language] || content.EN;

  const subtotal = getSubtotal();
  const promoDisc = promoCode ? PROMO_CODES[promoCode]?.discount || 0 : 0;
  const discountAmount = getDiscountAmount();
  const totalItems = cart.length + extras.length;

  return (
    <div className="booking-summary">
      <h3 className="booking-summary__title">{t.title}</h3>

      {cart.length === 0 && extras.length === 0 ? (
        <div className="booking-summary__empty">
          <div className="booking-summary__empty-icon">{t.emptyIcon}</div>
          <div className="booking-summary__empty-text">
            {t.emptyText}<br />{t.emptySubtext}
          </div>
        </div>
      ) : (
        <div className="booking-summary__items">
          {cart.map(item => (
            <div key={item.id} className="booking-summary__cart-item">
              <img
                src={item.image}
                alt={item.name}
                className="booking-summary__cart-img"
              />
              <div className="booking-summary__cart-info">
                <div className="booking-summary__cart-name">{item.name}</div>
                <div className="booking-summary__cart-category">{item.category}</div>
                <div className="booking-summary__cart-price">${item.price}</div>
              </div>
            </div>
          ))}
          {extras.map(e => (
            <div key={e.id} className="booking-summary__extra-row">
              <span>+ {e.name}</span>
              <span className="booking-summary__extra-price">+${e.price}</span>
            </div>
          ))}
        </div>
      )}

      <div className="booking-summary__totals">
        <PriceRow label={t.subtotal(totalItems)} value={`$${subtotal}`} />
        <PriceRow label={t.taxes} value={`$${getTax()}`} />
        <PriceRow label={t.serviceFee} value={`$${getServiceFee()}`} />
        {discountAmount > 0 && (
          <PriceRow
            label={t.promo(Math.round(promoDisc * 100))}
            value={`-$${discountAmount}`}
            color="#10b981"
          />
        )}
        <PriceRow
          label={t.grandTotal}
          value={`$${getGrandTotal().toFixed(2)}`}
          color="#1d4ed8"
          bold
        />

        {cart.length > 0 && (
          <div className="booking-summary__points-banner">
            {t.earnPoints(getEarnedPoints())}
          </div>
        )}
      </div>

      <RewardsPanel />
      <PromoCodes />
    </div>
  );
}