// src/context/BookingContext.jsx
/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState, useEffect } from "react";
import { TIERS } from "../data/bookingRewardsData";
import {
  getPackages, getTours, getHotels, getRestaurants, getTransportations,
  getExtras, validatePromo, createBooking, getUserRewards,
} from "../services/bookingApi";

const BookingContext = createContext(null);

export function useBooking() {
  return useContext(BookingContext);
}

// تطبيع بيانات الباك لشكل واحد موحّد يفهمه الفرونت
function normalizeItem(item, category) {
  return {
    id: item.id,
    type: category === "Packages" ? "package" : "single",
    category,
    name: item.name,
    subtitle: item.description || item.location || "",
    location: item.location || item.from_location || "",
    image: item.image_url || (Array.isArray(item.image_url) ? item.image_url[0] : null) ||
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
    price: parseFloat(item.price || item.price_per_night || 0),
    originalPrice: item.original_price ? parseFloat(item.original_price) : undefined,
    discount: item.discount_percent || undefined,
    days: item.duration_days || undefined,
    rating: parseFloat(item.rating || item.star_rating || 0),
    reviews: item.reviews_count || 0,
    tags: item.tags || [],
    services: item.services || [],
    description: item.description || "",
    raw: item,
  };
}

export function BookingProvider({ children }) {
  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState("Packages");

  const [packages, setPackages] = useState([]);
  const [tours, setTours] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [transport, setTransport] = useState([]);
  const [extrasOptions, setExtrasOptions] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  async function fetchAllData() {
    try {
      setDataLoading(true);
      const [pkgRes, toursRes, hotelsRes, restRes, transRes, extrasRes] = await Promise.all([
        getPackages(), getTours(), getHotels(), getRestaurants(), getTransportations(), getExtras(),
      ]);
      setPackages((pkgRes.data || []).map(p => normalizeItem(p, "Packages")));
      setTours((toursRes.data || []).map(t => normalizeItem(t, "Tours")));
      setHotels((hotelsRes.data || []).map(h => normalizeItem(h, "hotels")));
      setRestaurants((restRes.data || []).map(r => normalizeItem(r, "Restaurants")));
      setTransport((transRes.data || []).map(t => normalizeItem(t, "Transport")));
      setExtrasOptions((extrasRes.data || []).map(e => ({ id: e.id, name: e.name, desc: e.description, price: parseFloat(e.price) })));
    } catch (err) {
      setDataError(err.message);
    } finally {
      setDataLoading(false);
    }
  }

  const DATA_MAP = { Packages: packages, Tours: tours, hotels, Restaurants: restaurants, Transport: transport };

  const [cart, setCart] = useState([]);
  const [extras, setExtras] = useState([]);
  const [details, setDetails] = useState({
    firstName: "", lastName: "", email: "",
    phone: "", date: "", guests: "1 Guest", notes: "",
  });
  const [payment, setPayment] = useState({
    method: "💳 Credit Card", card: "", expiry: "", cvv: "", name: "",
  });

  const [userId] = useState(() => {
    return localStorage.getItem("yh_user_id") || null;
  });
  const [points, setPoints] = useState(0);
  const [promoCode, setPromoCode] = useState(null);
  const [promoDiscount, setPromoDiscount] = useState(0); // 0.10 = 10%
  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const id = localStorage.getItem("yh_user_id");
    if (id) {
      getUserRewards(id).then(res => {
        setPoints(res.data?.total_points || 0);
      }).catch(() => {});
    }
  }, []);

  function toggleCartItem(item) {
    setCart(prev =>
      prev.find(i => i.id === item.id)
        ? prev.filter(i => i.id !== item.id)
        : [...prev, item]
    );
  }

  function isItemInCart(id) {
    return !!cart.find(i => i.id === id);
  }

  function toggleExtra(extra) {
    setExtras(prev =>
      prev.find(i => i.id === extra.id)
        ? prev.filter(i => i.id !== extra.id)
        : [...prev, extra]
    );
  }

  function isExtraSelected(id) {
    return !!extras.find(i => i.id === id);
  }

  function updateDetails(key, value) {
    setDetails(prev => ({ ...prev, [key]: value }));
  }

  function updatePayment(key, value) {
    setPayment(prev => ({ ...prev, [key]: value }));
  }

  async function handlePromoApply(code) {
    try {
      setPromoError("");
      const res = await validatePromo(code, userId);
      setPromoCode(res.data.code);
      setPromoDiscount(res.data.discount_percent / 100);
      setPromoInput("");
    } catch (err) {
      setPromoError(err.message || "Invalid promo code.");
    }
  }

  // ✅ متوافق مع bookingsRoutes.js الفعلي في الباك:
  // بيستقبل subtotal + taxes + service_fee + promo_discount_percent + redeemed_points
  // وبيحسب هو total_price و points_earned جوه الباك
  async function handleContinue() {
    if (step === 1 && cart.length === 0) {
      alert("Please select at least one service.");
      return;
    }

    if (step === 4) {
      setLoading(true);
      setSubmitError("");
      try {
        const mainItem = cart[0];
        const subtotal = getSubtotal();

        const payload = {
          user_id: userId,
          user_email: details.email,
          first_name: details.firstName,
          last_name: details.lastName,
          phone: details.phone,
          special_requests: details.notes,
          item_type: (mainItem.category || "Packages").toLowerCase(),
          item_id: String(mainItem.id),
          date: details.date,
          guests: parseInt(details.guests) || 1,
          extras: extras.map(e => ({ id: e.id, name: e.name, price: e.price })),
          payment_method: payment.method.includes("Cash") ? "cash" : payment.method.includes("PayMob") ? "paymob" : "credit_card",
          subtotal,
          taxes: getTax(),
          service_fee: getServiceFee(),
          promo_discount_percent: promoCode ? (promoDiscount * 100) : 0,
          redeemed_points: 0,
        };

        const res = await createBooking(payload);
        setConfirmedBooking(res.data);
        if (res.data?.points_earned) {
          setPoints(prev => prev + res.data.points_earned);
        }
      } catch (err) {
        setSubmitError(err.message || "Something went wrong while creating your booking.");
        setLoading(false);
        return;
      }
      setLoading(false);
    }

    setStep(s => Math.min(s + 1, 5));
  }

  function handleBack() {
    setStep(s => s - 1);
  }

  function getSubtotal() {
    return cart.reduce((s, i) => s + i.price, 0) +
           extras.reduce((s, e) => s + e.price, 0);
  }

  function getTax() {
    return +(getSubtotal() * 0.14).toFixed(2);
  }

  function getServiceFee() {
    return cart.length > 0 ? 15 : 0;
  }

  function getDiscountAmount() {
    return +(getSubtotal() * promoDiscount).toFixed(2);
  }

  function getGrandTotal() {
    return +(getSubtotal() + getTax() + getServiceFee() - getDiscountAmount()).toFixed(2);
  }

  function getEarnedPoints() {
    return Math.floor(getGrandTotal() * 2);
  }

  function getTier() {
    return TIERS.find(t => points >= t.min && points <= t.max) || TIERS[0];
  }

  function getNextTier() {
    return TIERS.find(t => t.min > points) || null;
  }

  function getTierProgress() {
    const tier = getTier();
    const nextTier = getNextTier();
    if (!nextTier) return 100;
    return Math.min(100, ((points - tier.min) / (nextTier.min - tier.min)) * 100);
  }

  const value = {
    step, setStep,
    activeTab, setActiveTab,
    DATA_MAP,
    extrasOptions,
    dataLoading, dataError,
    cart, extras,
    details, payment,
    points,
    promoCode, promoInput, setPromoInput, promoError,
    loading,
    confirmedBooking, submitError,
    toggleCartItem, isItemInCart,
    toggleExtra, isExtraSelected,
    updateDetails, updatePayment,
    handlePromoApply,
    handleContinue, handleBack,
    getSubtotal, getTax, getServiceFee, getDiscountAmount, getGrandTotal,
    getEarnedPoints, getTier, getNextTier, getTierProgress,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
}