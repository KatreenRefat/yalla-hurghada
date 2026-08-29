import { useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useARStore } from "../../store/arStore";
import "./ViewerUI.css";

// ── Hotspot info panel ─────────────────────────────────────────────────────────
function HotspotPanel({ hotspot, onClose }) {
  return (
    <AnimatePresence>
      {hotspot && (
        <motion.div
          className="vui-hotspot-panel"
          initial={{ opacity: 0, x: 30, scale: 0.94 }}
          animate={{ opacity: 1, x: 0,  scale: 1 }}
          exit ={{ opacity: 0, x: 30,  scale: 0.94 }}
          transition={{ duration: 0.3, ease: [0.34, 1.4, 0.64, 1] }}
        >
          <button className="vui-panel-close" onClick={onClose} aria-label="Close">✕</button>
          <div className="vui-panel-tag">📍 Point of Interest</div>
          <h3 className="vui-panel-title">{hotspot.label}</h3>
          <p className="vui-panel-desc">{hotspot.data?.desc}</p>
          {hotspot.data?.features && (
            <div className="vui-panel-features">
              {hotspot.data.features.map(f => (
                <span key={f} className="vui-feature-tag">✓ {f}</span>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Camera controls bar ────────────────────────────────────────────────────────
function CameraControls({ onReset, onFullscreen, isFullscreen }) {
  const { autoRotate, setAutoRotate, quality, setQuality } = useARStore();

  return (
    <div className="vui-controls">
      <button className={`vui-ctrl-btn ${autoRotate ? "active" : ""}`}
              onClick={() => setAutoRotate(!autoRotate)}
              title="Auto Rotate">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M1 4v6h6M23 20v-6h-6"/>
          <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
        </svg>
      </button>
      <button className="vui-ctrl-btn" onClick={onReset} title="Reset Camera">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
          <path d="M3 3v5h5"/>
        </svg>
      </button>
      <div className="vui-quality-toggle">
        {["low", "medium", "high"].map(q => (
          <button key={q}
            className={`vui-quality-btn ${quality === q ? "active" : ""}`}
            onClick={() => setQuality(q)}
            title={`${q} quality`}>
            {q[0].toUpperCase()}
          </button>
        ))}
      </div>
      <button className="vui-ctrl-btn" onClick={onFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
        {isFullscreen ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
          </svg>
        )}
      </button>
    </div>
  );
}

// ── Scene type badge ────────────────────────────────────────────────────────────
function SceneBadge({ sceneType, tourTitle }) {
  const icons = { diving:"🤿", safari:"🏜️", yacht:"🛥️" };
  const labels = { diving:"Underwater Diving", safari:"Desert Safari", yacht:"Luxury Yacht" };
  return (
    <motion.div className="vui-scene-badge"
      initial={{ opacity:0, y:-16 }}
      animate={{ opacity:1, y:0 }}
      transition={{ delay:0.4, duration:0.5 }}>
      <span className="vui-scene-badge__icon">{icons[sceneType] || "🌍"}</span>
      <div>
        <div className="vui-scene-badge__type">{labels[sceneType] || sceneType}</div>
        <div className="vui-scene-badge__title">{tourTitle}</div>
      </div>
    </motion.div>
  );
}

// ── Interaction hint (first time) ──────────────────────────────────────────────
function InteractionHint({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div className="vui-hint"
          initial={{ opacity:0, y:10 }}
          animate={{ opacity:1, y:0 }}
          exit ={{ opacity:0, y:10 }}
          transition={{ delay:1.2, duration:0.5 }}>
          <span className="vui-hint__icon">🖱</span>
          Drag to rotate · Scroll to zoom · Click glowing points to explore
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── FPS counter (debug, only in dev) ──────────────────────────────────────────
function FPSCounter() {
  const { fps } = useARStore();
  if (import.meta.env.PROD) return null;
  return (
    <div className="vui-fps">
      {fps} FPS
    </div>
  );
}

// ── Loading overlay ────────────────────────────────────────────────────────────
function LoadingOverlay({ ready }) {
  return (
    <AnimatePresence>
      {!ready && (
        <motion.div className="vui-loading"
          initial={{ opacity:1 }}
          exit={{ opacity:0 }}
          transition={{ duration:0.6 }}>
          <div className="vui-loading__ring">
            <div className="vui-loading__ring-inner" />
            <div className="vui-loading__icon">🌊</div>
          </div>
          <p className="vui-loading__text">Building 3D Environment…</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Main ViewerUI ──────────────────────────────────────────────────────────────
export default function ViewerUI({
  sceneType,
  tourTitle,
  onReset,
  onFullscreen,
  isFullscreen,
  showHint,
}) {
  const { selectedHotspot, closeHotspot, sceneReady } = useARStore();

  return (
    <>
      <LoadingOverlay ready={sceneReady} />
      <SceneBadge sceneType={sceneType} tourTitle={tourTitle} />
      <HotspotPanel hotspot={selectedHotspot} onClose={closeHotspot} />
      <CameraControls
        onReset={onReset}
        onFullscreen={onFullscreen}
        isFullscreen={isFullscreen}
      />
      <InteractionHint visible={showHint && sceneReady} />
      <FPSCounter />
    </>
  );
}
