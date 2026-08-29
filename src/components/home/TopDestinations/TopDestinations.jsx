import "./TopDestinations.css";
import { FiMapPin } from "react-icons/fi";
import { popularDestinationsData } from "../../../data/topDestinationsData";
import { useLanguage } from "../../../context/useLanguage";

const content = {
  EN: { label: "Top Destinations", title: "Popular Destinations", tours: "Tours" },
  AR: { label: "أفضل الوجهات", title: "الوجهات الشهيرة", tours: "جولات" },
  RU: { label: "Топ направления", title: "Популярные направления", tours: "туров" },
};

function PopularDestinations() {
  const { language } = useLanguage();
  const t = content[language] || content.EN;
  const data = popularDestinationsData[language] || popularDestinationsData.EN;

  return (
    <section className="popular-destinations">
      <div className="container">

        <div className="section-header">
          <span className="section-label">{t.label}</span>
          <h2 className="section-title">{t.title}</h2>
        </div>

        <div className="destinations-grid">
          {data.map((dest) => (
            <div className="destination-card" key={dest.id}>
              <div className="destination-image-wrapper">
                <img src={dest.image} alt={dest.name} className="destination-image" />
                <div className="destination-overlay"></div>
                <div className="destination-content">
                  <h3 className="destination-name">{dest.name}</h3>
                  <div className="destination-tours">
                    <FiMapPin />
                    <span>{dest.tours} {t.tours}</span>
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

export default PopularDestinations;