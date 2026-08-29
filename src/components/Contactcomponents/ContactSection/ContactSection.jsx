import styles from "./ContactSection.module.css";
import { useLanguage } from "../../../context/useLanguage";

const content = {
  EN: {
    subtitle: "GET IN TOUCH",
    title: "Contact Us",
    description: "We're here to help you plan the perfect Hurghada experience.",
  },
  AR: {
    subtitle: "تواصل معنا",
    title: "اتصل بنا",
    description: "نحن هنا لمساعدتك في التخطيط لتجربة مثالية في الغردقة.",
  },
  RU: {
    subtitle: "СВЯЗАТЬСЯ С НАМИ",
    title: "Контакты",
    description: "Мы здесь, чтобы помочь вам спланировать идеальный отдых в Хургаде.",
  },
};

function ContactSection() {
  const { language } = useLanguage();
  const t = content[language] || content.EN;

  return (
    <section className={styles.contactSection}>
      <div className={styles.contactContent}>
        <span className={styles.subtitle}>{t.subtitle}</span>
        <h1>{t.title}</h1>
        <p>{t.description}</p>
      </div>
    </section>
  );
}

export default ContactSection;