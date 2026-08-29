import { useBooking } from "../../../context/BookingContext";
import { useLanguage } from "../../../context/useLanguage";
import "./BookingNavigation.css";

const content = {
  EN: {
    processing: "Processing Payment...",
    complete: "✓ Booking Complete",
    payMob: "Pay with PayMob →",
    confirm: "Confirm Booking →",
    toPayment: "Continue to Payment →",
    toExtras: "Continue to Extras →",
    toDetails: "Proceed to Details →",
    secure: "🔒 Secure checkout powered by SSL",
    back: "← Back",
  },
  AR: {
    processing: "...جاري معالجة الدفع",
    complete: "✓ تم الحجز",
    payMob: "← الدفع عبر PayMob",
    confirm: "← تأكيد الحجز",
    toPayment: "← متابعة للدفع",
    toExtras: "← متابعة للإضافات",
    toDetails: "← متابعة للتفاصيل",
    secure: "🔒 دفع آمن مدعوم بـ SSL",
    back: "→ رجوع",
  },
  RU: {
    processing: "Обработка платежа...",
    complete: "✓ Бронирование завершено",
    payMob: "Оплатить через PayMob →",
    confirm: "Подтвердить бронирование →",
    toPayment: "Перейти к оплате →",
    toExtras: "Перейти к доп. услугам →",
    toDetails: "Перейти к деталям →",
    secure: "🔒 Безопасная оплата через SSL",
    back: "← Назад",
  },
};

export default function BookingNavigation() {
  const { step, payment, cart, loading, handleContinue, handleBack } = useBooking();
  const { language } = useLanguage();
  const t = content[language] || content.EN;

  const getContinueLabel = () => {
    if (loading) return t.processing;
    if (step === 5) return t.complete;
    if (step === 4) return payment.method === "🏦 PayMob" ? t.payMob : t.confirm;
    if (step === 3) return t.toPayment;
    if (step === 2) return t.toExtras;
    return t.toDetails;
  };

  const isDisabled = loading || step === 5;
  const isFirstStepEmpty = step === 1 && cart.length === 0;

  return (
    <div className="booking-navigation">
      <button
        onClick={handleContinue}
        disabled={isDisabled}
        className={`booking-navigation__continue ${isFirstStepEmpty ? "booking-navigation__continue--disabled" : ""}`}
      >
        {getContinueLabel()}
      </button>

      {step < 5 && (
        <div className="booking-navigation__secure">{t.secure}</div>
      )}

      {step > 1 && step < 5 && (
        <button onClick={handleBack} className="booking-navigation__back">
          {t.back}
        </button>
      )}
    </div>
  );
}