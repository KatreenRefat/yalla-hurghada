import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./HotelTestimonials.css";
// ✅ صح
import { useLanguage } from "../../../context/useLanguage";

const testimonialsData = {
  EN: [
    {
      id: 1,
      name: "Ahmed Hassan",
      location: "Cairo, Egypt",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
      text: "The resort was absolutely breathtaking! Private beach, stunning pool, and the staff went above and beyond. Best hotel experience in Hurghada!",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      location: "London, UK",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
      text: "Booked the villa for our honeymoon. The personal chef, infinity pool, and Red Sea views made it a dream come true. Absolutely unforgettable!",
    },
    {
      id: 3,
      name: "Mohammed Al-Rashid",
      location: "Riyadh, Saudi Arabia",
      image: "https://randomuser.me/api/portraits/men/67.jpg",
      rating: 5,
      text: "Stayed at the boutique hotel in El Gouna. Cozy rooms, amazing rooftop dining, and the snorkeling excursions were world-class. Will definitely return!",
    },
  ],
  AR: [
    {
      id: 1,
      name: "أحمد حسن",
      location: "القاهرة، مصر",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
      text: "المنتجع كان رائعاً بكل معنى الكلمة! شاطئ خاص وحمام سباحة مذهل وطاقم عمل متميز. أفضل تجربة فندقية في الغردقة!",
    },
    {
      id: 2,
      name: "سارة جونسون",
      location: "لندن، المملكة المتحدة",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
      text: "حجزنا الفيلا لقضاء شهر العسل. الطاهي الخاص وحمام السباحة اللانهائي وإطلالات البحر الأحمر جعلتها حلماً حقيقياً. لا تُنسى أبداً!",
    },
    {
      id: 3,
      name: "محمد الراشد",
      location: "الرياض، المملكة العربية السعودية",
      image: "https://randomuser.me/api/portraits/men/67.jpg",
      rating: 5,
      text: "أقمت في الفندق البوتيك في الجونة. غرف مريحة وطعام رائع على السطح ورحلات الغطس كانت عالمية المستوى. سأعود بالتأكيد!",
    },
  ],
  RU: [
    {
      id: 1,
      name: "Ахмед Хасан",
      location: "Каир, Египет",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
      text: "Курорт был просто великолепен! Частный пляж, потрясающий бассейн, персонал сделал всё возможное. Лучший отель в Хургаде!",
    },
    {
      id: 2,
      name: "Сара Джонсон",
      location: "Лондон, Великобритания",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
      text: "Сняли виллу на медовый месяц. Личный повар, бассейн с инфинити и вид на Красное море — настоящая сказка. Незабываемо!",
    },
    {
      id: 3,
      name: "Мухаммад Аль-Рашид",
      location: "Эр-Рияд, Саудовская Аравия",
      image: "https://randomuser.me/api/portraits/men/67.jpg",
      rating: 5,
      text: "Остановился в бутик-отеле в Эль-Гуне. Уютные номера, потрясающий ужин на крыше и снорклинг мирового уровня. Обязательно вернусь!",
    },
  ],
};

const content = {
  EN: { label: "TESTIMONIALS", title: "What Our Guests Say" },
  AR: { label: "آراء النزلاء", title: "ماذا يقول ضيوفنا" },
  RU: { label: "ОТЗЫВЫ", title: "Что говорят наши гости" },
};

const HotelTestimonials = () => {
  const { language } = useLanguage();
  const t = content[language];
  const data = testimonialsData[language];

  useEffect(() => {
    AOS.init();
  }, []);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? "filled" : ""}`}>★</span>
    ));
  };

  return (
    <section className="hotel-testimonials-section">
      <div className="container">
        <div className="hotel-testimonials-header">
          <span className="hotel-testimonials-label">{t.label}</span>
          <h2 className="hotel-testimonials-title">{t.title}</h2>
        </div>

        <div className="hotel-testimonials-grid">
          {data.map((item, index) => (
            <div
              key={item.id}
              className="hotel-testimonial-card"
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay={200 + index * 150}
              data-aos-once="true"
            >
              <div className="hotel-testimonial-stars">{renderStars(item.rating)}</div>
              <span className="hotel-testimonial-quote-icon">"</span>
              <p className="hotel-testimonial-text">{item.text}</p>
              <div className="hotel-testimonial-author">
                <img src={item.image} alt={item.name} className="hotel-testimonial-avatar" />
                <div className="hotel-testimonial-info">
                  <h4 className="hotel-testimonial-name">{item.name}</h4>
                  <span className="hotel-testimonial-location">{item.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HotelTestimonials;
