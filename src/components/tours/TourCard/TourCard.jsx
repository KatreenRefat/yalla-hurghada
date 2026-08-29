import { useState, useCallback } from "react";
import TourDetailsModal from "../TourDetailsModal/TourDetailsModal";
import ARModal from "../ARModal/ARModal";
import useARModal from "../../../hooks/useARModal";
import "./TourCard.css";
import "../ARModal/ARModal.css";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../context/useLanguage";

const translations = {
  EN: {
    topRated: "Top Rated",
    from: "From",
    perPerson: "/person",
    arView: "AR View",
    viewInAR: "🥽 View in AR",
    viewDetails: "View Details",
  },
  AR: {
    topRated: "الأعلى تقييماً",
    from: "يبدأ من",
    perPerson: "/شخص",
    arView: "عرض AR",
    viewInAR: "🥽 عرض بالـ AR",
    viewDetails: "عرض التفاصيل",
  },
  RU: {
    topRated: "Топ рейтинг",
    from: "От",
    perPerson: "/чел.",
    arView: "AR вид",
    viewInAR: "🥽 Смотреть в AR",
    viewDetails: "Подробнее",
  },
};

const TourCard = ({ tour, index }) => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language] || translations.EN;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    isOpen: isAROpen,
    arState,
    showOnboarding,
    dismissOnboarding,
    selectedHotspot,
    selectHotspot,
    scale,
    updateScale,
    rotation,
    updateRotation,
    isFocusMode,
    toggleFocusMode,
    resetTransform,
    trackingQuality,
    openAR,
    closeAR,
    startARSession,
    exitARSession,
  } = useARModal();

  const handleARClick = useCallback(
    (e) => { e.stopPropagation(); openAR(tour); },
    [openAR, tour]
  );

  // نبعت بيانات التور الحقيقي عبر navigation state عشان /model/:id يقدر يستخدمها
  // حتى لو الـ id جاي من Supabase ومش موجود في الملف الثابت القديم
  const handleModelClick = useCallback(() => {
    navigate(`/model/${tour.id}`, { state: { tour } });
  }, [navigate, tour]);

  if (!tour) return null;

  return (
    <>
      <div
        className="tour-card"
        data-aos="fade-up"
        data-aos-duration="800"
        data-aos-delay={200 + index * 150}
        data-aos-once="true"
      >
        <div className="tour-card-image-wrapper">
          <img src={tour.image} alt={tour.title} className="tour-card-image" />
          {tour.isTopRated && (
            <span className="tour-top-rated-badge">{t.topRated}</span>
          )}

          <button className="tour-3d-btn" onClick={handleModelClick}>
            {t.arView}
          </button>

          <div className="tour-tags">
            {tour.tags?.map((tag) => (
              <span key={tag} className="tour-tag">{tag}</span>
            ))}
          </div>
        </div>

        <div className="tour-card-content">
          <span className="tour-location">📍 {tour.location}</span>
          <h3>{tour.title}</h3>
          <p>{tour.description}</p>
          <div className="tour-rating">
            ⭐⭐⭐⭐⭐
            <span>{tour.rating} ({tour.reviews})</span>
          </div>
          <div className="tour-features">
            <span>⏰ {tour.duration}</span>
            <span>👥 {tour.groupSize}</span>
          </div>
          <div className="tour-card-footer">
            <div className="tour-price">
              <span>{t.from}</span>
              <h4>${tour.price}</h4>
              <small>{t.perPerson}</small>
            </div>
            <div className="tour-card-footer-actions">
              <button
                className="tour-ar-modal-btn"
                onClick={handleARClick}
                aria-label={`View ${tour.title} in AR`}
              >
                {t.viewInAR}
              </button>
              <button className="tour-details-btn" onClick={() => setIsModalOpen(true)}>
                {t.viewDetails}
              </button>
            </div>
          </div>
        </div>
      </div>

      <TourDetailsModal
        tour={tour}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <ARModal
        tour={tour}
        isOpen={isAROpen}
        arState={arState}
        onClose={closeAR}
        onStart={startARSession}
        onExit={exitARSession}
        showOnboarding={showOnboarding}
        onDismissOnboarding={dismissOnboarding}
        selectedHotspot={selectedHotspot}
        onSelectHotspot={selectHotspot}
        scale={scale}
        onUpdateScale={updateScale}
        rotation={rotation}
        onUpdateRotation={updateRotation}
        isFocusMode={isFocusMode}
        onToggleFocus={toggleFocusMode}
        onResetTransform={resetTransform}
        trackingQuality={trackingQuality}
      />
    </>
  );
};

export default TourCard;