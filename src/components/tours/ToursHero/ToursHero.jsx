import "./ToursHero.css";
import { useLanguage } from "../../../context/useLanguage";

const ToursHero = ({ heroData }) => {
  const { language } = useLanguage();
  const t = heroData[language] || heroData.EN;

  return (
    <section className="tours-hero">
      <div className="tours-hero-bg">
        <img
          className="tours-hero-image"
          src={heroData.backgroundImage}
          alt=""
          aria-hidden="true"
        />
        <div className="tours-hero-overlay"></div>
      </div>

      <div className="container tours-hero-inner">
        <div className="tours-hero-content">
          <span className="tours-hero-badge">{t.badge}</span>

          <h1>
            {t.title} <span className="highlight-blue">{t.highlight}</span>
          </h1>

          <p>{t.description}</p>
        </div>
      </div>
    </section>
  );
};

export default ToursHero;