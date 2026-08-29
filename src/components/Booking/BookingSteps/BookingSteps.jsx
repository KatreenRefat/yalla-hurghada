import { useBooking } from "../../../context/BookingContext";
import { useLanguage } from "../../../context/useLanguage";
import { STEPS } from "../../../data/bookingStepsData";
import "./BookingSteps.css";

const labels = {
  EN: {
    1: "Build Your Trip",
    2: "Details",
    3: "Extras",
    4: "Payment",
    5: "Confirm",
  },
  AR: {
    1: "صمّم رحلتك",
    2: "التفاصيل",
    3: "الإضافات",
    4: "الدفع",
    5: "التأكيد",
  },
  RU: {
    1: "Создайте поездку",
    2: "Детали",
    3: "Доп. услуги",
    4: "Оплата",
    5: "Подтверждение",
  },
};

export default function BookingSteps() {
  const { step } = useBooking();
  const { language } = useLanguage();
  const t = labels[language] || labels.EN;

  return (
    <div className="booking-steps">
      {STEPS.map((s, i) => {
        const done = step > s.number;
        const active = step === s.number;
        const isLast = i === STEPS.length - 1;

        return (
          <div
            key={s.number}
            className={`booking-steps__item ${!isLast ? "booking-steps__item--flex" : ""}`}
          >
            <div className="booking-steps__label-group">
              <div
                className={`booking-steps__circle ${
                  done ? "booking-steps__circle--done" :
                  active ? "booking-steps__circle--active" : ""
                }`}
              >
                {done ? "✓" : s.number}
              </div>
              <span
                className={`booking-steps__text ${
                  active ? "booking-steps__text--active" :
                  done ? "booking-steps__text--done" : ""
                }`}
              >
                {t[s.number]}
              </span>
            </div>
            {!isLast && (
              <div className={`booking-steps__line ${done ? "booking-steps__line--done" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}