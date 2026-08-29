import { useBooking } from "../../../context/BookingContext";
import { useLanguage } from "../../../context/useLanguage";
import FormField from "../../common/FormField/FormField";
import "./DetailsForm.css";

const content = {
  EN: {
    title: "Enter Your Details",
    firstName: "First Name",
    firstNamePlaceholder: "John",
    lastName: "Last Name",
    lastNamePlaceholder: "Doe",
    email: "Email",
    emailPlaceholder: "john@example.com",
    phone: "Phone",
    phonePlaceholder: "+20 123 456 7890",
    travelDate: "Travel Date",
    guests: "Number of Guests",
    guest: (n) => `${n} Guest${n > 1 ? "s" : ""}`,
    specialRequests: "Special Requests",
    specialPlaceholder: "Any special requirements or requests...",
  },
  AR: {
    title: "أدخل بياناتك",
    firstName: "الاسم الأول",
    firstNamePlaceholder: "محمد",
    lastName: "اسم العائلة",
    lastNamePlaceholder: "أحمد",
    email: "البريد الإلكتروني",
    emailPlaceholder: "example@email.com",
    phone: "رقم الهاتف",
    phonePlaceholder: "+20 123 456 7890",
    travelDate: "تاريخ السفر",
    guests: "عدد الضيوف",
    guest: (n) => `${n} ضيف`,
    specialRequests: "طلبات خاصة",
    specialPlaceholder: "أي متطلبات أو طلبات خاصة...",
  },
  RU: {
    title: "Введите ваши данные",
    firstName: "Имя",
    firstNamePlaceholder: "Иван",
    lastName: "Фамилия",
    lastNamePlaceholder: "Иванов",
    email: "Эл. почта",
    emailPlaceholder: "ivan@example.com",
    phone: "Телефон",
    phonePlaceholder: "+20 123 456 7890",
    travelDate: "Дата поездки",
    guests: "Количество гостей",
    guest: (n) => `${n} гост${n === 1 ? "ь" : n < 5 ? "я" : "ей"}`,
    specialRequests: "Особые пожелания",
    specialPlaceholder: "Любые особые требования или пожелания...",
  },
};

export default function DetailsForm() {
  const { details, updateDetails } = useBooking();
  const { language } = useLanguage();
  const t = content[language] || content.EN;

  return (
    <div className="details-form">
      <h3 className="details-form__title">{t.title}</h3>

      <div className="details-form__grid">
        <FormField
          label={t.firstName}
          placeholder={t.firstNamePlaceholder}
          value={details.firstName}
          onChange={v => updateDetails("firstName", v)}
          icon="👤"
        />
        <FormField
          label={t.lastName}
          placeholder={t.lastNamePlaceholder}
          value={details.lastName}
          onChange={v => updateDetails("lastName", v)}
          icon="👤"
        />
        <FormField
          label={t.email}
          placeholder={t.emailPlaceholder}
          value={details.email}
          onChange={v => updateDetails("email", v)}
          type="email"
          icon="✉️"
        />
        <FormField
          label={t.phone}
          placeholder={t.phonePlaceholder}
          value={details.phone}
          onChange={v => updateDetails("phone", v)}
          icon="📞"
        />
        <FormField
          label={t.travelDate}
          value={details.date}
          onChange={v => updateDetails("date", v)}
          type="date"
          icon="📅"
        />
        <div className="details-form__select-wrapper">
          <label className="details-form__label">{t.guests}</label>
          <select
            value={details.guests}
            onChange={e => updateDetails("guests", e.target.value)}
            className="details-form__select"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
              <option key={n}>{t.guest(n)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="details-form__notes">
        <label className="details-form__label">{t.specialRequests}</label>
        <textarea
          value={details.notes}
          onChange={e => updateDetails("notes", e.target.value)}
          placeholder={t.specialPlaceholder}
          rows={4}
          className="details-form__textarea"
        />
      </div>
    </div>
  );
}