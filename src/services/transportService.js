// src/services/transportService.js
// ─────────────────────────────────────────────────────────────
// كل الـ API calls الخاصة بالمواصلات
// ─────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ── GET ALL TRANSPORTATIONS ───────────────────────────────────
export const getTransportations = async () => {
  try {
    const response = await fetch(`${BASE_URL}/transportations`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const json = await response.json();
    return json.data || json || [];
  } catch (error) {
    console.error("getTransportations error:", error);
    return [];
  }
};

// ── GET SINGLE TRANSPORTATION ─────────────────────────────────
export const getTransportationById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/transportations/${id}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const json = await response.json();
    return json.data || json || null;
  } catch (error) {
    console.error("getTransportationById error:", error);
    return null;
  }
};

// ── تحديد نوع المركبة وتطبيعه ────────────────────────────────
// الـ type في Supabase فيه spaces زيادة زي "Private car  "
const normalizeType = (type = "") => {
  const t = type.trim().toLowerCase();
  if (t === "bus") return "bus";
  if (t.includes("private")) return "private-driver";
  if (t === "cars" || t === "car") return "car";
  return "car";
};

// ── تحويل الـ Included Services string لـ array ───────────────
const parseServices = (servicesStr = "") =>
  servicesStr
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

// ── تاجات بناءً على النوع ─────────────────────────────────────
const getTagsByType = (type) => {
  if (type === "bus") return ["Group Travel", "AC", "Professional Driver"];
  if (type === "private-driver") return ["Private", "VIP", "Door to Door"];
  return ["AC", "Comfortable", "Reliable"];
};

// ── NORMALIZE: Supabase → Frontend shape ─────────────────────
export const normalizeTransportation = (item) => {
  if (!item) return null;

  const type = normalizeType(item.type);
  const images = Array.isArray(item.image_url)
    ? item.image_url
    : item.image_url ? [item.image_url] : [];

  const includedServices = parseServices(item["Included Services"] || item.included_services || "");
  const tags = getTagsByType(type);
  const rating = item.Review || item.review || item.rating || 0;

  return {
    id:               item.id,
    // title يدعم string مباشر أو object { EN, AR, RU }
    title:            { EN: item.name?.trim() || "", AR: item.name?.trim() || "", RU: item.name?.trim() || "" },
    description:      { EN: item.description || "", AR: item.description || "", RU: item.description || "" },
    location:         { EN: "Hurghada, Egypt", AR: "الغردقة، مصر", RU: "Хургада, Египет" },
    type,
    brand:            item.Brand || item.brand || null,
    price:            item.price || 0,
    availableSeats:   item.available_seats || 0,
    passengers:       `${item.available_seats || 0} Seats`,
    bags:             type === "bus" ? "Large Luggage" : "2 Bags",
    image:            images[0] || "",
    images,
    gallery:          images,
    rating:           rating,
    reviews:          Math.floor(rating * 20),
    isTopRated:       rating >= 4.8,
    tags:             { EN: tags, AR: tags, RU: tags },
    includedServices,
    features:         includedServices.slice(0, 3),
    createdAt:        item.created_at,
  };
};