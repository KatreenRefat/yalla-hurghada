// src/data/bookingPackagesData.js

export const PACKAGES = [
  {
    id: "pkg-luxury", type: "package", category: "Packages",
    name: "Luxury Package", subtitle: "Ultimate Hurghada Experience",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
    price: 449, originalPrice: 520, discount: 14, days: 5, rating: 4.9, reviews: 97,
    tags: ["5-Star Resort", "Private Yacht", "VIP Transfer", "Fine Dining"],
    services: ["Steigenberger Al Dau Beach", "Mercedes E-Class VIP", "Luxury Yacht Trip", "+ 1 more services"],
  },
  {
    id: "pkg-family", type: "package", category: "Packages",
    name: "Family Package", subtitle: "Fun for All Ages",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80",
    price: 329, originalPrice: 279, discount: 13, days: 7, rating: 4.7, reviews: 156,
    tags: ["Kids Club", "Aqua Park", "Beach Access", "Family Meals"],
    services: ["Makadi Palace Resort", "Giftun Island Trip", "Aqua Park Access", "+ 1 more services"],
  },
  {
    id: "pkg-adventure", type: "package", category: "Packages",
    name: "Adventure Package", subtitle: "Thrills & Discovery",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80",
    price: 269, originalPrice: 310, discount: 13, days: 4, rating: 4.8, reviews: 24,
    tags: ["Desert Safari", "Scuba Diving", "4x4 Transport", "Island Trip"],
    services: ["Adventure Base Hotel", "Desert Safari", "Diving Experience", "+ 1 more services"],
  },
  {
    id: "pkg-honeymoon", type: "package", category: "Packages",
    name: "Honeymoon Package", subtitle: "Romantic Getaway",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&q=80",
    price: 579, originalPrice: 680, discount: 15, days: 6, rating: 5.0, reviews: 92,
    tags: ["Sea View Suite", "Private Yacht", "Candlelit Dinner", "SPA Access"],
    services: ["Luxury Sea View Suite", "Private Yacht Cruise", "Romantic Dinner", "+ 1 more services"],
  },
];