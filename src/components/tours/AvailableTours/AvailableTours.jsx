import { useState, useEffect } from "react";
import { getTours, normalizeTour } from "../../../services/tourService";
import TourCard from "../TourCard/TourCard";
import "./AvailableTours.css";
import { useLanguage } from "../../../context/useLanguage";

const translations = {
  EN: {
    title: "Available Tours",
    found: (n) => `${n} tours available`,
    searchPlaceholder: "Search tours...",
    filtersBtn: "Filters",
    filterTitle: "Filter Tours",
    clearAll: "× Clear all",
    tourLocation: "Tour Location",
    tourType: "Tour Type",
    sortBy: "Sort By",
    noResultsTitle: "No tours found",
    noResultsDesc: "Try changing your search or filter options.",
    resetFilters: "Reset filters",
    loading: "Loading tours...",
    error: "Failed to load tours.",
    tourLocations: [
      { id: "makadi", label: "Makadi" },
      { id: "safaga", label: "Safaga" },
      { id: "sahl-hasheesh", label: "Sahl Hasheesh" },
      { id: "gouna", label: "Gouna" },
    ],
    tourTypes: [
      { id: "diving", label: "Diving", icon: "🤿" },
      { id: "safari", label: "Safari", icon: "🏜️" },
      { id: "yacht", label: "Yacht", icon: "🛥️" },
      { id: "beach", label: "Beach", icon: "🏖️" },
    ],
    sortOptions: [
      { id: "recommended", label: "Recommended" },
      { id: "price-low-high", label: "Price: Low to High" },
      { id: "price-high-low", label: "Price: High to Low" },
      { id: "highest-rated", label: "Highest Rated" },
      { id: "most-reviewed", label: "Most Reviewed" },
    ],
  },
  AR: {
    title: "الجولات المتاحة",
    found: (n) => `${n} جولة متاحة`,
    searchPlaceholder: "ابحث عن جولة...",
    filtersBtn: "الفلاتر",
    filterTitle: "تصفية الجولات",
    clearAll: "× مسح الكل",
    tourLocation: "موقع الجولة",
    tourType: "نوع الجولة",
    sortBy: "ترتيب حسب",
    noResultsTitle: "لا توجد جولات",
    noResultsDesc: "حاول تغيير خيارات البحث أو الفلتر.",
    resetFilters: "إعادة تعيين الفلاتر",
    loading: "جاري تحميل الجولات...",
    error: "فشل تحميل الجولات.",
    tourLocations: [
      { id: "makadi", label: "مكادي" },
      { id: "safaga", label: "سفاجا" },
      { id: "sahl-hasheesh", label: "سهل حشيش" },
      { id: "gouna", label: "الجونة" },
    ],
    tourTypes: [
      { id: "diving", label: "غوص", icon: "🤿" },
      { id: "safari", label: "سفاري", icon: "🏜️" },
      { id: "yacht", label: "يخت", icon: "🛥️" },
      { id: "beach", label: "شاطئ", icon: "🏖️" },
    ],
    sortOptions: [
      { id: "recommended", label: "الموصى به" },
      { id: "price-low-high", label: "السعر: من الأقل للأعلى" },
      { id: "price-high-low", label: "السعر: من الأعلى للأقل" },
      { id: "highest-rated", label: "الأعلى تقييماً" },
      { id: "most-reviewed", label: "الأكثر مراجعات" },
    ],
  },
  RU: {
    title: "Доступные туры",
    found: (n) => `${n} туров доступно`,
    searchPlaceholder: "Поиск туров...",
    filtersBtn: "Фильтры",
    filterTitle: "Фильтр туров",
    clearAll: "× Очистить всё",
    tourLocation: "Место тура",
    tourType: "Тип тура",
    sortBy: "Сортировать по",
    noResultsTitle: "Туры не найдены",
    noResultsDesc: "Попробуйте изменить параметры поиска.",
    resetFilters: "Сбросить фильтры",
    loading: "Загрузка туров...",
    error: "Не удалось загрузить туры.",
    tourLocations: [
      { id: "makadi", label: "Макади" },
      { id: "safaga", label: "Сафага" },
      { id: "sahl-hasheesh", label: "Сахл Хашиш" },
      { id: "gouna", label: "Эль-Гуна" },
    ],
    tourTypes: [
      { id: "diving", label: "Дайвинг", icon: "🤿" },
      { id: "safari", label: "Сафари", icon: "🏜️" },
      { id: "yacht", label: "Яхта", icon: "🛥️" },
      { id: "beach", label: "Пляж", icon: "🏖️" },
    ],
    sortOptions: [
      { id: "recommended", label: "Рекомендуемые" },
      { id: "price-low-high", label: "Цена: по возрастанию" },
      { id: "price-high-low", label: "Цена: по убыванию" },
      { id: "highest-rated", label: "Высокий рейтинг" },
      { id: "most-reviewed", label: "Больше отзывов" },
    ],
  },
};

