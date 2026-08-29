// src/components/Restaurants/AvailableRestaurantcards/AvailableRestaurants.jsx
// ─────────────────────────────────────────────────────────────
// نفس الـ UI بالظبط - بيجيب البيانات من الـ Backend عوض الـ static file
// ─────────────────────────────────────────────────────────────

import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import RestaurantCard from "../RestaurantCards/RestaurantCard";
import "./AvailableRestaurantcards.css";
import { useLanguage } from "../../../context/useLanguage";
import { getRestaurants, normalizeRestaurant } from "../../../services/restaurantService";

const translations = {
  EN: {
    title: "Available Restaurants",
    found: (n) => `${n} restaurants found in Hurghada`,
    searchPlaceholder: "Search restaurants...",
    sortLabel: "Filters",
    filterTitle: "Filter Restaurants",
    clearAll: "x Clear all",
    cuisineType: "Cuisine Type",
    topRatedOnly: "Top Rated Only",
    all: "All",
    topRated: "Top Rated",
    noResultsTitle: "No restaurants found",
    noResultsDesc: "Try changing your search or filter options.",
    resetFilters: "Reset filters",
    loading: "Loading restaurants...",
    error: "Failed to load restaurants. Please try again.",
    retry: "Retry",
    sortOptions: [
      { id: "recommended",   label: "Recommended" },
      { id: "highest-rated", label: "Highest Rated" },
      { id: "most-reviewed", label: "Most Reviewed" },
    ],
    cuisineOptions: [
      { id: "all",           label: "All" },
      { id: "Egyptian",      label: "Egyptian" },
      { id: "Italian",       label: "Italian" },
      { id: "Indian",        label: "Indian" },
      { id: "Seafood",       label: "Seafood" },
      { id: "International", label: "International" },
    ],
  },
  AR: {
    title: "المطاعم المتاحة",
    found: (n) => `تم العثور على ${n} مطعم في الغردقة`,
    searchPlaceholder: "ابحث عن مطعم...",
    sortLabel: "الفلاتر",
    filterTitle: "تصفية المطاعم",
    clearAll: "x مسح الكل",
    cuisineType: "نوع المطبخ",
    topRatedOnly: "الأعلى تقييماً فقط",
    all: "الكل",
    topRated: "الأعلى تقييماً",
    noResultsTitle: "لا توجد مطاعم",
    noResultsDesc: "حاول تغيير خيارات البحث أو الفلتر.",
    resetFilters: "إعادة تعيين الفلاتر",
    loading: "جاري تحميل المطاعم...",
    error: "فشل في تحميل المطاعم. حاول مرة أخرى.",
    retry: "إعادة المحاولة",
    sortOptions: [
      { id: "recommended",   label: "الموصى به" },
      { id: "highest-rated", label: "الأعلى تقييماً" },
      { id: "most-reviewed", label: "الأكثر مراجعات" },
    ],
    cuisineOptions: [
      { id: "all",           label: "الكل" },
      { id: "Egyptian",      label: "مصري" },
      { id: "Italian",       label: "إيطالي" },
      { id: "Indian",        label: "هندي" },
      { id: "Seafood",       label: "مأكولات بحرية" },
      { id: "International", label: "دولي" },
    ],
  },
  RU: {
    title: "Доступные рестораны",
    found: (n) => `Найдено ${n} ресторанов в Хургаде`,
    searchPlaceholder: "Поиск ресторанов...",
    sortLabel: "Фильтры",
    filterTitle: "Фильтр ресторанов",
    clearAll: "x Очистить всё",
    cuisineType: "Тип кухни",
    topRatedOnly: "Только высокий рейтинг",
    all: "Все",
    topRated: "Высокий рейтинг",
    noResultsTitle: "Рестораны не найдены",
    noResultsDesc: "Попробуйте изменить параметры поиска или фильтры.",
    resetFilters: "Сбросить фильтры",
    loading: "Загрузка ресторанов...",
    error: "Не удалось загрузить рестораны. Попробуйте ещё раз.",
    retry: "Повторить",
    sortOptions: [
      { id: "recommended",   label: "Рекомендуемые" },
      { id: "highest-rated", label: "Высокий рейтинг" },
      { id: "most-reviewed", label: "Больше отзывов" },
    ],
    cuisineOptions: [
      { id: "all",           label: "Все" },
      { id: "Egyptian",      label: "Египетская" },
      { id: "Italian",       label: "Итальянская" },
      { id: "Indian",        label: "Индийская" },
      { id: "Seafood",       label: "Морепродукты" },
      { id: "International", label: "Международная" },
    ],
  },
};

// ── SKELETON ──────────────────────────────────────────────────
const RestaurantSkeleton = () => (
  <div style={{
    background: "#fff", borderRadius: 20, overflow: "hidden",
    boxShadow: "0 4px 16px rgba(0,0,0,0.07)", minHeight: 460,
  }}>
    <div style={{
      height: 220,
      background: "linear-gradient(90deg,#f0f4f8 25%,#e2e8f0 50%,#f0f4f8 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite",
    }} />
    <div style={{ padding: 20 }}>
      {[60, 80, 100, 50, 70].map((w, i) => (
        <div key={i} style={{
          height: 13, borderRadius: 6, background: "#e2e8f0",
          width: `${w}%`, marginBottom: 12,
        }} />
      ))}
    </div>
    <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
  </div>
);

