import { useState, useEffect } from "react";
import { getTransportations, normalizeTransportation } from "../../../services/transportService";
import TransportCard from "../TransportCard/TransportCard";
import "./AvailableTransport.css";
import { useLanguage } from "../../../context/useLanguage";

const translations = {
  EN: {
    title: "Available Transport",
    found: (n) => `${n} vehicles in Hurghada`,
    searchPlaceholder: "Search transport...",
    filtersBtn: "Filters",
    filterTitle: "Filter Transport",
    clearAll: "x Clear all",
    priceRange: "Price Range",
    transportType: "Transport Type",
    sortBy: "Sort By",
    noResultsTitle: "No transport found",
    noResultsDesc: "Try changing your search or filter options.",
    resetFilters: "Reset filters",
    loading: "Loading transport...",
    error: "Failed to load transport. Please try again.",
    retry: "Retry",
    priceRanges: [
      { id: "any",       label: "Any Price" },
      { id: "under-80",  label: "Under $80" },
      { id: "80-150",    label: "$80 - $150" },
      { id: "150-plus",  label: "$150+" },
    ],
    transportTypes: [
      { id: "car",            label: "Car",         icon: "🚗" },
      { id: "bus",            label: "Bus",         icon: "🚌" },
      { id: "private-driver", label: "Private Car", icon: "🏎️" },
    ],
    sortOptions: [
      { id: "recommended",    label: "Recommended" },
      { id: "price-low-high", label: "Price: Low to High" },
      { id: "price-high-low", label: "Price: High to Low" },
      { id: "highest-rated",  label: "Highest Rated" },
    ],
  },
  AR: {
    title: "وسائل النقل المتاحة",
    found: (n) => `${n} مركبة في الغردقة`,
    searchPlaceholder: "ابحث عن وسيلة نقل...",
    filtersBtn: "الفلاتر",
    filterTitle: "تصفية النقل",
    clearAll: "x مسح الكل",
    priceRange: "نطاق السعر",
    transportType: "نوع المركبة",
    sortBy: "ترتيب حسب",
    noResultsTitle: "لا توجد وسائل نقل",
    noResultsDesc: "حاول تغيير خيارات البحث أو الفلتر.",
    resetFilters: "إعادة تعيين الفلاتر",
    loading: "جاري تحميل وسائل النقل...",
    error: "فشل في التحميل. حاول مرة أخرى.",
    retry: "إعادة المحاولة",
    priceRanges: [
      { id: "any",       label: "أي سعر" },
      { id: "under-80",  label: "أقل من $80" },
      { id: "80-150",    label: "$80 - $150" },
      { id: "150-plus",  label: "$150+" },
    ],
    transportTypes: [
      { id: "car",            label: "سيارة",       icon: "🚗" },
      { id: "bus",            label: "أتوبيس",      icon: "🚌" },
      { id: "private-driver", label: "سيارة خاصة", icon: "🏎️" },
    ],
    sortOptions: [
      { id: "recommended",    label: "الموصى به" },
      { id: "price-low-high", label: "السعر: من الأقل للأعلى" },
      { id: "price-high-low", label: "السعر: من الأعلى للأقل" },
      { id: "highest-rated",  label: "الأعلى تقييماً" },
    ],
  },
  RU: {
    title: "Доступный транспорт",
    found: (n) => `${n} транспортных средств в Хургаде`,
    searchPlaceholder: "Поиск транспорта...",
    filtersBtn: "Фильтры",
    filterTitle: "Фильтр транспорта",
    clearAll: "x Очистить всё",
    priceRange: "Диапазон цен",
    transportType: "Тип транспорта",
    sortBy: "Сортировать по",
    noResultsTitle: "Транспорт не найден",
    noResultsDesc: "Попробуйте изменить параметры поиска.",
    resetFilters: "Сбросить фильтры",
    loading: "Загрузка транспорта...",
    error: "Не удалось загрузить. Попробуйте ещё раз.",
    retry: "Повторить",
    priceRanges: [
      { id: "any",       label: "Любая цена" },
      { id: "under-80",  label: "До $80" },
      { id: "80-150",    label: "$80 - $150" },
      { id: "150-plus",  label: "$150+" },
    ],
    transportTypes: [
      { id: "car",            label: "Автомобиль",  icon: "🚗" },
      { id: "bus",            label: "Автобус",     icon: "🚌" },
      { id: "private-driver", label: "Личный авто", icon: "🏎️" },
    ],
    sortOptions: [
      { id: "recommended",    label: "Рекомендуемые" },
      { id: "price-low-high", label: "Цена: по возрастанию" },
      { id: "price-high-low", label: "Цена: по убыванию" },
      { id: "highest-rated",  label: "Высокий рейтинг" },
    ],
  },
};

