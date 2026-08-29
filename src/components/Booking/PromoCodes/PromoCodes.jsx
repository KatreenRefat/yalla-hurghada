import { useState, useEffect } from "react";
import { useBooking } from "../../../context/BookingContext";
import { useLanguage } from "../../../context/useLanguage";
import { getActivePromos } from "../../../services/bookingApi";
import Badge from "../../common/Badge/Badge";
import "./PromoCodes.css";

const content = {
  EN: {
    sectionTitle: "Available Promo Codes",
    active: "Active",
    locked: "Locked",
    expires: (d) => `Expires ${d}`,
    pts: (n) => `· ${n} pts`,
    applied: "✓ Applied",
    copy: "Apply",
    haveCode: "Have a Promo Code?",
    placeholder: "ENTER CODE",
    apply: "Apply",
  },
  AR: {
    sectionTitle: "أكواد الخصم المتاحة",
    active: "مفعّل",
    locked: "مقفل",
    expires: (d) => `ينتهي ${d}`,
    pts: (n) => `· ${n} نقطة`,
    applied: "✓ تم التطبيق",
    copy: "تطبيق",
    haveCode: "لديك كود خصم؟",
    placeholder: "أدخل الكود",
    apply: "تطبيق",
  },
  RU: {
    sectionTitle: "Доступные промокоды",
    active: "Активен",
    locked: "Заблокирован",
    expires: (d) => `Истекает ${d}`,
    pts: (n) => `· ${n} баллов`,
    applied: "✓ Применён",
    copy: "Применить",
    haveCode: "Есть промокод?",
    placeholder: "ВВЕДИТЕ КОД",
    apply: "Применить",
  },
};

export default function PromoCodes() {
  const {
    points, promoCode,
    promoInput, setPromoInput,
    promoError, handlePromoApply,
  } = useBooking();
  const { language } = useLanguage();
  const t = content[language] || content.EN;

  const [promos, setPromos] = useState([]);

  useEffect(() => {
    getActivePromos()
      .then(res => setPromos(res.data || []))
      .catch(() => {});
  }, []);

  return (
    <div className="promo-codes">
      <div className="promo-codes__section-title">{t.sectionTitle}</div>

      {promos.map((promo) => {
        const locked = points < (promo.min_points_required || 0);
        const active = promoCode === promo.code;

        return (
          <div
            key={promo.code}
            className={`promo-codes__item ${
              active ? "promo-codes__item--active" :
              locked ? "promo-codes__item--locked" : ""
            }`}
          >
            <div className="promo-codes__item-content">
              <div>
                <Badge color={active ? "#10b981" : locked ? "#9ca3af" : "#3b82f6"}>
                  {active ? t.active : locked ? t.locked : promo.code}
                </Badge>
                <div className={`promo-codes__label ${locked ? "promo-codes__label--locked" : ""}`}>
                  {promo.discount_percent}% Discount
                </div>
                <div className="promo-codes__expiry">
                  {t.expires(promo.valid_until)} {locked && t.pts(promo.min_points_required)}
                </div>
              </div>
              {!locked && (
                <button
                  onClick={() => handlePromoApply(promo.code)}
                  className={`promo-codes__apply-btn ${active ? "promo-codes__apply-btn--active" : ""}`}
                >
                  {active ? t.applied : t.copy}
                </button>
              )}
            </div>
          </div>
        );
      })}

      <div className="promo-codes__input-section">
        <div className="promo-codes__input-label">{t.haveCode}</div>
        <div className="promo-codes__input-row">
          <input
            value={promoInput}
            onChange={e => setPromoInput(e.target.value.toUpperCase())}
            placeholder={t.placeholder}
            className="promo-codes__input"
          />
          <button
            onClick={() => handlePromoApply(promoInput)}
            className="promo-codes__submit-btn"
          >
            {t.apply}
          </button>
        </div>
        {promoError && (
          <div className="promo-codes__error">{promoError}</div>
        )}
      </div>
    </div>
  );
}