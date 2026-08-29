// src/data/bookingRestaurantsData.js

export const RESTAURANTS = [
  {
    id: "rest-saffron", type: "single", category: "Restaurants",
    name: "Saffron Lebanese Kitchen", location: "Hurghada Downtown",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&q=80",
    price: 28, rating: 4.8, reviews: 203,
    tags: ["Lebanese", "Mezze", "Halal"],
    description: "Authentic Lebanese cuisine with fresh mezze and grills.",
  },
  {
    id: "rest-finedining", type: "single", category: "Restaurants",
    name: "Fine Dining Experience", location: "Steigenberger Resort",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
    price: 75, rating: 5.0, reviews: 88,
    tags: ["International", "Sea View", "Wine"],
    description: "Exquisite gourmet dining with panoramic Red Sea views.",
  },
  {
    id: "rest-seafood", type: "single", category: "Restaurants",
    name: "Red Sea Seafood", location: "Hurghada Port",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400&q=80",
    price: 40, rating: 4.7, reviews: 417,
    tags: ["Seafood", "Fresh Daily", "Outdoor"],
    description: "Daily fresh catch cooked your way, right by the water.",
  },
];