import { create } from "zustand";

/**
 * Global AR / 3D experience store — Zustand
 * Manages scene state, camera, hotspots, quality settings
 */
export const useARStore = create((set, get) => ({
  // ── Scene ────────────────────────────────────────────────
  activeTour: null,
  sceneReady: false,
  activeScene: null, // "diving" | "safari" | "yacht"

  // ── Camera ───────────────────────────────────────────────
  cameraMode: "orbit",   // orbit | cinematic | focus
  cameraTarget: [0, 0, 0],
  focusTarget: null,

  // ── Hotspots ─────────────────────────────────────────────
  selectedHotspot: null,
  hotspotPanelOpen: false,

  // ── Quality ──────────────────────────────────────────────
  quality: "high",       // low | medium | high
  fps: 60,
  isMobile: false,

  // ── XR / AR ──────────────────────────────────────────────
  xrSupported: false,
  xrActive: false,

  // ── UI ───────────────────────────────────────────────────
  guideVisible: true,
  autoRotate: true,
  isFullscreen: false,

  // ── Actions ──────────────────────────────────────────────
  setActiveTour:    (tour) => set({ activeTour: tour, sceneReady: false }),
  setSceneReady:    (v)    => set({ sceneReady: v }),
  setActiveScene:   (s)    => set({ activeScene: s }),
  setCameraMode:    (m)    => set({ cameraMode: m }),
  setCameraTarget:  (t)    => set({ cameraTarget: t }),
  setFocusTarget:   (t)    => set({ focusTarget: t, cameraMode: t ? "focus" : "orbit" }),
  selectHotspot:    (h)    => set({ selectedHotspot: h, hotspotPanelOpen: !!h }),
  closeHotspot:     ()     => set({ selectedHotspot: null, hotspotPanelOpen: false }),
  setQuality:       (q)    => set({ quality: q }),
  setFPS:           (f)    => set({ fps: f }),
  setIsMobile:      (v)    => set({ isMobile: v, quality: v ? "medium" : "high" }),
  setXRSupported:   (v)    => set({ xrSupported: v }),
  setXRActive:      (v)    => set({ xrActive: v }),
  setGuideVisible:  (v)    => set({ guideVisible: v }),
  setAutoRotate:    (v)    => set({ autoRotate: v }),
  setFullscreen:    (v)    => set({ isFullscreen: v }),
  resetCamera:      ()     => set({ cameraMode: "orbit", focusTarget: null, autoRotate: true }),
}));
