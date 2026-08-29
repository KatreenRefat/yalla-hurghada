import "./ToursTestimonials.css";
import { useLanguage } from "../../../context/useLanguage";

const toursTestimonialsData = {
  EN: {
    label: "TESTIMONIALS",
    title: "What Our Travelers Say",
    items: [
      {
        id: 1,
        name: "Ahmed Hassan",
        location: "Cairo, Egypt",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 5,
        text: "The snorkeling trip was absolutely magical! The guide was professional and the coral reefs were breathtaking. Best tour experience in Hurghada!",
      },
      {
        id: 2,
        name: "Sarah Johnson",
        location: "London, UK",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        rating: 5,
        text: "The desert safari exceeded all expectations! Camel riding, quad biking, and the Bedouin dinner under the stars was truly unforgettable. Highly recommended!",
      },
      {
        id: 3,
        name: "Mohammed Al-Rashid",
        location: "Riyadh, Saudi Arabia",
        image: "https://randomuser.me/api/portraits/men/67.jpg",
        rating: 5,
        text: "The Luxor day trip was a dream come true! Our Egyptologist guide was incredibly knowledgeable. Every temple and monument left us speechless. Will book again!",
      },
    ],
  },
  AR: {
    label: "آراء العملاء",
    title: "ماذا يقول مسافرونا",
    items: [
      {
        id: 1,
        name: "أحمد حسن",
        location: "القاهرة، مصر",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 5,
        text: "رحلة الغطس كانت ساحرة تمامًا! كان المرشد محترفًا والشعاب المرجانية كانت خلابة. أفضل تجربة سياحية في الغردقة!",
      },
      {
        id: 2,
        name: "سارة جونسون",
        location: "لندن، المملكة المتحدة",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        rating: 5,
        text: "تجاوزت سفاري الصحراء كل التوقعات! ركوب الجمال، الدراجات الرباعية، وعشاء البدو تحت النجوم كان لا يُنسى. أنصح به بشدة!",
      },
      {
        id: 3,
        name: "محمد الراشد",
        location: "الرياض، المملكة العربية السعودية",
        image: "https://randomuser.me/api/portraits/men/67.jpg",
        rating: 5,
        text: "كانت رحلة الأقصر حلمًا يتحقق! مرشدنا المتخصص في علم المصريات كان ذو معرفة واسعة. كل معبد وأثر أبهرنا. سنحجز مجددًا!",
      },
    ],
  },
  RU: {
    label: "ОТЗЫВЫ",
    title: "Что говорят наши путешественники",
    items: [
      {
        id: 1,
        name: "Ахмед Хасан",
        location: "Каир, Египет",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        rating: 5,
        text: "Поездка на снорклинг была просто волшебной! Гид был профессиональным, а коралловые рифы — захватывающими. Лучший тур в Хургаде!",
      },
      {
        id: 2,
        name: "Сара Джонсон",
        location: "Лондон, Великобритания",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        rating: 5,
        text: "Сафари в пустыне превзошло все ожидания! Верблюды, квадроциклы и бедуинский ужин под звёздами — незабываемо. Очень рекомендую!",
      },
      {
        id: 3,
        name: "Мухаммед Аль-Рашид",
        location: "Эр-Рияд, Саудовская Аравия",
        image: "https://randomuser.me/api/portraits/men/67.jpg",
        rating: 5,
        text: "Поездка в Луксор была мечтой! Наш гид-египтолог был невероятно знающим. Каждый храм и памятник оставил нас без слов. Обязательно вернёмся!",
      },
    ],
  },
};

const ToursTestimonials = () => {
  const { language } = useLanguage();
  const t = toursTestimonialsData[language] || toursTestimonialsData.EN;

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? "filled" : ""}`}>★</span>
    ));

  return (
    <section className="tours-testimonials-section">
      <div className="container">
        <div className="tours-testimonials-header">
          <span className="tours-testimonials-label">{t.label}</span>
          <h2 className="tours-testimonials-title">{t.title}</h2>
        </div>

        <div className="tours-testimonials-grid">
          {t.items.map((item, index) => (
            <div
              key={item.id}
              className="tours-testimonial-card"
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay={200 + index * 150}
              data-aos-once="true"
            >
              <div className="tours-testimonial-stars">{renderStars(item.rating)}</div>
              <span className="tours-testimonial-quote-icon">"</span>
              <p className="tours-testimonial-text">{item.text}</p>
              <div className="tours-testimonial-author">
                <img src={item.image} alt={item.name} className="tours-testimonial-avatar" />
                <div className="tours-testimonial-info">
                  <h4 className="tours-testimonial-name">{item.name}</h4>
                  <span className="tours-testimonial-location">{item.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ToursTestimonials;