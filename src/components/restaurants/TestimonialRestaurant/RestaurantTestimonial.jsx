// src/components/Restaurants/TestimonialRestaurant/TestimonialRestaurant.jsx

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import "./TestimonialRestaurant.css";
// ✅ صح
import { useLanguage } from "../../../context/useLanguage";

const restaurantTestimonialsData = {
  EN: [
    {
      id: 1,
      name: "Omar Khaled",
      location: "Cairo, Egypt",
      image: "https://randomuser.me/api/portraits/men/22.jpg",
      rating: 5,
      text: "The food was absolutely amazing! Fresh ingredients, perfect seasoning, and the atmosphere felt like a luxury dining experience.",
    },
    {
      id: 2,
      name: "Sarah Ahmed",
      location: "Dubai, UAE",
      image: "https://randomuser.me/api/portraits/women/55.jpg",
      rating: 5,
      text: "One of the best restaurants I've visited. The seafood was incredibly fresh and the service was top-notch!",
    },
    {
      id: 3,
      name: "Mohamed Ali",
      location: "Alexandria, Egypt",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      rating: 5,
      text: "Perfect place for dinner with friends. Great vibe, delicious food, and fast service. Highly recommended!",
    },
  ],
  AR: [
    {
      id: 1,
      name: "عمر خالد",
      location: "القاهرة، مصر",
      image: "https://randomuser.me/api/portraits/men/22.jpg",
      rating: 5,
      text: "الطعام كان رائعاً للغاية! مكونات طازجة وتتبيلة مثالية، والأجواء كانت كتجربة عشاء فاخرة.",
    },
    {
      id: 2,
      name: "سارة أحمد",
      location: "دبي، الإمارات",
      image: "https://randomuser.me/api/portraits/women/55.jpg",
      rating: 5,
      text: "من أفضل المطاعم التي زرتها. المأكولات البحرية كانت طازجة بشكل لا يصدق والخدمة كانت ممتازة!",
    },
    {
      id: 3,
      name: "محمد علي",
      location: "الإسكندرية، مصر",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      rating: 5,
      text: "مكان مثالي للعشاء مع الأصدقاء. أجواء رائعة وطعام لذيذ وخدمة سريعة. أنصح به بشدة!",
    },
  ],
  RU: [
    {
      id: 1,
      name: "Омар Халед",
      location: "Каир, Египет",
      image: "https://randomuser.me/api/portraits/men/22.jpg",
      rating: 5,
      text: "Еда была просто восхитительной! Свежие ингредиенты, идеальные специи, а атмосфера напоминала роскошный ужин.",
    },
    {
      id: 2,
      name: "Сара Ахмед",
      location: "Дубай, ОАЭ",
      image: "https://randomuser.me/api/portraits/women/55.jpg",
      rating: 5,
      text: "Один из лучших ресторанов, которые я посещала. Морепродукты невероятно свежие, а обслуживание на высшем уровне!",
    },
    {
      id: 3,
      name: "Мохамед Али",
      location: "Александрия, Египет",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      rating: 5,
      text: "Отличное место для ужина с друзьями. Прекрасная атмосфера, вкусная еда и быстрое обслуживание. Очень рекомендую!",
    },
  ],
};

const translations = {
  EN: { label: "TESTIMONIALS", title: "What Our Customers Say" },
  AR: { label: "آراء العملاء", title: "ماذا يقول عملاؤنا" },
  RU: { label: "ОТЗЫВЫ", title: "Что говорят наши клиенты" },
};

const RestaurantTestimonials = () => {
  const { language } = useLanguage();
  const t = translations[language] || translations.EN;
  const testimonials = restaurantTestimonialsData[language] || restaurantTestimonialsData.EN;

  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-out", once: true });
  }, []);

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? "filled" : ""}`}>★</span>
    ));

  return (
    <section className="restaurant-testimonials-section">
      <div className="container">

        <div className="restaurant-testimonials-header" data-aos="fade-up">
          <span className="restaurant-testimonials-label">{t.label}</span>
          <h2 className="restaurant-testimonials-title">{t.title}</h2>
        </div>

        <div className="restaurant-testimonials-grid">
          {testimonials.map((item, index) => (
            <div
              key={item.id}
              className="restaurant-testimonial-card"
              data-aos="fade-up"
              data-aos-delay={200 + index * 150}
            >
              <div className="restaurant-testimonial-stars">
                {renderStars(item.rating)}
              </div>

              <span className="restaurant-testimonial-quote">"</span>

              <p className="restaurant-testimonial-text">{item.text}</p>

              <div className="restaurant-testimonial-author">
                <img src={item.image} alt={item.name} />
                <div>
                  <h4>{item.name}</h4>
                  <span>{item.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default RestaurantTestimonials;
