import { useState } from "react"; // استيراد useState لإدارة حالة الـ Modal
import "./DesertSafari.css";
import { FiClock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { desertSafariV2Data } from "../../../data/desertSafariData";
import { useLanguage } from "../../../context/useLanguage";
// استيراد بوب أب الـ AuthChoiceModal الموحد عندك
import AuthChoiceModal from "../../AuthChoiceModal/AuthChoiceModal"; 

const content = {
  EN: {
    label: "Eastern Desert",
    title: "Desert Safari Adventures",
    description: "Leave the coast behind and venture into the vast Eastern Desert for adrenaline, culture, and stargazing.",
    bookNow: "Book Now",
  },
  AR: {
    label: "الصحراء الشرقية",
    title: "مغامرات سفاري الصحراء",
    description: "اترك الساحل خلفك وانطلق إلى الصحراء الشرقية الشاسعة للأدرينالين والثقافة ومشاهدة النجوم.",
    bookNow: "احجز الآن",
  },
  RU: {
    label: "Восточная пустыня",
    title: "Сафари-приключения в пустыне",
    description: "Оставьте побережье позади и отправьтесь в просторы Восточной пустыни за адреналином, культурой и наблюдением за звёздами.",
    bookNow: "Забронировать",
  },
};

function DesertSafariV2() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = content[language] || content.EN;

  // State للتحكم في ظهور بوب أب الاختيار (تسجيل دخول / حساب جديد)
  const [showAuthChoice, setShowAuthChoice] = useState(false);
  // الـ id الخاص برحلة السفاري لتخزينه عند الحاجة
  const [selectedSafariId, setSelectedSafariId] = useState(null);

  const handleBookingClick = (safariId) => {
    setSelectedSafariId(safariId);
    setShowAuthChoice(true); // فتح البوب أب الصغير فوراً عند الضغط
  };

  return (
    <>
      <section className="desert-safari-v2" data-aos="fade-up" data-aos-duration="800">
        <div className="ds2-container">

          <div className="ds2-header" data-aos="fade-up" data-aos-delay="100">
            <span className="ds2-label">{t.label}</span>
            <h2 className="ds2-title">{t.title}</h2>
            <p className="ds2-description">{t.description}</p>
          </div>

          <div className="ds2-grid">
            {(desertSafariV2Data[language] || desertSafariV2Data.EN).map((item, index) => (
              <div
                className="ds2-card"
                key={item.id}
                data-aos="fade-up"
                data-aos-delay={200 + (index * 150)}
              >
                <div className="ds2-image-wrapper">
                  <img src={item.image} alt={item.title} className="ds2-image" />
                  <div className="ds2-overlay"></div>

                  <span className="ds2-badge">{item.badge}</span>

                  <div className="ds2-content">
                    <h3 className="ds2-card-title">{item.title}</h3>
                    <p className="ds2-card-desc">{item.description}</p>

                    <div className="ds2-footer">
                      <div className="ds2-price-row">
                        <span className="ds2-price">${item.price}</span>
                        <span className="ds2-duration">
                          <FiClock /> {item.duration}
                        </span>
                      </div>
                      <button
                        className="book-now-btn"
                        /* استدعاء الفانكشن الجديدة بدلاً من التوجيه المباشر */
                        onClick={() => handleBookingClick(item.id)}
                      >
                        {t.bookNow}
                      </button>
                    </div>
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

export default DesertSafariV2;