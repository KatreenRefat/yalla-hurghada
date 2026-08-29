
import "./Testimonials.css";
import { FiStar } from "react-icons/fi";
import { testimonialsData } from "../../../data/testimonialsData";
import { useLanguage } from "../../../context/useLanguage";
function Testimonials() {
  const { language } = useLanguage();
  const { label, title, reviews } = testimonialsData[language] || testimonialsData.EN;

  return (
    <section className="testimonials" data-aos="fade-up" data-aos-duration="800">
      <div className="testimonials-container">
        
        {/* Header */}
        <div className="testimonials-header" data-aos="fade-up" data-aos-delay="100">
          <span className="testimonials-label">{label}</span>
          <h2 className="testimonials-title">{title}</h2>
        </div>

        {/* Reviews Grid */}
        <div className="reviews-grid">
          {reviews.map((review, index) => (
            <div 
              className="review-card" 
              key={review.id}
              data-aos="fade-up" 
              data-aos-delay={200 + (index * 100)}
            >
              {/* Quote Icon */}
              <div className="quote-icon">❝</div>
              
              {/* Stars */}
              <div className="review-stars">
                {[...Array(5)].map((_, i) => (
                  <FiStar 
                    key={i} 
                    className={i < review.rating ? 'star-filled' : 'star-empty'} 
                  />
                ))}
              </div>

              {/* Text */}
              <p className="review-text">{review.text}</p>

              {/* Author */}
              <div className="review-author">
                <img src={review.avatar} alt={review.name} className="author-avatar" />
                <div className="author-info">
                  <span className="author-name">{review.name}</span>
                  <span className="author-location">{review.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Testimonials;
