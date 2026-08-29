import { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import HotelCard from "../Hotelscards/HotelCard";
import "./AvailableHotels.css";
import { useLanguage } from "../../../context/useLanguage";
import { gethotels, normalizeHotel } from "../../../services/hotelService";

const content = {
  EN: {
    title: "Available hotels",
    found: (n) => `${n} hotels found in Hurghada`,
    searchPlaceholder: "Search hotels...",
    filters: "Filters",
    clearAll: "× Clear all",
    filterTitle: "Filter hotels",
    priceRange: "Price Range",
    starRating: "Star Rating",
    sortBy: "Sort By",
    nohotels: "No hotels found",
    nohotelsDesc: "Try changing your search or filter options.",
    resetFilters: "Reset filters",
    loading: "Loading hotels...",
    error: "Failed to load hotels. Please try again.",
    retry: "Retry",
    priceRanges: [
      { id: "any", label: "Any Price" },
      { id: "under-100", label: "Under $100" },
      { id: "100-200", label: "$100 - $200" },
      { id: "200-400", label: "$200 - $400" },
      { id: "400-plus", label: "$400+" },
    ],
    ratingOptions: [
      { id: "all", label: "All" },
      { id: "5", label: "★★★★★" },
      { id: "4", label: "★★★★" },
      { id: "3", label: "★★★" },
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
    title: "الفنادق المتاحة",
    found: (n) => `تم العثور على ${n} فندق في الغردقة`,
    searchPlaceholder: "ابحث عن فندق...",
    filters: "الفلاتر",
    clearAll: "× مسح الكل",
    filterTitle: "تصفية الفنادق",
    priceRange: "نطاق السعر",
    starRating: "تقييم النجوم",
    sortBy: "ترتيب حسب",
    nohotels: "لا توجد فنادق",
    nohotelsDesc: "حاول تغيير خيارات البحث أو الفلتر.",
    resetFilters: "إعادة تعيين الفلاتر",
    loading: "جاري تحميل الفنادق...",
    error: "فشل في تحميل الفنادق. حاول مرة أخرى.",
    retry: "إعادة المحاولة",
    priceRanges: [
      { id: "any", label: "أي سعر" },
      { id: "under-100", label: "أقل من $100" },
      { id: "100-200", label: "$100 - $200" },
      { id: "200-400", label: "$200 - $400" },
      { id: "400-plus", label: "$400+" },
    ],
    ratingOptions: [
      { id: "all", label: "الكل" },
      { id: "5", label: "★★★★★" },
      { id: "4", label: "★★★★" },
      { id: "3", label: "★★★" },
    ],
    sortOptions: [
      { id: "recommended", label: "موصى به" },
      { id: "price-low-high", label: "السعر: من الأقل للأعلى" },
      { id: "price-high-low", label: "السعر: من الأعلى للأقل" },
      { id: "highest-rated", label: "الأعلى تقييماً" },
      { id: "most-reviewed", label: "الأكثر مراجعات" },
    ],
  },
  RU: {
    title: "Доступные отели",
    found: (n) => `Найдено ${n} отелей в Хургаде`,
    searchPlaceholder: "Поиск отелей...",
    filters: "Фильтры",
    clearAll: "× Очистить всё",
    filterTitle: "Фильтр отелей",
    priceRange: "Ценовой диапазон",
    starRating: "Рейтинг звёзд",
    sortBy: "Сортировать по",
    nohotels: "Отели не найдены",
    nohotelsDesc: "Попробуйте изменить параметры поиска.",
    resetFilters: "Сбросить фильтры",
    loading: "Загрузка отелей...",
    error: "Не удалось загрузить отели. Попробуйте ещё раз.",
    retry: "Повторить",
    priceRanges: [
      { id: "any", label: "Любая цена" },
      { id: "under-100", label: "До $100" },
      { id: "100-200", label: "$100 - $200" },
      { id: "200-400", label: "$200 - $400" },
      { id: "400-plus", label: "$400+" },
    ],
    ratingOptions: [
      { id: "all", label: "Все" },
      { id: "5", label: "★★★★★" },
      { id: "4", label: "★★★★" },
      { id: "3", label: "★★★" },
    ],
    sortOptions: [
      { id: "recommended", label: "Рекомендуемые" },
      { id: "price-low-high", label: "Цена: по возрастанию" },
      { id: "price-high-low", label: "Цена: по убыванию" },
      { id: "highest-rated", label: "Высший рейтинг" },
      { id: "most-reviewed", label: "Больше отзывов" },
    ],
  },
};

const HotelSkeleton = () => (
  <div style={{
    background: "#fff", borderRadius: 26, overflow: "hidden",
    boxShadow: "0 12px 35px rgba(15,23,42,.08)",
  }}>
    <div style={{
      height: 230,
      background: "linear-gradient(90deg, #f0f4f8 25%, #e2e8f0 50%, #f0f4f8 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite",
    }} />
    <div style={{ padding: 20 }}>
      {[80, 60, 100, 40].map((w, i) => (
        <div key={i} style={{ height: 14, borderRadius: 6, background: "#e2e8f0", width: `${w}%`, marginBottom: 12 }} />
      ))}
    </div>
    <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
  </div>
);

const Availablehotels = () => {
  const { language } = useLanguage();
  const t = content[language] || content["EN"];

  const [hotels, sethotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: "any",
    rating: "all",
    sortBy: "recommended",
  });

  const fetchhotels = async () => {
    setLoading(true);
    setError(null);
    try {
      const raw = await gethotels();
      const normalized = raw.map(normalizeHotel);
      sethotels(normalized);
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    AOS.init();
    Promise.resolve().then(fetchhotels);
  }, []);

  // ✅ getText بتجيب النص وبتعمل trim عشان تشيل أي مسافات زيادة
  const getText = (obj) => {
    if (!obj) return "";
    if (typeof obj === "string") return obj.trim();
    return (obj[language] || obj["EN"] || "").trim();
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilters({ priceRange: "any", rating: "all", sortBy: "recommended" });
  };

  const searchValue = searchTerm.trim().toLowerCase();

  const filteredhotels = hotels
    .filter((hotel) => {
      const title = getText(hotel.title).toLowerCase();
      const location = getText(hotel.location).toLowerCase();
      const description = getText(hotel.description).toLowerCase();

      // ✅ بيفلتر من أول حرف — startsWith + includes
      const matchesSearch =
        searchValue === "" ||
        title.startsWith(searchValue) ||
        title.includes(searchValue) ||
        location.includes(searchValue) ||
        description.includes(searchValue);

      const price = hotel.price || 0;
      const matchesPrice =
        filters.priceRange === "any" ? true :
          filters.priceRange === "under-100" ? price < 100 :
            filters.priceRange === "100-200" ? price >= 100 && price <= 200 :
              filters.priceRange === "200-400" ? price > 200 && price <= 400 :
                filters.priceRange === "400-plus" ? price > 400 : true;

      const matchesRating =
        filters.rating === "all" ||
        Number(hotel.starRating) >= Number(filters.rating);

      return matchesSearch && matchesPrice && matchesRating;
    })
    .sort((a, b) => {
      if (filters.sortBy === "price-low-high") return a.price - b.price;
      if (filters.sortBy === "price-high-low") return b.price - a.price;
      if (filters.sortBy === "highest-rated") return b.rating - a.rating;
      if (filters.sortBy === "most-reviewed") return b.reviews - a.reviews;
      return (b.isTopRated ? 1 : 0) - (a.isTopRated ? 1 : 0);
    });
  console.log("searchTerm:", searchTerm, "| filtered:", filteredhotels.length);
  return (
    <section className="available-hotels-section">
      <div className="container">

        {/* Header */}
        <div className="available-hotels-header">
          <div>
            <h2>{t.title}</h2>
            <p>
              {loading ? t.loading : error ? t.error : t.found(filteredhotels.length)}
            </p>
          </div>

          <div className="available-hotels-actions">
            <div className="hotels-search-input">
              <span>⌕</span>
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => {
                  console.log("typing:", e.target.value);
                  setSearchTerm(e.target.value);
                }}
                disabled={loading}
              />
            </div>

            <select
              className="hotels-sort-select"
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
              className={isFilterOpen ? "hotels-filter-toggle active" : "hotels-filter-toggle"}
              onClick={() => setIsFilterOpen((p) => !p)}
              disabled={loading}
            >
              <span>☷</span> {t.filters}
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {isFilterOpen && (
          <div className="hotels-filter-panel">
            <div className="filter-panel-header">
              <h3>{t.filterTitle}</h3>
              <button type="button" onClick={handleClearFilters}>{t.clearAll}</button>
            </div>
            <div className="filter-panel-content">
              <div className="filter-group">
                <h4>{t.priceRange}</h4>
                <div className="filter-options">
                  {t.priceRanges.map((p) => (
                    <button key={p.id} type="button"
                      className={filters.priceRange === p.id ? "filter-chip active" : "filter-chip"}
                      onClick={() => setFilters((prev) => ({ ...prev, priceRange: p.id }))}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="filter-group">
                <h4>{t.starRating}</h4>
                <div className="filter-options">
                  {t.ratingOptions.map((r) => (
                    <button key={r.id} type="button"
                      className={filters.rating === r.id ? "filter-chip active" : "filter-chip"}
                      onClick={() => setFilters((prev) => ({ ...prev, rating: r.id }))}>
                      {r.label}
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
                      onClick={() => setFilters((prev) => ({ ...prev, sortBy: o.id }))}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="row g-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="col-xl-4 col-lg-6">
                <HotelSkeleton />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="hotels-empty-state">
            <div style={{ fontSize: 48, marginBottom: 12 }}>⚠️</div>
            <h3>{t.error}</h3>
            <button type="button" onClick={fetchhotels}>{t.retry}</button>
          </div>
        )}

        {/* hotels Grid */}
        {!loading && !error && filteredhotels.length > 0 && (
          <div className="row g-4">
            {filteredhotels.map((hotel, index) => (
              <div key={hotel.id} className="col-xl-4 col-lg-6">
                <HotelCard hotel={hotel} index={index} />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredhotels.length === 0 && (
          <div className="hotels-empty-state">
            <h3>{t.nohotels}</h3>
            <p>{t.nohotelsDesc}</p>
            <button type="button" onClick={handleClearFilters}>{t.resetFilters}</button>
          </div>
        )}

      </div>
    </section>
  );
};

export default Availablehotels;