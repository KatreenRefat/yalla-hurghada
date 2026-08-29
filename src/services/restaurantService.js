// src/services/restaurantService.js
// ──────────────────────────────────────────────────────
// كل الـ API calls الخاصة بالمطاعم - بتكلم الـ Backend مباشرة
// ──────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL || "https://backend-digi-ivory.vercel.app/api";

// ── GET ALL RESTAURANTS ──────────────────────────────────
export const getRestaurants = async () => {
  try {
    const response = await fetch(`${BASE_URL}/restaurants`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const json = await response.json();
    return json.data || json || [];
  } catch (error) {
    console.error("getRestaurants error:", error);
    return [];
  }
};

// ── GET SINGLE RESTAURANT ────────────────────────────────
export const getRestaurantById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/restaurants/${id}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const json = await response.json();
    return json.data || json || null;
  } catch (error) {
    console.error("getRestaurantById error:", error);
    return null;
  }
};

// ── تحديد نوع المطبخ من الاسم والوصف ─────────────────────
const detectCuisine = (name = "", description = "") => {
  const text = (name + " " + description).toLowerCase();
  if (text.includes("italian") || text.includes("pizza") || text.includes("pasta")) return "Italian";
  if (text.includes("indian") || text.includes("tandoori") || text.includes("tikka")) return "Indian";
  if (text.includes("seafood") || text.includes("fish") || text.includes("shrimp")) return "Seafood";
  if (text.includes("egyptian") || text.includes("kebab") || text.includes("kofta")) return "Egyptian";
  return "International";
};

// ── تحديد رمز مستوى السعر ($ / $$ / $$$) من السعر الحقيقي ─
const detectPriceLevel = (price = 0) => {
  if (price >= 200) return "$$$";
  if (price >= 80) return "$$";
  return "$";
};

// ── تنظيف النص من الـ newlines الزيادة ───────────────────
const cleanText = (text = "") =>
  text.replace(/\n/g, " ").replace(/\s+/g, " ").trim();

// ── NORMALIZE: Supabase shape → Frontend shape ───────────
export const normalizeRestaurant = (restaurant) => {
  if (!restaurant) return null;

  const name        = cleanText(restaurant.name || "");
  const description = cleanText(restaurant.description || "");
  const cuisine     = detectCuisine(name, description);
  const price       = restaurant.price ?? 0;
  const priceLevel  = detectPriceLevel(price);

  const images = Array.isArray(restaurant.image_url)
    ? restaurant.image_url
    : restaurant.image_url ? [restaurant.image_url] : [];

  const tagsMap = {
    Italian:       ["Pizza", "Pasta", "Italian Cuisine"],
    Indian:        ["Tandoori", "Curry", "Halal Options"],
    Seafood:       ["Fresh Fish", "Grilled Seafood", "Mediterranean"],
    Egyptian:      ["Grills", "Local Cuisine", "Traditional"],
    International: ["International", "Fusion", "Mixed Cuisine"],
  };
  const tags = tagsMap[cuisine] || tagsMap["International"];

  return {
    id:          restaurant.id,
    title:       { EN: name, AR: name, RU: name },
    location:    { EN: restaurant.location, AR: restaurant.location, RU: restaurant.location },
    description: { EN: description, AR: description, RU: description },
    image:       images[0] || "",
    images,
    rating:      restaurant.rating || 0,
    reviews:     restaurant.reviews_count || Math.floor((restaurant.rating || 4) * 25),
    isTopRated:  restaurant.rating >= 4.7,
    cuisine,
    price,        // السعر الحقيقي بالدولار من الباك (مثال: 200)
    priceLevel,   // رمز توضيحي $/$$/$$$ محسوب من السعر الحقيقي
    tags:        { EN: tags, AR: tags, RU: tags },
    openHours:   restaurant.open_hours || "10:00 AM - 11:00 PM",
    createdAt:   restaurant.created_at,
  };
};