const TransportSkeleton = () => (
  <div style={{
    background: "#fff", borderRadius: 20, overflow: "hidden",
    boxShadow: "0 4px 16px rgba(0,0,0,0.07)", minHeight: 460,
    border: "1px solid #e2e8f0",
  }}>
    <div style={{
      height: 220,
      background: "linear-gradient(90deg,#f0f4f8 25%,#e2e8f0 50%,#f0f4f8 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite",
    }} />
    <div style={{ padding: 20 }}>
      {[50, 80, 100, 60, 40].map((w, i) => (
        <div key={i} style={{
          height: 13, borderRadius: 6, background: "#e2e8f0",
          width: `${w}%`, marginBottom: 12,
        }} />
      ))}
    </div>
    <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>
  </div>
);

const AvailableTransport = () => {
  const { language } = useLanguage();
  const t = translations[language] || translations.EN;

  const [transports, setTransports]     = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [searchTerm, setSearchTerm]     = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters]           = useState({
    priceRange: "any",
    transportType: "",
    sortBy: "recommended",
  });

  const fetchTransports = async () => {
    setLoading(true);
    setError(null);
    try {
      const raw = await getTransportations();
      setTransports(raw.map(normalizeTransportation));
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = setTimeout(() => { fetchTransports(); }, 0);
    return () => clearTimeout(id);
  }, []);

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilters({ priceRange: "any", transportType: "", sortBy: "recommended" });
  };

  const loc = (field) =>
    typeof field === "object" && !Array.isArray(field)
      ? field[language] || field.EN || ""
      : field || "";

  // ✅ بيفلتر من أول حرف في أي كلمة
  const startsWithAnyWord = (text) =>
    text.toLowerCase().split(" ").some((word) => word.startsWith(searchTerm.toLowerCase()));

  const filtered = transports
    .filter((item) => {
      const matchSearch = !searchTerm ||
        startsWithAnyWord(loc(item.title)) ||
        startsWithAnyWord(loc(item.description)) ||
        startsWithAnyWord(item.brand || "");

      const matchType =
        !filters.transportType || item.type === filters.transportType;

      const price = item.price || 0;
      const matchPrice =
        filters.priceRange === "any"      ? true :
        filters.priceRange === "under-80" ? price < 80 :
        filters.priceRange === "80-150"   ? price >= 80 && price <= 150 :
        filters.priceRange === "150-plus" ? price > 150 : true;

      return matchSearch && matchType && matchPrice;
    })
    .sort((a, b) => {
      if (filters.sortBy === "price-low-high") return a.price - b.price;
      if (filters.sortBy === "price-high-low") return b.price - a.price;
      if (filters.sortBy === "highest-rated")  return b.rating - a.rating;
      return (b.isTopRated ? 1 : 0) - (a.isTopRated ? 1 : 0);
    });

  return (
    <section className="available-transport-section">
      <div className="container">

        <div className="available-transport-header">
          <div>
            <h2>{t.title}</h2>
            <p>{loading ? t.loading : error ? t.error : t.found(filtered.length)}</p>
          </div>

          <div className="available-transport-actions">
            <div className="transport-search-input">
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
              className="transport-sort-select"
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
              className={isFilterOpen ? "transport-filter-toggle active" : "transport-filter-toggle"}
              onClick={() => setIsFilterOpen((p) => !p)}
              disabled={loading}
            >
              <span>&#9783;</span> {t.filtersBtn}
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
                <h4>{t.transportType}</h4>
                <div className="filter-options">
                  {t.transportTypes.map((type) => (
                    <button key={type.id} type="button"
                      className={filters.transportType === type.id ? "filter-chip active" : "filter-chip"}
                      onClick={() => setFilters((prev) => ({
                        ...prev,
                        transportType: prev.transportType === type.id ? "" : type.id,
                      }))}>
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
                      onClick={() => setFilters((prev) => ({ ...prev, sortBy: o.id }))}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="row g-4">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="col-xl-4 col-lg-6"><TransportSkeleton /></div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="transport-empty-state">
            <div style={{ fontSize: 48, marginBottom: 12 }}>&#9888;&#65039;</div>
            <h3>{t.error}</h3>
            <button type="button" onClick={fetchTransports}>{t.retry}</button>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="row g-4">
            {filtered.map((transport, index) => (
              <div key={transport.id} className="col-xl-4 col-lg-6">
                <TransportCard transport={transport} index={index} />
              </div>
            ))}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="transport-empty-state">
            <h3>{t.noResultsTitle}</h3>
            <p>{t.noResultsDesc}</p>
            <button type="button" onClick={handleClearFilters}>{t.resetFilters}</button>
          </div>
        )}

      </div>
    </section>
  );
};

export default AvailableTransport;