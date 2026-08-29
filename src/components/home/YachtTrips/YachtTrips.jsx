import { useState } from "react"; // استيراد useState لإدارة حالة الـ Modal
import "./YachtTrips.css";
import { FiClock, FiUsers, FiAnchor } from "react-icons/fi";
import { yachtTripsData } from "../../../data/yachtTripsData";
import { useLanguage } from "../../../context/useLanguage";
// استيراد بوب أب الـ AuthChoiceModal
import AuthChoiceModal from "../../AuthChoiceModal/AuthChoiceModal"; 

const content = {
  EN: { label: "Luxury On Water", title: "Yacht & Boat Trips", from: "From", bookNow: "Book Now" },
  AR: { label: "فخامة على الماء", title: "رحلات اليخت والقوارب", from: "من", bookNow: "احجز الآن" },
  RU: { label: "Роскошь на воде", title: "Яхты и лодочные туры", from: "От", bookNow: "Забронировать" },
};

function YachtTrips() {
  const { language } = useLanguage();
  const t = content[language] || content.EN;
  const data = yachtTripsData[language] || yachtTripsData.EN;

  // State للتحكم في ظهور بوب أب الاختيار (تسجيل دخول / حساب جديد)
  const [showAuthChoice, setShowAuthChoice] = useState(false);
  // الـ id الخاص برحلة اليخت لتخزينه عند الحاجة
  const [selectedYachtId, setSelectedYachtId] = useState(null);

  const handleBookingClick = (yachtId) => {
    setSelectedYachtId(yachtId);
    setShowAuthChoice(true); // فتح البوب أب فوراً عند الضغط
  };

  return (
    <>
      <section className="yacht-trips" data-aos="fade-up" data-aos-duration="800">
        <div className="yt-container">

          {/* الـ Header بعد حذف زرار All Yacht Trips */}
          <div className="yt-header" data-aos="fade-up" data-aos-delay="100">
            <div className="yt-title-group">
              <span className="yt-label">{t.label}</span>
              <h2 className="yt-title">{t.title}</h2>
            </div>
          </div>

          <div className="yacht-grid">
            {data.map((yacht, index) => (
              <div
                className="yacht-card"
                key={yacht.id}
                data-aos="fade-up"
                data-aos-delay={200 + index * 150}
              >
                <div className="yacht-image-wrapper">
                  <img src={yacht.image} alt={yacht.title} className="yacht-image" />
                  <span className="yacht-badge">
                    <FiAnchor /> {yacht.badge}
                  </span>
                </div>

                <div className="yacht-content">
                  <h3 className="yacht-title">{yacht.title}</h3>
                  <p className="yacht-desc">{yacht.description}</p>

                  <div className="yacht-meta">
                    <span className="meta-item"><FiClock /> {yacht.duration}</span>
                    <span className="meta-item"><FiUsers /> {yacht.guests}</span>
                  </div>

                  <div className="yacht-footer">
                    <div className="yacht-price">
                      <span className="from">{t.from}</span>
                      <span className="price">${yacht.price}</span>
                    </div>
                    <button 
                      className="yacht-btn"
                      onClick={() => handleBookingClick(yacht.id)}
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

      {/* ✅ استدعاء بوب أب الـ AuthChoiceModal ليظهر فوق الكومبوننت */}
      <AuthChoiceModal
        isOpen={showAuthChoice}
        onClose={() => setShowAuthChoice(false)}
        onCloseAll={() => setShowAuthChoice(false)}
      />
    </>
  );
}

export default YachtTrips;