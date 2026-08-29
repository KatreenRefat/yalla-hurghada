// src/services/chatApi.js
const BASE_URL = import.meta.env.VITE_API_URL || "https://backend-digi-ivory.vercel.app/api";

export async function sendChatMessage(message) {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || `Error: ${res.status}`);
  return json.reply;
}