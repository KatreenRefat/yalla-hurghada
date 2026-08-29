// src/data/bookingRewardsData.js

export const TIERS = [
  { name: "Bronze",   min: 0,    max: 499      },
  { name: "Silver",   min: 500,  max: 999      },
  { name: "Gold",     min: 1000, max: 2499     },
  { name: "Platinum", min: 2500, max: Infinity },
];

export const TIER_ICONS = {
  Bronze:   "🥉",
  Silver:   "🥈",
  Gold:     "🥇",
  Platinum: "💎",
};