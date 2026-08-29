// src/services/bookingApi.js
const BASE_URL = import.meta.env.VITE_API_URL || "https://backend-digi-ivory.vercel.app/api";

async function request(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  const json = await res.json();
  if (!res.ok) {
    console.error("API ERROR on", endpoint, "→", json); // 👈 يطبع رسالة الباك كاملة
    throw new Error(json.message || `Error: ${res.status}`);
  }
  return json;
}

export const getPackages       = () => request("/packages");
export const getTours          = () => request("/tours");
export const getHotels         = () => request("/hotels");
export const getRestaurants    = () => request("/restaurants");
export const getTransportations= () => request("/transportations");
export const getExtras         = () => request("/extras");
export const getActivePromos   = () => request("/promo");
export const validatePromo     = (code, user_id) => request("/promo/validate", { method: "POST", body: JSON.stringify({ code, user_id }) });
export const createBooking     = (data) => request("/bookings", { method: "POST", body: JSON.stringify(data) });
export const getUserRewards    = (user_id) => request(`/rewards/${user_id}`);