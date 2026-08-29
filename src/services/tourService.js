const BASE_URL = import.meta.env.VITE_API_URL || "https://backend-digi-ivory.vercel.app/api";

// ── GET ALL tours ──────────────────────────────────────────
export const getTours = async () => {
  try {
    const response = await fetch(`${BASE_URL}/tours`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const json = await response.json();
    // الباك بيرجع { success: true, data: [...] }
    return json.data || json || [];
  } catch (error) {
    console.error("❌ getTours error:", error);
    return [];
  }
};

// ── تحويل بيانات الباك لشكل يفهمه TourCard ──────────────────
export const normalizeTour = (tour) => {
  if (!tour) return null;

  const typeMap = {
    diving: "diving", Diving: "diving",
    safari: "safari", Safari: "safari",
    yacht: "yacht", Yacht: "yacht",
    beach: "beach", Beach: "beach",
  };

  const rawService = (tour.Service || "").trim();
  const type = typeMap[rawService] || rawService.toLowerCase() || "tour";

  return {
    id: tour.id,
    title: tour.name,
    type,
    image: Array.isArray(tour.image_url) ? tour.image_url[0] : tour.image_url,
    gallery: Array.isArray(tour.image_url) ? tour.image_url : [tour.image_url],
    location: tour.location,
    description: tour.description,
    price: tour["Approx Price"] ?? tour.price ?? 0,
    rating: tour.rating || 0,
    reviews: tour.reviews_count || Math.floor((tour.rating || 0) * 30) || 0,
    duration: tour.duration || "—",
    groupSize: tour.group_size || "—",
    tags: [rawService].filter(Boolean),
    features: [],
    includedServices: [],
    isTopRated: (tour.rating || 0) >= 4.7,
    createdAt: tour.created_at,
  };
};