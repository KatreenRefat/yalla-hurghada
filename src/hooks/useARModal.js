import { useState, useCallback, useEffect, useRef } from "react";

/**
 * useARModal — Production-grade AR modal state manager.
 * Handles: lifecycle, gestures, haptics, onboarding, tracking quality,
 * hotspot selection, focus mode, and error recovery.
 */
const useARModal = () => {
  const [isOpen, setIsOpen]           = useState(false);
  const [activeTour, setActiveTour]   = useState(null);
  const [arState, setArState]         = useState("idle");
  // idle | loading | initializing | active | tracking_lost | error | exited
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [scale, setScale]             = useState(1);
  const [rotation, setRotation]       = useState(0);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [trackingQuality, setTrackingQuality] = useState("good");
  // good | limited | none
  const [errorType, setErrorType]     = useState(null);

  const loadingTimers = useRef([]);

  // ── Clear all pending timers ─────────────────────────────
  const clearTimers = useCallback(() => {
    loadingTimers.current.forEach(clearTimeout);
    loadingTimers.current = [];
  }, []);

  // ── Haptic feedback (mobile) ─────────────────────────────
  const vibrate = useCallback((pattern = [10]) => {
    if ("vibrate" in navigator) {
      try { navigator.vibrate(pattern); } catch (_) {}
    }
  }, []);

  // ── Open AR modal ────────────────────────────────────────
  const openAR = useCallback((tour) => {
    const hasSeenOnboarding = sessionStorage.getItem("ar_onboarding_seen");
    setActiveTour(tour);
    setArState("idle");
    setSelectedHotspot(null);
    setScale(1);
    setRotation(0);
    setIsFocusMode(false);
    setErrorType(null);
    setShowOnboarding(!hasSeenOnboarding);
    setIsOpen(true);
    vibrate([15]);
  }, [vibrate]);

  // ── Close AR modal ───────────────────────────────────────
  const closeAR = useCallback(() => {
    clearTimers();
    setArState("exited");
    setIsFocusMode(false);
    setSelectedHotspot(null);
    vibrate([8]);
    setTimeout(() => {
      setIsOpen(false);
      setActiveTour(null);
      setArState("idle");
      setTrackingQuality("good");
    }, 320);
  }, [clearTimers, vibrate]);

  // ── Dismiss onboarding ────────────────────────────────────
  const dismissOnboarding = useCallback(() => {
    sessionStorage.setItem("ar_onboarding_seen", "1");
    setShowOnboarding(false);
  }, []);

  // ── Start AR session ─────────────────────────────────────
  const startARSession = useCallback(() => {
    clearTimers();
    setArState("loading");
    setTrackingQuality("limited");

    const t1 = setTimeout(() => {
      setArState("initializing");
      const t2 = setTimeout(() => {
        setTrackingQuality("good");
        setArState("active");
        vibrate([10, 30, 10]);
      }, 2000);
      loadingTimers.current.push(t2);
    }, 1400);
    loadingTimers.current.push(t1);
  }, [clearTimers, vibrate]);

  // ── Simulate tracking quality fluctuation ─────────────────
  useEffect(() => {
    if (arState !== "active") return;
    const interval = setInterval(() => {
      const r = Math.random();
      setTrackingQuality(r > 0.85 ? "limited" : "good");
    }, 4000);
    return () => clearInterval(interval);
  }, [arState]);

  // ── Simulate tracking loss recovery ──────────────────────
  useEffect(() => {
    if (trackingQuality !== "limited" || arState !== "active") return;
    const t = setTimeout(() => setTrackingQuality("good"), 2500);
    return () => clearTimeout(t);
  }, [trackingQuality, arState]);

  // ── Exit active AR session back to idle ──────────────────
  const exitARSession = useCallback(() => {
    clearTimers();
    setArState("idle");
    setSelectedHotspot(null);
    setIsFocusMode(false);
    setTrackingQuality("good");
  }, [clearTimers]);

  // ── Select a hotspot ─────────────────────────────────────
  const selectHotspot = useCallback((hotspot) => {
    setSelectedHotspot(prev => prev?.id === hotspot?.id ? null : hotspot);
    vibrate([12]);
  }, [vibrate]);

  // ── Pinch scale (called from gesture handler) ────────────
  const updateScale = useCallback((newScale) => {
    setScale(Math.min(Math.max(newScale, 0.4), 2.5));
  }, []);

  // ── Rotation update ──────────────────────────────────────
  const updateRotation = useCallback((delta) => {
    setRotation(prev => (prev + delta) % 360);
  }, []);

  // ── Toggle focus mode ────────────────────────────────────
  const toggleFocusMode = useCallback(() => {
    setIsFocusMode(prev => !prev);
    vibrate([8, 8]);
  }, [vibrate]);

  // ── Reset object transform ───────────────────────────────
  const resetTransform = useCallback(() => {
    setScale(1);
    setRotation(0);
    vibrate([10]);
  }, [vibrate]);

  // ── Error recovery ────────────────────────────────────────
  const retryAR = useCallback(() => {
    setErrorType(null);
    startARSession();
  }, [startARSession]);

  // ── ESC key support ──────────────────────────────────────
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") {
        if (isFocusMode) { setIsFocusMode(false); return; }
        if (selectedHotspot) { setSelectedHotspot(null); return; }
        closeAR();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, closeAR, isFocusMode, selectedHotspot]);

  // ── Body scroll lock ─────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // ── Cleanup on unmount ────────────────────────────────────
  useEffect(() => () => { clearTimers(); }, [clearTimers]);

  return {
    isOpen, activeTour, arState,
    showOnboarding, dismissOnboarding,
    selectedHotspot, selectHotspot,
    scale, updateScale,
    rotation, updateRotation,
    isFocusMode, toggleFocusMode,
    resetTransform,
    trackingQuality,
    errorType,
    openAR, closeAR,
    startARSession, exitARSession,
    retryAR,
  };
};

export default useARModal;
