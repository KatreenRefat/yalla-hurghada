import "./ChooseAdventure.css";
import { 
  FiArrowRight, 
  FiAnchor, 
  FiSun, 
  FiDroplet, 
  FiMap, 
  FiWind,
  FiUmbrella
} from "react-icons/fi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { chooseAdventureData } from "../../../data/chooseAdventureData";
import { useLanguage } from "../../../context/useLanguage";

const content = {
  EN: {
    label: "Experience Hurghada",
    title: "Choose Your Adventure",
    description: "From the depths of the Red Sea to the vast Eastern Desert, every experience in Hurghada is unforgettable.",
    explore: "Explore",
  },
  AR: {
    label: "اكتشف الغردقة",
    title: "اختر مغامرتك",
    description: "من أعماق البحر الأحمر إلى الصحراء الشرقية الشاسعة, كل تجربة في الغردقة لا تُنسى.",
    explore: "استكشف",
  },
  RU: {
    label: "Откройте Хургаду",
    title: "Выберите приключение",
    description: "От глубин Красного моря до просторов Восточной пустыни — каждый опыт в Хургаде незабываем.",
    explore: "Исследовать",
  },
};

const iconMap = {
  diving: FiDroplet,
  yacht: FiAnchor,
  safari: FiSun,
  beach: FiUmbrella,
  aqua: FiWind,
  culture: FiMap,
};

function ChooseAdventure() {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = content[language] || content.EN;
  const data = chooseAdventureData[language] || chooseAdventureData.EN;
  const active = data[activeTab];
  const ActiveIcon = iconMap[active.iconKey];

  return (
    <section className="choose-adventure" data-aos="fade-up" data-aos-duration="800">
      <div className="ca-container">

        {/* Header */}
        <div className="ca-header" data-aos="fade-up" data-aos-delay="100">
          <span className="ca-label">{t.label}</span>
          <h2 className="ca-title">{t.title}</h2>
          <p className="ca-description">{t.description}</p>
        </div>

        {/* TABS */}
        <div className="ca-tabs">
          {data.map((item, index) => {
            const TabIcon = iconMap[item.iconKey];
            return (
              <button
                key={item.id}
                className={`ca-tab ${activeTab === index ? "active" : ""}`}
                onClick={() => setActiveTab(index)}
              >
                <span className="tab-icon"><TabIcon /></span>
                <span className="tab-label">{item.title}</span>
                <span className="tab-count">{item.count}</span>
              </button>
            );
          })}
        </div>

        {/* IMAGE WITH CONTENT */}
        <div className="ca-content">
          <div className="ca-image-wrapper">
            <img src={active.image} alt={active.title} className="ca-image" />
            <div className="ca-image-overlay"></div>

            <div className="ca-content-box">
              <div className="ca-content-icon">
                <ActiveIcon />
              </div>
              <h3 className="ca-content-title">{active.fullTitle}</h3>
              <p className="ca-content-desc">{active.description}</p>
              
              {/* تم حذف زرار Explore من هنا */}
              
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default ChooseAdventure;