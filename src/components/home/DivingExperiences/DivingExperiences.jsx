import { useState } from "react"; // استيراد useState لإدارة حالة الـ Modal
import "./DivingExperiences.css";
import { useNavigate } from "react-router-dom";
import { divingExperiencesData } from "../../../data/divingExperiencesData";
import { useLanguage } from "../../../context/useLanguage";
// استيراد نفس المودال المستخدم في الفنادق
import AuthChoiceModal from "../../AuthChoiceModal/AuthChoiceModal"; 

const content = {
  EN: {
    label: "Red Sea Diving",
    title: "Diving Experiences",
    bookNow: "Book Now",
  },
  AR: {
    label: "غوص البحر الأحمر",
    title: "تجارب الغوص",
    bookNow: "احجز الآن",
  },
  RU: {
    label: "Дайвинг в Красном море",
    title: "Дайвинг-туры",
    bookNow: "Забронировать",
  },
};

function DivingExperiences() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = content[language] || content.EN;

  // State للتحكم في ظهور بوب أب الاختيار (تسجيل دخول / حساب جديد)
  const [showAuthChoice, setShowAuthChoice] = useState(false);
  // الـ id الخاص بالرحلة اللي اليوزر ضغط عليها علشان نحتفظ بيه لو احتجتيه
  const [selectedDiveId, setSelectedDiveId] = useState(null);

  const handleBookingClick = (diveId) => {
    setSelectedDiveId(diveId);
    setShowAuthChoice(true); // فتح البوب أب الصغير فوراً
  };

  return (
    <>
      <section className="diving-experiences" data-aos="fade-up" data-aos-duration="800">
        <div className="de-container">

          {/* الهيدر بعد حذف زرار All Diving Trips */}
          <div className="de-header" data-aos="fade-up" data-aos-delay="100">
            <div className="de-title-group">
              <span className="de-label">{t.label}</span>
              <h2 className="de-title">{t.title}</h2>
            </div>
          </div>

          <div className="diving-grid">
            {(divingExperiencesData[language] || divingExperiencesData.EN).map((dive, index) => (
              <div
                className="diving-card"
                key={dive.id}
                data-aos="fade-up"
                data-aos-delay={200 + (index * 150)}
              >
                <div className="diving-image-wrapper">
                  <img src={dive.image} alt={dive.title} className="diving-image" />
                  <div className="diving-overlay"></div>

                  <div className="diving-badges">
                    <span className="badge-depth">{dive.depth}</span>
                    <span className="badge-level">{dive.level}</span>
                  </div>

                  <div className="diving-content">
                    <h3 className="diving-title">{dive.title}</h3>
                    <p className="diving-desc">{dive.description}</p>

                    <div className="diving-footer">
                      <span className="diving-price">${dive.price}</span>
                      <button
                        className="book-now-btn"
                        onClick={() => handleBookingClick(dive.id)}
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

      {/* ✅ استدعاء بوب أب الـ AuthChoiceModal ليظهر بمجرد الضغط على Book Now */}
      <AuthChoiceModal
        isOpen={showAuthChoice}
        onClose={() => setShowAuthChoice(false)}
        onCloseAll={() => {
          setShowAuthChoice(false);
        }}
      />
    </>
  );
}

export default DivingExperiences;