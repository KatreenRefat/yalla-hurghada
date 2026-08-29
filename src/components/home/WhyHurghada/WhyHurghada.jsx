
import "./WhyHurghada.css";
import { 
  FiActivity, 
  FiAnchor, 
  FiSun, 
  FiSunrise, 
  FiDroplet, 
  FiGlobe 
} from "react-icons/fi";
import { whyHurghadaData } from "../../../data/whyHurghadaData";
import { useLanguage } from "../../../context/useLanguage";
const iconMap = {
  FiActivity: FiActivity,
  FiAnchor: FiAnchor,
  FiSun: FiSun,
  FiSunrise: FiSunrise,
  FiDroplet: FiDroplet,
  FiGlobe: FiGlobe,
};

function WhyHurghada() {
  const { language } = useLanguage();
  const { label, title, description, stats } = whyHurghadaData[language] || whyHurghadaData.EN;

  return (
    <section className="why-hurghada" data-aos="fade-up" data-aos-duration="800">
      <div className="wh-container">
        
        {/* Header */}
        <div className="wh-header" data-aos="fade-up" data-aos-delay="100">
          <span className="wh-label">{label}</span>
          <h2 className="wh-title">{title}</h2>
          <p className="wh-description">{description}</p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => {
            const IconComponent = iconMap[stat.icon];
            return (
              <div 
                className="stat-card" 
                key={stat.id}
                data-aos="fade-up" 
                data-aos-delay={200 + (index * 100)}
              >
                <div 
                  className="stat-icon-box"
                  style={{ backgroundColor: stat.color + '20' }} 
                >
                  <IconComponent 
                    size={24} 
                    style={{ color: stat.color }}
                  />
                </div>
                <span className="stat-number">{stat.number}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default WhyHurghada;
