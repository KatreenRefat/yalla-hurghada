import "./TransportTestimonials.css";

const transportTestimonialsData = [
  {
    id: 1,
    name: "Ahmed Hassan",
    location: "Cairo, Egypt",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    text: "The airport pickup was seamless! Driver was waiting with a sign, helped with luggage, and the car was spotless. Best transfer service in Hurghada!"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    location: "London, UK",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 5,
    text: "Booked the VIP limousine for my wedding anniversary. The champagne and red carpet treatment made it unforgettable. Highly recommended!"
  },
  {
    id: 3,
    name: "Mohammed Al-Rashid",
    location: "Riyadh, Saudi Arabia",
    image: "https://randomuser.me/api/portraits/men/67.jpg",
    rating: 5,
    text: "Used their luxury bus for our group of 15. Comfortable seats, AC worked perfectly, and the driver knew all the best routes. Will book again!"
  }
];

const TransportTestimonials = () => {

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={`star ${i < rating ? "filled" : ""}`}>
        ★
      </span>
    ));
  };

  return (
    <section className="transport-testimonials-section">
      <div className="container">
        
        <div className="transport-testimonials-header">
          <span className="transport-testimonials-label">TESTIMONIALS</span>
          <h2 className="transport-testimonials-title">What Our Travelers Say</h2>
        </div>

        <div className="transport-testimonials-grid">
          {transportTestimonialsData.map((item, index) => (
            <div 
              key={item.id} 
              className="transport-testimonial-card"
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-delay={200 + (index * 150)}
              data-aos-once="true"
            >
              
              <div className="transport-testimonial-stars">
                {renderStars(item.rating)}
              </div>

              <span className="transport-testimonial-quote-icon">"</span>

              <p className="transport-testimonial-text">{item.text}</p>

              <div className="transport-testimonial-author">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="transport-testimonial-avatar"
                />
                <div className="transport-testimonial-info">
                  <h4 className="transport-testimonial-name">{item.name}</h4>
                  <span className="transport-testimonial-location">{item.location}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default TransportTestimonials;
