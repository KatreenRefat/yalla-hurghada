import { useBooking } from "../../../context/BookingContext";
import { useLanguage } from "../../../context/useLanguage";
import "./PaymentForm.css";

const PAYMENT_METHODS = ["💳 Credit Card", "🏦 PayMob", "💰 Cash"];

const content = {
  EN: {
    title: "Payment Details",
    cardNumber: "Card Number",
    expiryDate: "Expiry Date",
    cvv: "CVV",
    cardHolder: "Cardholder Name",
    cardHolderPlaceholder: "John Doe",
    secure: "🔒 Your payment information is encrypted and secure",
    payMobTitle: "Pay via PayMob",
    payMobDesc: "You'll be redirected to PayMob's secure payment gateway to complete your transaction.",
    payMobNote: "Supports Visa, Mastercard, Meeza, Fawry & Wallet",
    cashTitle: "Pay on Arrival",
    cashDesc: "Please have the exact amount ready in EGP or USD. Our representative will collect payment at the start of your tour/check-in.",
  },
  AR: {
    title: "تفاصيل الدفع",
    cardNumber: "رقم البطاقة",
    expiryDate: "تاريخ الانتهاء",
    cvv: "CVV",
    cardHolder: "اسم حامل البطاقة",
    cardHolderPlaceholder: "محمد أحمد",
    secure: "🔒 معلومات الدفع مشفرة وآمنة",
    payMobTitle: "الدفع عبر PayMob",
    payMobDesc: "سيتم تحويلك إلى بوابة الدفع الآمنة الخاصة بـ PayMob لإتمام معاملتك.",
    payMobNote: "يدعم Visa وMastercard وميزة وفوري والمحفظة",
    cashTitle: "الدفع عند الوصول",
    cashDesc: "يرجى تجهيز المبلغ بالجنيه المصري أو الدولار. سيقوم ممثلنا بتحصيل الدفع عند بداية الجولة / تسجيل الوصول.",
  },
  RU: {
    title: "Данные для оплаты",
    cardNumber: "Номер карты",
    expiryDate: "Срок действия",
    cvv: "CVV",
    cardHolder: "Имя держателя карты",
    cardHolderPlaceholder: "Иван Иванов",
    secure: "🔒 Ваши платёжные данные зашифрованы и защищены",
    payMobTitle: "Оплата через PayMob",
    payMobDesc: "Вы будете перенаправлены на защищённый платёжный шлюз PayMob для завершения транзакции.",
    payMobNote: "Поддерживает Visa, Mastercard, Meeza, Fawry и кошелёк",
    cashTitle: "Оплата при прибытии",
    cashDesc: "Пожалуйста, подготовьте точную сумму в EGP или USD. Наш представитель примет оплату в начале тура / при заселении.",
  },
};

export default function PaymentForm() {
  const { payment, updatePayment } = useBooking();
  const { language } = useLanguage();
  const t = content[language] || content.EN;

  const formatCard = (v) => {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatExpiry = (v) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  return (
    <div className="payment-form">
      <h3 className="payment-form__title">{t.title}</h3>

      <div className="payment-form__methods">
        {PAYMENT_METHODS.map(m => (
          <button
            key={m}
            onClick={() => updatePayment("method", m)}
            className={`payment-form__method-btn ${payment.method === m ? "payment-form__method-btn--active" : ""}`}
          >
            {m}
          </button>
        ))}
      </div>

      {payment.method === "💳 Credit Card" && (
        <div className="payment-form__card-fields">
          <div className="payment-form__field">
            <label className="payment-form__label">{t.cardNumber}</label>
            <div className="payment-form__input-wrapper">
              <span className="payment-form__input-icon">💳</span>
              <input
                placeholder="1234 5678 9012 3456"
                value={payment.card}
                onChange={e => updatePayment("card", formatCard(e.target.value))}
                className="payment-form__input payment-form__input--card"
              />
            </div>
          </div>

          <div className="payment-form__row">
            <div className="payment-form__field">
              <label className="payment-form__label">{t.expiryDate}</label>
              <input
                placeholder="MM/YY"
                value={payment.expiry}
                onChange={e => updatePayment("expiry", formatExpiry(e.target.value))}
                className="payment-form__input"
              />
            </div>
            <div className="payment-form__field">
              <label className="payment-form__label">{t.cvv}</label>
              <div className="payment-form__input-wrapper">
                <span className="payment-form__input-icon">🔒</span>
                <input
                  placeholder="123"
                  maxLength={4}
                  value={payment.cvv}
                  onChange={e => updatePayment("cvv", e.target.value.replace(/\D/g, ""))}
                  className="payment-form__input payment-form__input--icon"
                />
              </div>
            </div>
          </div>

          <div className="payment-form__field">
            <label className="payment-form__label">{t.cardHolder}</label>
            <input
              placeholder={t.cardHolderPlaceholder}
              value={payment.name}
              onChange={e => updatePayment("name", e.target.value)}
              className="payment-form__input"
            />
          </div>

          <div className="payment-form__secure">{t.secure}</div>
        </div>
      )}

      {payment.method === "🏦 PayMob" && (
        <div className="payment-form__info-block payment-form__info-block--paymob">
          <div className="payment-form__info-icon">📱</div>
          <div className="payment-form__info-title" style={{ color: "#1d4ed8" }}>{t.payMobTitle}</div>
          <div className="payment-form__info-desc">{t.payMobDesc}</div>
          <div className="payment-form__info-note">{t.payMobNote}</div>
        </div>
      )}

      {payment.method === "💰 Cash" && (
        <div className="payment-form__info-block payment-form__info-block--cash">
          <div className="payment-form__info-icon">💵</div>
          <div className="payment-form__info-title" style={{ color: "#92400e" }}>{t.cashTitle}</div>
          <div className="payment-form__info-desc">{t.cashDesc}</div>
        </div>
      )}
    </div>
  );
}