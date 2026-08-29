import { useBooking } from "../../../context/BookingContext";
import { useLanguage } from "../../../context/useLanguage";
import StarRating from "../../common/StarRating/StarRating";
import Tag from "../../common/Tag/Tag";
import "./BookingItemCard.css";

const content = {
  EN: {
    off: "OFF",
    days: "Days",
    added: "✓ Added",
    perPackage: "/ per package",
    perPerson: "/ per person",
    remove: "✕ Remove",
    bookPackage: "+ Book Package",
    addToTrip: "+ Add to Trip",
  },
  AR: {
    off: "خصم",
    days: "أيام",
    added: "✓ تمت الإضافة",
    perPackage: "/ لكل باقة",
    perPerson: "/ لكل شخص",
    remove: "✕ إزالة",
    bookPackage: "+ احجز الباقة",
    addToTrip: "+ أضف للرحلة",
  },
  RU: {
    off: "СКИДКА",
    days: "Дней",
    added: "✓ Добавлено",
    perPackage: "/ за пакет",
    perPerson: "/ за человека",
    remove: "✕ Удалить",
    bookPackage: "+ Забронировать пакет",
    addToTrip: "+ Добавить в поездку",
  },
};

export default function BookingItemCard({ item }) {
  const { toggleCartItem, isItemInCart } = useBooking();
  const { language } = useLanguage();
  const t = content[language] || content.EN;
  const inCart = isItemInCart(item.id);

  return (
    <div className={`item-card ${inCart ? "item-card--selected" : ""}`}>
      <div className="item-card__image-wrapper">
        <img src={item.image} alt={item.name} className="item-card__image" />

        {item.discount && !inCart && (
          <div className="item-card__badge item-card__badge--discount">
            {item.discount}% {t.off}
          </div>
        )}

        {(item.days || item.duration) && !inCart && (
          <div className="item-card__badge item-card__badge--duration">
            ⏱ {item.days ? `${item.days} ${t.days}` : item.duration}
          </div>
        )}

        {inCart && (
          <div className="item-card__badge item-card__badge--added">
            {t.added}
          </div>
        )}
      </div>

      <div className="item-card__body">
        <div className="item-card__name">{item.name}</div>

        {item.subtitle && (
          <div className="item-card__subtitle">{item.subtitle}</div>
        )}
        {item.location && (
          <div className="item-card__location">📍 {item.location}</div>
        )}

        <div className="item-card__rating">
          <StarRating rating={item.rating} />
          <span className="item-card__reviews">({item.reviews})</span>
        </div>

        <div className="item-card__tags">
          {item.tags?.slice(0, 3).map(tag => <Tag key={tag} label={tag} />)}
        </div>

        {item.description && (
          <div className="item-card__description">{item.description}</div>
        )}

        {item.services && (
          <div className="item-card__services">
            {item.services.map(s => (
              <div key={s} className="item-card__service-line">
                {s.startsWith("+")
                  ? <span className="item-card__service-more">{s}</span>
                  : <><span className="item-card__service-check">✓</span> {s}</>
                }
              </div>
            ))}
          </div>
        )}

        <div className="item-card__price-row">
          {item.originalPrice && (
            <span className="item-card__original-price">${item.originalPrice}</span>
          )}
          <span className="item-card__price">${item.price}</span>
          <span className="item-card__price-unit">
            {item.type === "package" ? t.perPackage : t.perPerson}
          </span>
        </div>

        <button
          onClick={() => toggleCartItem(item)}
          className={`item-card__btn ${inCart ? "item-card__btn--remove" : "item-card__btn--add"}`}
        >
          {inCart
            ? t.remove
            : item.type === "package" ? t.bookPackage : t.addToTrip
          }
        </button>
      </div>
    </div>
  );
}