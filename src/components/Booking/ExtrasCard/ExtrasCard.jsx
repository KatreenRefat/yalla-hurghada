import { useBooking } from "../../../context/BookingContext";
import { useLanguage } from "../../../context/useLanguage";
import "./ExtrasCard.css";

// ترجمة بالاسم — الـ id بقى رقمي من الباك، فبنطابق بالاسم الإنجليزي كمفتاح
const TRANSLATIONS = {
  "Underwater Photo Package": {
    AR: { name: "باقة التصوير تحت الماء", desc: "تصوير احترافي تحت الماء" },
    RU: { name: "Пакет подводной съёмки", desc: "Профессиональная подводная фотография" },
  },
  "Private Guide": {
    AR: { name: "مرشد خاص", desc: "مرشد سياحي شخصي لمجموعتك" },
    RU: { name: "Личный гид", desc: "Персональный гид для вашей группы" },
  },
  "VIP Transfer": {
    AR: { name: "نقل VIP", desc: "نقل فاخر بسيارة خاصة" },
    RU: { name: "VIP трансфер", desc: "Роскошный трансфер на частном авто" },
  },
  "Travel Insurance": {
    AR: { name: "تأمين سفر", desc: "تأمين سفر شامل" },
    RU: { name: "Страховка путешествия", desc: "Полное страховое покрытие" },
  },
  "Romantic Dinner Setup": {
    AR: { name: "إعداد عشاء رومانسي", desc: "عشاء بالشموع مع الزهور" },
    RU: { name: "Романтический ужин", desc: "Ужин при свечах с цветами" },
  },
  "Room Upgrade": {
    AR: { name: "ترقية الغرفة", desc: "ترقية إلى غرفة بإطلالة على البحر" },
    RU: { name: "Апгрейд номера", desc: "Номер с видом на море" },
  },
};

const titleText = { EN: "Add Extras", AR: "أضف خدمات إضافية", RU: "Добавить услуги" };

export default function ExtrasCard() {
  const { toggleExtra, isExtraSelected, extrasOptions } = useBooking();
  const { language } = useLanguage();
  const title = titleText[language] || titleText.EN;

  return (
    <div className="extras-card">
      <h3 className="extras-card__title">{title}</h3>
      <div className="extras-card__list">
        {extrasOptions.map(e => {
          const selected = isExtraSelected(e.id);
          const translated = (language !== "EN" && TRANSLATIONS[e.name]?.[language]) || { name: e.name, desc: e.desc };
          return (
            <div
              key={e.id}
              onClick={() => toggleExtra(e)}
              className={`extras-card__item ${selected ? "extras-card__item--selected" : ""}`}
            >
              <div className={`extras-card__checkbox ${selected ? "extras-card__checkbox--checked" : ""}`}>
                {selected && <span className="extras-card__check">✓</span>}
              </div>
              <div className="extras-card__info">
                <div className="extras-card__name">{translated.name}</div>
                <div className="extras-card__desc">{translated.desc}</div>
              </div>
              <div className="extras-card__price">+${e.price}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}