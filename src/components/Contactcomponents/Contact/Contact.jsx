import styles from "./Contact.module.css";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock } from "react-icons/fa";
import { useLanguage } from "../../../context/useLanguage";

const content = {
  EN: {
    title: "Get in Touch",
    subtitle: "Have questions about our tours, hotels, or booking process? Our team is ready to assist you 24/7.",
    office: "Our Office",
    officeAddress: "Hurghada, Red Sea Governorate, Egypt",
    phone: "Phone",
    email: "Email",
    workingHours: "Working Hours",
    hours: "Daily: 8:00 AM - 10:00 PM",
    sendMessage: "Send a Message",
    firstName: "First Name",
    lastName: "Last Name",
    emailLabel: "Email",
    subject: "Subject",
    subjectPlaceholder: "How can we help?",
    message: "Message",
    messagePlaceholder: "Tell us more about your inquiry...",
    submit: "Send Message",
    firstNamePlaceholder: "John",
    lastNamePlaceholder: "Doe",
    emailPlaceholder: "john@example.com",
  },
  AR: {
    title: "تواصل معنا",
    subtitle: "هل لديك أسئلة عن جولاتنا أو الفنادق أو عملية الحجز؟ فريقنا جاهز لمساعدتك 24/7.",
    office: "مكتبنا",
    officeAddress: "الغردقة، محافظة البحر الأحمر، مصر",
    phone: "الهاتف",
    email: "البريد الإلكتروني",
    workingHours: "ساعات العمل",
    hours: "يومياً: 8:00 صباحاً - 10:00 مساءً",
    sendMessage: "أرسل رسالة",
    firstName: "الاسم الأول",
    lastName: "اسم العائلة",
    emailLabel: "البريد الإلكتروني",
    subject: "الموضوع",
    subjectPlaceholder: "كيف يمكننا مساعدتك؟",
    message: "الرسالة",
    messagePlaceholder: "أخبرنا المزيد عن استفسارك...",
    submit: "إرسال الرسالة",
    firstNamePlaceholder: "أحمد",
    lastNamePlaceholder: "محمد",
    emailPlaceholder: "john@example.com",
  },
  RU: {
    title: "Свяжитесь с нами",
    subtitle: "Есть вопросы о турах, отелях или бронировании? Наша команда готова помочь вам 24/7.",
    office: "Наш офис",
    officeAddress: "Хургада, Красноморская губерния, Египет",
    phone: "Телефон",
    email: "Эл. почта",
    workingHours: "Часы работы",
    hours: "Ежедневно: 8:00 - 22:00",
    sendMessage: "Отправить сообщение",
    firstName: "Имя",
    lastName: "Фамилия",
    emailLabel: "Эл. почта",
    subject: "Тема",
    subjectPlaceholder: "Чем можем помочь?",
    message: "Сообщение",
    messagePlaceholder: "Расскажите подробнее о вашем запросе...",
    submit: "Отправить",
    firstNamePlaceholder: "Иван",
    lastNamePlaceholder: "Иванов",
    emailPlaceholder: "ivan@example.com",
  },
};

function Contact() {
  const { language } = useLanguage();
  const t = content[language] || content.EN;

  return (
    <section className={styles.contact}>
      <div className={styles.contactContainer}>

        {/* Left Side */}
        <div className={styles.contactInfo}>
          <h2>{t.title}</h2>
          <p>{t.subtitle}</p>

          <div className={styles.infoItem}>
            <span className={styles.iconBox}>
              <FaMapMarkerAlt className={styles.icon} />
            </span>
            <div>
              <h4>{t.office}</h4>
              <p>{t.officeAddress}</p>
            </div>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.iconBox}>
              <FaPhoneAlt className={styles.icon} />
            </span>
            <div>
              <h4>{t.phone}</h4>
              <p>+20 123 456 7890</p>
            </div>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.iconBox}>
              <FaEnvelope className={styles.icon} />
            </span>
            <div>
              <h4>{t.email}</h4>
              <p>info@yallahurghada.com</p>
            </div>
          </div>

          <div className={styles.infoItem}>
            <span className={styles.iconBox}>
              <FaClock className={styles.icon} />
            </span>
            <div>
              <h4>{t.workingHours}</h4>
              <p>{t.hours}</p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className={styles.contactForm}>
          <h2>{t.sendMessage}</h2>

          <form>
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>{t.firstName}</label>
                <input type="text" placeholder={t.firstNamePlaceholder} />
              </div>
              <div className={styles.inputGroup}>
                <label>{t.lastName}</label>
                <input type="text" placeholder={t.lastNamePlaceholder} />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>{t.emailLabel}</label>
              <input type="email" placeholder={t.emailPlaceholder} />
            </div>

            <div className={styles.inputGroup}>
              <label>{t.subject}</label>
              <input type="text" placeholder={t.subjectPlaceholder} />
            </div>

            <div className={styles.inputGroup}>
              <label>{t.message}</label>
              <textarea rows="5" placeholder={t.messagePlaceholder}></textarea>
            </div>

            <button type="submit">{t.submit}</button>
          </form>
        </div>

      </div>
    </section>
  );
}

export default Contact;