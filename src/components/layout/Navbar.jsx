import "./Navbar.css";
import logo from "../../assets/images/Hurgada.png";
import { FiMoon, FiSun, FiMenu, FiX, FiGlobe, FiChevronDown } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../../context/useTheme";
import { useLanguage } from "../../context/useLanguage";

function Navbar() {
  const { darkMode, setDarkMode } = useTheme();
  const { language, setLanguage } = useLanguage();
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setMenuOpen(false);
        setLangDropdownOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const languages = [
    { code: "EN", name: "English", flag: "🇬🇧" },
    { code: "AR", name: "العربية", flag: "🇸🇦" },
    { code: "RU", name: "Русский", flag: "🇷🇺" },
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  const navLinks = [
    { path: "/", labelEN: "Home", labelAR: "الرئيسية", labelRU: "Главная" },
    { path: "/tours", labelEN: "Tours", labelAR: "الجولات", labelRU: "Туры" },
    { path: "/hotels", labelEN: "hotels", labelAR: "الفنادق", labelRU: "Отели" },
    { path: "/restaurants", labelEN: "Restaurants", labelAR: "المطاعم", labelRU: "Рестораны" },
    { path: "/transport", labelEN: "Transport", labelAR: "المواصلات", labelRU: "Транспорт" },
    { path: "/bookings", labelEN: "Booking", labelAR: "الحجوزات", labelRU: "Бронирование" },
    { path: "/contact", labelEN: "Contact", labelAR: "تواصل معنا", labelRU: "Контакты" },
  ];

  const getLabel = (link) => {
    if (language === "AR") return link.labelAR;
    if (language === "RU") return link.labelRU;
    return link.labelEN;
  };

  const getAuthText = () => {
    if (language === "AR") return { login: "تسجيل الدخول", signup: "إنشاء حساب" };
    if (language === "RU") return { login: "Войти", signup: "Регистрация" };
    return { login: "Log in", signup: "Sign up" };
  };

  const authText = getAuthText();
  const toggleLang = () => setLangDropdownOpen(!langDropdownOpen);
  const selectLang = (code) => { setLanguage(code); setLangDropdownOpen(false); };
  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <nav className="main-navbar">
      <div className="navbar-glass">
        
        <div className="navbar-left">
          <div className="navbar-brand">
            <img src={logo} alt="Yalla Hurghada" className="logo-img" />
            <div className="brand-text">
              <span className="brand-yalla">Yalla</span>
              <span className="brand-hurghada">Hurghada</span>
            </div>
          </div>
        </div>

        <ul className="navbar-links-desktop">
          {navLinks.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
                end={link.path === "/"}
              >
                {getLabel(link)}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="navbar-actions-desktop">
          <div className="lang-dropdown" ref={langRef}>
            <button className="lang-trigger" onClick={toggleLang} type="button">
              <FiGlobe className="globe-icon" />
              <span className="lang-code">{currentLang.code}</span>
              <FiChevronDown className={`chevron ${langDropdownOpen ? "rotate" : ""}`} />
            </button>
            {langDropdownOpen && (
              <div className="lang-menu">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`lang-option ${language === lang.code ? "active" : ""}`}
                    onClick={() => selectLang(lang.code)}
                    type="button"
                  >
                    <span className="lang-flag">{lang.flag}</span>
                    <span className="lang-name">{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="icon-btn theme-btn" onClick={toggleTheme} type="button">
            {darkMode ? <FiSun /> : <FiMoon />}
          </button>

          <div className="nav-divider"></div>
          <NavLink to="/login" className="login-link">{authText.login}</NavLink>
          <NavLink to="/signup" className="signup-btn">{authText.signup}</NavLink>
        </div>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} type="button">
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        <div className={`mobile-menu ${menuOpen ? "show" : ""}`}>
          <ul className="mobile-links">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) => isActive ? "mobile-link active" : "mobile-link"}
                  end={link.path === "/"}
                  onClick={() => setMenuOpen(false)}
                >
                  {getLabel(link)}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="mobile-divider"></div>
          <div className="mobile-actions">
            <div className="mobile-lang-buttons">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  className={`mobile-lang-btn ${language === lang.code ? "active" : ""}`}
                  onClick={() => { selectLang(lang.code); setMenuOpen(false); }}
                  type="button"
                >
                  <span className="lang-flag">{lang.flag}</span>
                  <span className="lang-name">{lang.name}</span>
                </button>
              ))}
            </div>
            <button className="icon-btn mobile-icon-btn" onClick={toggleTheme} type="button">
              {darkMode ? <FiSun /> : <FiMoon />}
            </button>
            <NavLink to="/login" className="login-link mobile-login" onClick={() => setMenuOpen(false)}>
              {authText.login}
            </NavLink>
            <NavLink to="/signup" className="signup-btn mobile-signup" onClick={() => setMenuOpen(false)}>
              {authText.signup}
            </NavLink>
          </div>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;
