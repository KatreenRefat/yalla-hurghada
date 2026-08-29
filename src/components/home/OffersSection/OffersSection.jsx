import { useState } from "react"; // استيراد useState لإدارة حالة الـ Modal
import "./OffersSection.css";
import { useNavigate } from "react-router-dom";
import { offersSectionData } from "../../../data/offersSectionData";
import { FiZap } from "react-icons/fi";
import { useLanguage } from "../../../context/useLanguage";
// ✅ استيراد بوب أب الـ AuthChoiceModal لحماية الحجز
import AuthChoiceModal from "../../AuthChoiceModal/AuthChoiceModal"; 

function OffersSection() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { cta, promo } = offersSectionData[language] || offersSectionData.EN;

  // ✅ State للتحكم في ظهور بوب أب الاختيار (تسجيل دخول / حساب جديد)
  const [showAuthChoice, setShowAuthChoice] = useState(false);

  // ✅ فانكشن الحماية عند الضغط على زرار Book Now الرئيسي
  const handlePrimaryClick = () => {
    setShowAuthChoice(true); // فتح البوب أب فوراً بدلاً من الـ navigate المباشر
  };

  return (
    <>
      <section className="offers-section">

        {/* CTA Section */}
        <div className="cta-section">
          <div className="cta-bg">
            <img src={cta.backgroundImage} alt="Dream Vacation" />
            <div className="cta-overlay"></div>
          </div>
          <div className="cta-content">
            <h2 className="cta-title">
              {cta.label} <span className="highlight">{cta.titleHighlight}</span>
            </h2>
            <p className="cta-description">{cta.description}</p>

            <div className="cta-buttons">
              {/* زر Book Now محمي الآن */}
              <button className="cta-btn primary" onClick={handlePrimaryClick}>
                {cta.primaryButton.text}
              </button>
              <button className="cta-btn secondary" onClick={() => navigate(cta.secondaryButton.link)}>
                {cta.secondaryButton.text}
              </button>
            </div>
          </div>
        </div>

        {/* Promo Bar بدون زر Grab the Deal */}
        <div className="promo-bar">
          <div className="promo-container">
            <div className="promo-left">
              <div className="promo-icon-box">
                <FiZap className="promo-icon" />
              </div>
              <div className="promo-text">
                <h4 className="promo-title">{promo.title}</h4>
                <p className="promo-desc">{promo.description}</p>
              </div>
            </div>
            {/* تم حذف زر promo-btn (Grab the Deal) من هنا نهائياً */}
          </div>
        </div>

      </section>

      {/* ✅ استدعاء بوب أب الـ AuthChoiceModal ليظهر بمجرد الضغط على الـ Book Now المذكور أعلاه */}
      <AuthChoiceModal
        isOpen={showAuthChoice}
        onClose={() => setShowAuthChoice(false)}
        onCloseAll={() => setShowAuthChoice(false)}
      />
    </>
  );
}

export default OffersSection;