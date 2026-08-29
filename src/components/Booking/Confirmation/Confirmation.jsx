import { useBooking } from "../../../context/BookingContext";
import { useLanguage } from "../../../context/useLanguage";
import "./Confirmation.css";

const content = {
  EN: {
    icon: "✅",
    title: "Booking Confirmed!",
    subtitle: "Your Hurghada vacation package has been successfully booked. A confirmation email has been sent.",
    refLabel: "Booking Reference",
    servicesTitle: "Booked Services:",
    extra: "Extra",
    earnedPoints: (n) => `⭐ You've earned +${n} points from this booking!`,
    totalPoints: (n) => `Total Points: ${n}`,
    errorTitle: "Something went wrong",
  },
  AR: {
    icon: "✅",
    title: "تم تأكيد الحجز!",
    subtitle: "تم حجز باقة إجازتك في الغردقة بنجاح. تم إرسال بريد إلكتروني للتأكيد.",
    refLabel: "رقم الحجز",
    servicesTitle: "الخدمات المحجوزة:",
    extra: "إضافي",
    earnedPoints: (n) => `⭐ لقد كسبت +${n} نقطة من هذا الحجز!`,
    totalPoints: (n) => `إجمالي النقاط: ${n}`,
    errorTitle: "حدث خطأ ما",
  },
  RU: {
    icon: "✅",
    title: "Бронирование подтверждено!",
    subtitle: "Ваш отпускной пакет в Хургаде успешно забронирован. Письмо с подтверждением отправлено.",
    refLabel: "Номер бронирования",
    servicesTitle: "Забронированные услуги:",
    extra: "Доп. услуга",
    earnedPoints: (n) => `⭐ Вы заработали +${n} баллов за это бронирование!`,
    totalPoints: (n) => `Всего баллов: ${n}`,
    errorTitle: "Что-то пошло не так",
  },
};

export default function Confirmation() {
  const { cart, extras, points, confirmedBooking, submitError } = useBooking();
  const { language } = useLanguage();
  const t = content[language] || content.EN;

  if (submitError) {
    return (
      <div className="confirmation">
        <div className="confirmation__icon-wrapper">⚠️</div>
        <h2 className="confirmation__title">{t.errorTitle}</h2>
        <p className="confirmation__subtitle">{submitError}</p>
      </div>
    );
  }

  if (!confirmedBooking) {
    return (
      <div className="confirmation">
        <p className="confirmation__subtitle">Loading...</p>
      </div>
    );
  }

  const earned = confirmedBooking.points_earned || 0;

  return (
    <div className="confirmation">
      <div className="confirmation__icon-wrapper">{t.icon}</div>
      <h2 className="confirmation__title">{t.title}</h2>
      <p className="confirmation__subtitle">{t.subtitle}</p>

      <div className="confirmation__details">
        <div className="confirmation__ref-label">{t.refLabel}</div>
        <div className="confirmation__ref-value">{confirmedBooking.booking_reference}</div>
        <div className="confirmation__services-title">{t.servicesTitle}</div>
        {cart.map(i => (
          <div key={i.id} className="confirmation__service-line">
            <span className="confirmation__check">✓</span> {i.name}
          </div>
        ))}
        {extras.map(e => (
          <div key={e.id} className="confirmation__service-line">
            <span className="confirmation__check">✓</span> {e.name} ({t.extra})
          </div>
        ))}
      </div>

      <div className="confirmation__points-banner">
        {t.earnedPoints(earned)}<br />
        <span className="confirmation__points-total">
          {t.totalPoints(points)}
        </span>
      </div>
    </div>
  );
}