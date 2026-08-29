import "./HeroSection.css";
import heroVideo from "../../../assets/Videos/HeroVideo.mp4";
import {
  FiMapPin, FiSearch, FiStar, FiDollarSign, FiThumbsUp, FiTruck, FiCoffee
} from "react-icons/fi";
import {
  HiOutlineUserGroup, HiOutlineMap, HiOutlineBuildingOffice2, HiOutlineShieldCheck
} from "react-icons/hi2";
import { stats } from "../../../data/heroSectionData";
import { useLanguage } from "../../../context/useLanguage";

const iconMap = {
  FiMapPin: <FiMapPin />, FiSearch: <FiSearch />, FiStar: <FiStar />,
  FiDollarSign: <FiDollarSign />, FiThumbsUp: <FiThumbsUp />,
  FiTruck: <FiTruck />, FiCoffee: <FiCoffee />,
  HiOutlineUserGroup: <HiOutlineUserGroup />, HiOutlineMap: <HiOutlineMap />,
  HiOutlineBuildingOffice2: <HiOutlineBuildingOffice2 />, HiOutlineShieldCheck: <HiOutlineShieldCheck />,
};

const heroContent = {
  EN: {
    badge: "Discover the Red Sea Paradise",
    title1: "Explore", highlight: "Hurghada", title2: "Like Never Before",
    description: "Unforgettable tours, luxury hotels, and breathtaking experiences await you in Egypt's premier beach destination.",
    search: "Search",
  },
  AR: {
    badge: "اكتشف جنة البحر الأحمر",
    title1: "استكشف", highlight: "الغردقة", title2: "كما لم تفعل من قبل",
    description: "جولات لا تُنسى وفنادق فاخرة وتجارب رائعة تنتظرك في أفضل وجهة شاطئية في مصر.",
    search: "بحث",
  },
  RU: {
    badge: "Откройте рай Красного моря",
    title1: "Исследуйте", highlight: "Хургаду", title2: "Как никогда раньше",
    description: "Незабываемые туры, роскошные отели и захватывающие впечатления ждут вас на лучшем пляжном курорте Египта.",
    search: "Поиск",
  },
};

function HeroSection() {
  const { language } = useLanguage();
  const t = heroContent[language] || heroContent.EN;
  const currentStats = stats[language] || stats.EN;

  return (
    <section className="hero-section">
      <video className="hero-video" autoPlay loop muted playsInline>
        <source src={heroVideo} type="video/mp4" />
      </video>
      <div className="hero-overlay"></div>

      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge-icon">✦</span>
          {t.badge}
        </div>

        <h1 className="hero-title">
          {t.title1} <span className="highlight">{t.highlight}</span>
          <br />{t.title2}
        </h1>

        <p className="hero-description">{t.description}</p>
      </div>

      <div className="hero-stats">
        {currentStats.map((stat, index) => (
          <div className="stat-item" key={index}>
            <div className="stat-icon-box">{iconMap[stat.icon]}</div>
            <div className="stat-info">
              <h4>{stat.number}</h4>
              <p>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HeroSection;