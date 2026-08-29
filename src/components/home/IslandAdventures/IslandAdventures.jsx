import "./IslandAdventures.css";
import { FiMapPin } from "react-icons/fi";
import { islandAdventuresData } from "../../../data/islandAdventuresData";
import { useLanguage } from "../../../context/useLanguage";

const content = {
  EN: {
    label: "Island Paradise",
    title: "Island Adventures",
    description: "Explore the pristine islands surrounding Hurghada",
    tours: "Tours",
  },
  AR: {
    label: "جنة الجزر",
    title: "مغامرات الجزر",
    description: "استكشف الجزر البكر المحيطة بالغردقة",
    tours: "جولات",
  },
  RU: {
    label: "Островной рай",
    title: "Островные приключения",
    description: "Исследуйте нетронутые острова вокруг Хургады",
    tours: "туров",
  },
};

function IslandAdventures() {
  const { language } = useLanguage();
  const t = content[language] || content.EN;

  return (
    <section
      className="island-adventures"
      style={{ background: '#f8fafc' }}
      data-aos="fade-up"
      data-aos-duration="800"
    >
      <div className="ia-container">

        {/* Header */}
        <div className="ia-header" data-aos="fade-up" data-aos-delay="100">
          <span className="ia-label">{t.label}</span>
          <h2 className="ia-title">{t.title}</h2>
          <p className="ia-description">{t.description}</p>
        </div>

        {/* Cards Grid */}
        <div className="islands-grid">
          {(islandAdventuresData[language] || islandAdventuresData.EN).map((island, index) => (
            <div
              className="island-card"
              key={island.id}
              data-aos="fade-up"
              data-aos-delay={200 + (index * 100)}
            >
              <div className="island-image-wrapper">
                <img src={island.image} alt={island.title} className="island-image" />
                <div className="island-overlay"></div>

                <div className="island-content">
                  <h3 className="island-title">{island.title}</h3>
                  <div className="island-tours">
                    <FiMapPin /> {island.tours} {t.tours}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default IslandAdventures;