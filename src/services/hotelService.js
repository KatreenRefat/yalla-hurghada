const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ── GET ALL hotels ────────────────────────────────────────────
export const gethotels = async () => {
  try {
    const response = await fetch(`${BASE_URL}/hotels`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const json = await response.json();
    // الباك بيرجع { success: true, data: [...] }
    return json.data || json || [];
  } catch (error) {
    console.error("❌ gethotels error:", error);
    return [];
  }
};

// ── GET SINGLE HOTEL ──────────────────────────────────────────
export const getHotelById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/hotels/${id}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const json = await response.json();
    return json.data || json || null;
  } catch (error) {
    console.error("❌ getHotelById error:", error);
    return null;
  }
};

// ── NORMALIZE: Supabase → Frontend shape ─────────────────────
// بيحول شكل البيانات من Supabase لشكل بيفهمه الـ frontend
export const normalizeHotel = (hotel) => {
  if (!hotel) return null;

  // حساب عدد النجوم من الـ rating
  const starRating = hotel.rating >= 4.8 ? 5
    : hotel.rating >= 4.3 ? 4
    : hotel.rating >= 3.5 ? 3
    : 2;

  return {
    id:          hotel.id,
    // بيدعم إن الـ title يكون string مباشر أو object { EN, AR, RU }
    title:       typeof hotel.name === "object" ? hotel.name : { EN: hotel.name, AR: hotel.name, RU: hotel.name },
    location:    typeof hotel.location === "object" ? hotel.location : { EN: hotel.location, AR: hotel.location, RU: hotel.location },
    description: typeof hotel.description === "object" ? hotel.description : { EN: hotel.description, AR: hotel.description, RU: hotel.description },
    // أول صورة للكارد، كل الصور للمودال
    image:       Array.isArray(hotel.image_url) ? hotel.image_url[0] : hotel.image_url,
    images:      Array.isArray(hotel.image_url) ? hotel.image_url : [hotel.image_url],
    price:       hotel.price_per_night,
    rating:      hotel.rating || 0,
    starRating,
    reviews:     hotel.reviews_count || Math.floor(hotel.rating * 30) || 0,
    isTopRated:  hotel.rating >= 4.7,
    tags:        hotel.tags || [],
    createdAt:   hotel.created_at,
  };
};