const AvailableTours = () => {
  const { language } = useLanguage();
  const t = translations[language] || translations.EN;

  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState(null);
  const [filters, setFilters] = useState({
    tourLocation: "",
    tourType: "",
    sortBy: "recommended",
  });

  useEffect(() => {
    let active = true;
    getTours()
      .then((data) => {
        if (!active) return;
        setTours(data.map(normalizeTour));
        setError(null);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const handleLocationChange = (tourLocation) => {
    setFilters((prev) => ({ ...prev, tourLocation }));
  };

  const handleTourTypeChange = (tourType) => {
    setFilters((prev) => ({
      ...prev,
      tourType: prev.tourType === tourType ? "" : tourType,
    }));
  };

  const handleSortChange = (sortBy) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilters({ tourLocation: "", tourType: "", sortBy: "recommended" });
  };

  const filteredTours = tours
    .filter((tour) => {
      const searchValue = searchTerm.toLowerCase();
      const matchesSearch =
        (tour.title || "").toLowerCase().includes(searchValue) ||
        (tour.location || "").toLowerCase().includes(searchValue) ||
        (tour.description || "").toLowerCase().includes(searchValue);
      const matchesType = !filters.tourType || tour.type === filters.tourType;
      const matchesLocation =
        !filters.tourLocation ||
        (tour.location || "").toLowerCase().includes(filters.tourLocation.toLowerCase());
      return matchesSearch && matchesType && matchesLocation;
    })
    .sort((a, b) => {
      if (filters.sortBy === "price-low-high") return a.price - b.price;
      if (filters.sortBy === "price-high-low") return b.price - a.price;
      if (filters.sortBy === "highest-rated") return b.rating - a.rating;
      if (filters.sortBy === "most-reviewed") return b.reviews - a.reviews;
      return (b.isTopRated ? 1 : 0) - (a.isTopRated ? 1 : 0);
    });

  return (
    <section className="available-transport-section">
      <div className="container">
        <div className="available-transport-header">
          <div>
            <h2>{t.title}</h2>
            <p>{t.found(filteredTours.length)}</p>
          </div>

          <div className="available-transport-actions">
            <div className="transport-search-input">
              <span>⌕</span>
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="transport-sort-select"
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              {t.sortOptions.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>

            <button
              type="button"
              className={isFilterOpen ? "transport-filter-toggle active" : "transport-filter-toggle"}
              onClick={() => setIsFilterOpen((prev) => !prev)}
            >
              <span>☷</span> {t.filtersBtn}
            </button>
          </div>
        </div>

        {isFilterOpen && (
          <div className="transport-filter-panel">
            <div className="filter-panel-header">
              <h3>{t.filterTitle}</h3>
              <button type="button" onClick={handleClearFilters}>{t.clearAll}</button>
            </div>
            <div className="filter-panel-content">
              <div className="filter-group">
                <h4>{t.tourLocation}</h4>
                <div className="filter-options">
                  {t.tourLocations.map((loc) => (
                    <button key={loc.id} type="button"
                      className={filters.tourLocation === loc.id ? "filter-chip active" : "filter-chip"}
                      onClick={() => handleLocationChange(loc.id)}>
                      {loc.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group filter-group-wide">
                <h4>{t.tourType}</h4>
                <div className="filter-options">
                  {t.tourTypes.map((type) => (
                    <button key={type.id} type="button"
                      className={filters.tourType === type.id ? "filter-chip active" : "filter-chip"}
                      onClick={() => handleTourTypeChange(type.id)}>
                      <span>{type.icon}</span> {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <h4>{t.sortBy}</h4>
                <div className="filter-options">
                  {t.sortOptions.map((o) => (
                    <button key={o.id} type="button"
                      className={filters.sortBy === o.id ? "filter-chip active" : "filter-chip"}
                      onClick={() => handleSortChange(o.id)}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {loading && <p style={{ textAlign: "center", padding: "32px", color: "#888" }}>{t.loading}</p>}
        {error && <p style={{ textAlign: "center", padding: "32px", color: "#ef4444" }}>{t.error}</p>}

        {!loading && !error && (
          filteredTours.length > 0 ? (
            <div className="row g-4">
              {filteredTours.map((tour, index) => (
                <div key={tour.id} className="col-xl-4 col-lg-6">
                  <TourCard tour={tour} index={index} onViewDetails={setSelectedTour} />
                </div>
              ))}
            </div>
          ) : (
            <div className="transport-empty-state">
              <h3>{t.noResultsTitle}</h3>
              <p>{t.noResultsDesc}</p>
              <button type="button" onClick={handleClearFilters}>{t.resetFilters}</button>
            </div>
          )
        )}

        {selectedTour && (
          <div className="transport-modal-placeholder">
            <div>
              <h3>{selectedTour.title}</h3>
              <p>Modal will be added in the next step.</p>
              <button type="button" onClick={() => setSelectedTour(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default AvailableTours;