// ── MAIN COMPONENT ────────────────────────────────────────────
const AvailableRestaurants = () => {
  const { language } = useLanguage();
  const t = translations[language] || translations.EN;

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [searchTerm, setSearchTerm]   = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters]         = useState({
    cuisine: "all",
    topRated: false,
    sortBy: "recommended",
  });

  // ── FETCH ─────────────────────────────────────────────────
  const fetchRestaurants = async () => {
    setLoading(true);
    setError(null);
    try {
      const raw = await getRestaurants();
      setRestaurants(raw.map(normalizeRestaurant));
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    AOS.init();
    // Avoid calling setState synchronously inside effect to prevent cascading renders
    const id = setTimeout(() => fetchRestaurants(), 0);
    return () => clearTimeout(id);
  }, []);

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilters({ cuisine: "all", topRated: false, sortBy: "recommended" });
  };

  const loc = (field) =>
    typeof field === "object" && !Array.isArray(field)
      ? field[language] || field.EN || ""
      : field || "";

  // ── FILTER + SORT ─────────────────────────────────────────
  const filtered = restaurants
    .filter((r) => {
      const sv = searchTerm.toLowerCase();
      const matchSearch =
        loc(r.title).toLowerCase().includes(sv) ||
        loc(r.location).toLowerCase().includes(sv) ||
        loc(r.description).toLowerCase().includes(sv);
      const matchCuisine = filters.cuisine === "all" || r.cuisine === filters.cuisine;
      const matchTop     = !filters.topRated || r.isTopRated;
      return matchSearch && matchCuisine && matchTop;
    })
    .sort((a, b) => {
      if (filters.sortBy === "highest-rated") return b.rating - a.rating;
      if (filters.sortBy === "most-reviewed") return b.reviews - a.reviews;
      return (b.isTopRated ? 1 : 0) - (a.isTopRated ? 1 : 0);
    });

  // ── RENDER ────────────────────────────────────────────────
  return (
    <section className="available-restaurants-section">
      <div className="container">

        {/* Header */}
        <div className="available-restaurants-header">
          <div>
            <h2>{t.title}</h2>
            <p>
              {loading ? t.loading : error ? t.error : t.found(filtered.length)}
            </p>
          </div>

          <div className="available-restaurants-actions">
            <div className="restaurants-search-input">
              <span>&#8981;</span>
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={loading}
              />
            </div>

            <select
              className="restaurants-sort-select"
              value={filters.sortBy}
              onChange={(e) => setFilters((p) => ({ ...p, sortBy: e.target.value }))}
              disabled={loading}
            >
              {t.sortOptions.map((o) => (
                <option key={o.id} value={o.id}>{o.label}</option>
              ))}
            </select>

            <button
              type="button"
              className={isFilterOpen ? "restaurants-filter-toggle active" : "restaurants-filter-toggle"}
              onClick={() => setIsFilterOpen((p) => !p)}
              disabled={loading}
            >
              <span>&#9783;</span> {t.sortLabel}
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {isFilterOpen && (
          <div className="restaurants-filter-panel">
            <div className="filter-panel-header">
              <h3>{t.filterTitle}</h3>
              <button type="button" onClick={handleClearFilters}>{t.clearAll}</button>
            </div>
            <div className="restaurants-filter-panel-content">
              {/* Cuisine */}
              <div className="filter-group">
                <h4>{t.cuisineType}</h4>
                <div className="filter-options">
                  {t.cuisineOptions.map((c) => (
                    <button key={c.id} type="button"
                      className={filters.cuisine === c.id ? "filter-chip active" : "filter-chip"}
                      onClick={() => setFilters((p) => ({ ...p, cuisine: c.id }))}>
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Top Rated */}
              <div className="filter-group">
                <h4>{t.topRatedOnly}</h4>
                <div className="filter-options">
                  <button type="button"
                    className={!filters.topRated ? "filter-chip active" : "filter-chip"}
                    onClick={() => setFilters((p) => ({ ...p, topRated: false }))}>
                    {t.all}
                  </button>
                  <button type="button"
                    className={filters.topRated ? "filter-chip active" : "filter-chip"}
                    onClick={() => setFilters((p) => ({ ...p, topRated: true }))}>
                    {t.topRated}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="row g-4">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="col-xl-4 col-lg-6"><RestaurantSkeleton /></div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="restaurants-empty-state">
            <div style={{ fontSize: 48, marginBottom: 12 }}>&#9888;&#65039;</div>
            <h3>{t.error}</h3>
            <button type="button" onClick={fetchRestaurants}>{t.retry}</button>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && filtered.length > 0 && (
          <div className="row g-4">
            {filtered.map((restaurant, index) => (
              <div key={restaurant.id} className="col-xl-4 col-lg-6">
                <RestaurantCard restaurant={restaurant} index={index} />
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && filtered.length === 0 && (
          <div className="restaurants-empty-state">
            <h3>{t.noResultsTitle}</h3>
            <p>{t.noResultsDesc}</p>
            <button type="button" onClick={handleClearFilters}>{t.resetFilters}</button>
          </div>
        )}

      </div>
    </section>
  );
};

export default AvailableRestaurants;
