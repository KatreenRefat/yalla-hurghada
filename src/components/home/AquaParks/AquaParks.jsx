import { useState } from "react"; // استيراد useState لإدارة حالة الـ Modal
import "./AquaParks.css";
import { FiStar } from "react-icons/fi";
import { aquaParksData } from "../../../data/aquaParksData";
import { useLanguage } from "../../../context/useLanguage";
// استيراد بوب أب الـ AuthChoiceModal الموحد
import AuthChoiceModal from "../../AuthChoiceModal/AuthChoiceModal"; 

const content = {
  EN: {
    label: "Family Fun",
    title: "Aqua Parks",
    from: "From",
    bookNow: "Book Now",
  },
  AR: {
    label: "متعة العائلة",
    title: "حدائق المياه",
    from: "من",
    bookNow: "احجز الآن",
  },
  RU: {
    label: "Семейное развлечение",
    title: "Аквапарки",
    from: "От",
    bookNow: "Забронировать",
  },
};

function AquaParks() {
  const { language } = useLanguage();
  const t = content[language] || content.EN;

  // State للتحكم في ظهور بوب أب الاختيار (تسجيل دخول / حساب جديد)
  const [showAuthChoice, setShowAuthChoice] = useState(false);
  // الـ id الخاص بالبارك لتخزينه عند الحاجة
  const [selectedParkId, setSelectedParkId] = useState(null);

  const handleBookingClick = (parkId) => {
    setSelectedParkId(parkId);
    setShowAuthChoice(true); // فتح البوب أب الصغير فوراً عند الضغط
  };

  return (
    <>
      <section className="aqua-parks" data-aos="fade-up" data-aos-duration="800">
        <div className="ap-container">

          {/* Header بدون زر All Parks */}
          <div className="ap-header" data-aos="fade-up" data-aos-delay="100">
            <div className="ap-title-group">
              <span className="ap-label">{t.label}</span>
              <h2 className="ap-title">{t.title}</h2>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="parks-grid">
           {(aquaParksData[language] || aquaParksData.EN).map((park, index) => (
              <div
                className="park-card"
                key={park.id}
                data-aos="fade-up"
                data-aos-delay={200 + (index * 100)}
              >
                {/* Image */}
                <div className="park-image-wrapper">
                  <img src={park.image} alt={park.title} className="park-image" />
                  <span className="park-badge">{park.badge}</span>
                </div>

                {/* Content */}
                <div className="park-content">
                  <h3 className="park-title">{park.title}</h3>
                  <p className="park-description">{park.description}</p>

                  {/* Rating */}
                  <div className="park-rating">
                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <FiStar
                          key={i}
                          className={i < Math.floor(park.rating) ? 'filled' : ''}
                        />
                      ))}
                    </div>
                    <span className="rating-value">{park.rating}</span>
                  </div>

                  {/* Footer */}
                  <div className="park-footer">
                    <div className="park-price">
                      <span className="from">{t.from}</span>
                      <span className="price">${park.price}</span>
                    </div>
                    <button 
                      className="book-btn"
                      onClick={() => handleBookingClick(park.id)}
                    >
                      {t.bookNow}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* بوب أب الـ AuthChoiceModal الموحد والمحمي */}
      <AuthChoiceModal
        isOpen={showAuthChoice}
        onClose={() => setShowAuthChoice(false)}
        onCloseAll={() => setShowAuthChoice(false)}
      />
    </>
  );
}

export default AquaParks;