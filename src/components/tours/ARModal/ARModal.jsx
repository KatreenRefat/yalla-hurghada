import { useCallback, useMemo, useRef, useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import "./ARModal.css";

// ─── Tour-type scene configuration ───────────────────────────────────────────
const SCENE_CONFIG = {
  diving: {
    label: "Underwater Coral Reef",
    icon: "🤿",
    gradientClass: "ar-scene--diving",
    particles: ["🐠", "🐟", "🦈", "🐙", "🪸", "🐡", "🦑"],
    ambientLabel: "Red Sea · Coral Zone",
    waveColor: "rgba(0,150,199,0.3)",
    accentColor: "#00b4d8",
    hotspots: [
      { id: "h1", label: "Coral Garden", icon: "🪸", desc: "Vibrant coral formations teeming with marine life. Home to 200+ species.", x: 22, y: 38 },
      { id: "h2", label: "Reef Wall",    icon: "🐟", desc: "Dramatic underwater cliff dropping 40m. Schools of tropical fish abound.", x: 68, y: 55 },
      { id: "h3", label: "Sea Turtle",   icon: "🐢", desc: "Nesting ground for endangered green sea turtles. Best seen at dawn.", x: 45, y: 72 },
    ],
  },
  safari: {
    label: "Desert Dune Safari",
    icon: "🏜️",
    gradientClass: "ar-scene--safari",
    particles: ["🦂", "🌵", "🐪", "🦅", "⭐", "🌙", "🏺"],
    ambientLabel: "Sinai Desert · Golden Hour",
    waveColor: "rgba(192,124,43,0.25)",
    accentColor: "#e9c46a",
    hotspots: [
      { id: "h1", label: "Bedouin Camp",  icon: "🏕️", desc: "Traditional Bedouin settlement. Experience authentic desert hospitality.", x: 25, y: 60 },
      { id: "h2", label: "Dune Peak",     icon: "🏔️", desc: "180° panoramic view of the desert at sunset. Perfect for photography.", x: 65, y: 35 },
      { id: "h3", label: "Oasis Spring",  icon: "💧", desc: "Natural freshwater spring hidden between dunes. Ancient caravan stop.", x: 50, y: 70 },
    ],
  },
  yacht: {
    label: "Luxury Yacht Cruise",
    icon: "🛥️",
    gradientClass: "ar-scene--yacht",
    particles: ["🌊", "🐬", "⛵", "🦞", "🐚", "🦀", "🌅"],
    ambientLabel: "Red Sea · Open Water",
    waveColor: "rgba(0,119,182,0.3)",
    accentColor: "#90e0ef",
    hotspots: [
      { id: "h1", label: "Sun Deck",     icon: "☀️",  desc: "Panoramic upper deck with 360° sea views. Includes open bar & sunbeds.", x: 30, y: 40 },
      { id: "h2", label: "Snorkel Spot", icon: "🤿",  desc: "Protected bay with crystal clear waters. Visibility up to 20m.", x: 65, y: 62 },
      { id: "h3", label: "Dolphin Cove", icon: "🐬",  desc: "Regular dolphin pod sightings. Morning cruises have 80% encounter rate.", x: 48, y: 28 },
    ],
  },
  default: {
    label: "Scenic Tour",
    icon: "🌍",
    gradientClass: "ar-scene--default",
    particles: ["🌟", "✨", "🌈", "🌺", "🦋", "🌸", "🍃"],
    ambientLabel: "Scenic Area",
    waveColor: "rgba(90,90,220,0.2)",
    accentColor: "#8080dd",
    hotspots: [
      { id: "h1", label: "Viewpoint",   icon: "🔭", desc: "Panoramic observation point with stunning views.", x: 30, y: 45 },
      { id: "h2", label: "Local Spot",  icon: "📍", desc: "Authentic local landmark known to insiders.", x: 65, y: 58 },
      { id: "h3", label: "Photo Point", icon: "📸", desc: "Best angle for capturing the scenery.", x: 50, y: 30 },
    ],
  },
};

// ─── Star rating ──────────────────────────────────────────────────────────────
const StarRating = ({ rating }) => {
  const stars = useMemo(() => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return Array.from({ length: 5 }, (_, i) =>
      i < full ? "full" : i === full && half ? "half" : "empty"
    );
  }, [rating]);
  return (
    <div className="ar-stars" aria-label={`Rating: ${rating} out of 5`}>
      {stars.map((t, i) => (
        <span key={i} className={`ar-star ar-star--${t}`} aria-hidden="true">
          {t === "empty" ? "☆" : "★"}
        </span>
      ))}
      <span className="ar-stars-value">{rating}</span>
    </div>
  );
};

// ─── Floating particles ───────────────────────────────────────────────────────
const SceneParticles = ({ particles, density = 1 }) => (
  <div className="ar-scene-particles" aria-hidden="true">
    {particles.map((emoji, i) => (
      <span
        key={i}
        className="ar-particle"
        style={{
          "--delay": `${(i * 0.65) % 4}s`,
          "--x": `${8 + (i * 17) % 84}%`,
          "--size": `${14 + (i % 4) * 6}px`,
          "--duration": `${4.5 + (i % 3)}s`,
          "--drift": `${(i % 2 === 0 ? 1 : -1) * (8 + i * 3)}px`,
        }}
      >
        {emoji}
      </span>
    ))}
  </div>
);

// ─── Canvas wave animation ────────────────────────────────────────────────────
const WaveCanvas = ({ color }) => {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf, t = 0;
    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        const amp = 8 - layer * 2;
        const freq = 0.018 + layer * 0.006;
        const speed = 0.02 + layer * 0.008;
        const yBase = H * (0.5 + layer * 0.15);
        ctx.moveTo(0, yBase);
        for (let x = 0; x <= W; x += 2) {
          const y = yBase + Math.sin(x * freq + t * speed + layer * 2) * amp
            + Math.sin(x * freq * 1.7 + t * speed * 0.8) * (amp * 0.4);
          ctx.lineTo(x, y);
        }
        ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
        ctx.fillStyle = color.replace(")", `, ${0.18 - layer * 0.04})`).replace("rgba", "rgba");
        ctx.fill();
      }
      t++;
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [color]);
  return <canvas ref={canvasRef} className="ar-wave-canvas" aria-hidden="true" />;
};

// ─── Tracking quality indicator ───────────────────────────────────────────────
const TrackingIndicator = ({ quality }) => {
  const map = { good: { label: "Tracking Stable", color: "#4ade80", bars: 3 },
                limited: { label: "Limited Tracking", color: "#fbbf24", bars: 1 },
                none: { label: "Tracking Lost", color: "#f87171", bars: 0 } };
  const info = map[quality] || map.good;
  return (
    <div className="ar-tracking-indicator" aria-live="polite">
      <div className="ar-tracking-bars">
        {[0,1,2].map(i => (
          <div key={i} className={`ar-tracking-bar ${i < info.bars ? "ar-tracking-bar--active" : ""}`}
               style={{ "--bar-color": info.color }} />
        ))}
      </div>
      <span className="ar-tracking-label" style={{ color: info.color }}>{info.label}</span>
    </div>
  );
};

// ─── Onboarding overlay ───────────────────────────────────────────────────────
const AROnboarding = ({ onDismiss, sceneConfig }) => {
  const steps = [
    { icon: "👆", title: "Tap Hotspots", desc: "Tap the glowing points to discover tour highlights" },
    { icon: "🤏", title: "Pinch to Scale", desc: "Pinch gesture to resize the AR scene" },
    { icon: "🔄", title: "Drag to Rotate", desc: "Swipe to rotate and explore 360°" },
    { icon: "🔍", title: "Focus Mode", desc: "Double-tap to enter immersive focus view" },
  ];
  const [step, setStep] = useState(0);
  return (
    <div className="ar-onboarding" role="dialog" aria-label="AR Guide">
      <div className="ar-onboarding-card">
        <div className="ar-onboarding-badge">
          <span className="ar-badge-dot" />
          AR GUIDE
        </div>
        <div className="ar-onboarding-icon">{steps[step].icon}</div>
        <h3 className="ar-onboarding-title">{steps[step].title}</h3>
        <p className="ar-onboarding-desc">{steps[step].desc}</p>
        <div className="ar-onboarding-dots">
          {steps.map((_, i) => (
            <button key={i} className={`ar-onboarding-dot ${i === step ? "active" : ""}`}
                    onClick={() => setStep(i)} aria-label={`Step ${i+1}`} />
          ))}
        </div>
        <div className="ar-onboarding-actions">
          {step < steps.length - 1 ? (
            <button className="ar-btn ar-btn--primary ar-btn--sm" onClick={() => setStep(s => s + 1)}>
              Next →
            </button>
          ) : (
            <button className="ar-btn ar-btn--primary ar-btn--sm" onClick={onDismiss}>
              Start Exploring 🚀
            </button>
          )}
          <button className="ar-btn ar-btn--ghost ar-btn--sm" onClick={onDismiss}>Skip</button>
        </div>
      </div>
    </div>
  );
};

// ─── AR Loader ────────────────────────────────────────────────────────────────
const ARLoader = ({ state }) => {
  const msgs = { loading: "Loading AR Environment…", initializing: "Calibrating AR Session…" };
  const pct  = { loading: 40, initializing: 85 };
  return (
    <div className="ar-loader-overlay">
      <div className="ar-loader-content">
        <div className="ar-loader-ring">
          <div className="ar-loader-ring__track" />
          <div className="ar-loader-ring__inner" />
          <div className="ar-loader-ring__pulse" />
          <div className="ar-loader-ring__core" aria-hidden="true">🥽</div>
        </div>
        <p className="ar-loader-text">{msgs[state]}</p>
        <div className="ar-loader-bar">
          <div className="ar-loader-bar__fill"
               style={{ "--target-pct": `${pct[state] || 40}%` }} />
        </div>
        <div className="ar-loader-steps">
          <span className={state === "loading" ? "ar-loader-step--active" : "ar-loader-step--done"}>
            {state === "loading" ? "⚙" : "✓"} Environment
          </span>
          <span className={state === "initializing" ? "ar-loader-step--active" : state === "active" ? "ar-loader-step--done" : ""}>
            {state === "initializing" ? "⚙" : "○"} Calibrating
          </span>
          <span>○ Ready</span>
        </div>
      </div>
    </div>
  );
};

// ─── Hotspot component ────────────────────────────────────────────────────────
const Hotspot = ({ hotspot, isSelected, onClick, accentColor }) => (
  <button
    className={`ar-hotspot ${isSelected ? "ar-hotspot--selected" : ""}`}
    style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%`, "--accent": accentColor }}
    onClick={() => onClick(hotspot)}
    aria-label={hotspot.label}
    aria-expanded={isSelected}
  >
    <span className="ar-hotspot__ring" />
    <span className="ar-hotspot__dot">{hotspot.icon}</span>
    {isSelected && (
      <div className="ar-hotspot__popup" role="tooltip">
        <div className="ar-hotspot__popup-title">{hotspot.label}</div>
        <div className="ar-hotspot__popup-desc">{hotspot.desc}</div>
      </div>
    )}
  </button>
);

// ─── Active AR Experience ─────────────────────────────────────────────────────
const ARActiveExperience = ({
  tour, sceneConfig, onExit,
  selectedHotspot, onSelectHotspot,
  scale, rotation, isFocusMode, onToggleFocus, onResetTransform,
  trackingQuality, showOnboarding, onDismissOnboarding,
}) => {
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localRotation, setLocalRotation] = useState(rotation);
  const dragStart = useRef(null);
  const pinchStart = useRef(null);
  const [localScale, setLocalScale] = useState(scale);

  // Sync from parent
  useEffect(() => { setLocalRotation(rotation); }, [rotation]);
  useEffect(() => { setLocalScale(scale); }, [scale]);

  // ── Parallax on mouse / touch ─────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = e.touches ? e.touches[0].clientX : e.clientX;
      const cy = e.touches ? e.touches[0].clientY : e.clientY;
      const x = ((cx - rect.left) / rect.width - 0.5) * 28;
      const y = ((cy - rect.top) / rect.height - 0.5) * 20;
      el.style.setProperty("--px", `${x}px`);
      el.style.setProperty("--py", `${y}px`);
    };
    el.addEventListener("mousemove", handleMove);
    el.addEventListener("touchmove", handleMove, { passive: true });
    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("touchmove", handleMove);
    };
  }, []);

  // ── Touch gestures: pinch + rotate ───────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onTouchStart = (e) => {
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        pinchStart.current = { dist: Math.hypot(dx, dy), scale: localScale };
      } else if (e.touches.length === 1) {
        dragStart.current = { x: e.touches[0].clientX, rot: localRotation };
      }
    };
    const onTouchMove = (e) => {
      if (e.touches.length === 2 && pinchStart.current) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const ratio = dist / pinchStart.current.dist;
        const ns = Math.min(Math.max(pinchStart.current.scale * ratio, 0.4), 2.5);
        setLocalScale(ns);
      } else if (e.touches.length === 1 && dragStart.current) {
        const delta = (e.touches[0].clientX - dragStart.current.x) * 0.5;
        setLocalRotation((dragStart.current.rot + delta) % 360);
      }
    };
    const onTouchEnd = () => { pinchStart.current = null; dragStart.current = null; };
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd);
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [localScale, localRotation]);

  // ── Mouse drag for desktop rotation ──────────────────────
  const onMouseDown = useCallback((e) => {
    dragStart.current = { x: e.clientX, rot: localRotation };
    setIsDragging(true);
  }, [localRotation]);
  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => {
      if (!dragStart.current) return;
      const delta = (e.clientX - dragStart.current.x) * 0.4;
      setLocalRotation((dragStart.current.rot + delta) % 360);
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [isDragging]);

  // ── Double tap for focus mode ─────────────────────────────
  const lastTap = useRef(0);
  const onContainerTap = useCallback((e) => {
    if (e.target.closest(".ar-hotspot") || e.target.closest(".ar-hud")) return;
    const now = Date.now();
    if (now - lastTap.current < 300) { onToggleFocus(); }
    lastTap.current = now;
  }, [onToggleFocus]);

  return (
    <div
      className={`ar-active-experience ${isFocusMode ? "ar-active-experience--focus" : ""} ${isDragging ? "ar-active-experience--dragging" : ""}`}
      ref={containerRef}
      onMouseDown={onMouseDown}
      onClick={onContainerTap}
    >
      {/* ── Environment layers (parallax) ───────────────── */}
      <div className={`ar-env-layer ar-env-layer--sky ${sceneConfig.gradientClass}`} />
      <div className="ar-env-layer ar-env-layer--mid" />
      <WaveCanvas color={sceneConfig.waveColor} />
      <div className="ar-env-layer ar-env-layer--ground" />

      {/* ── Particles ───────────────────────────────────── */}
      <SceneParticles particles={sceneConfig.particles} />

      {/* ── Scan lines ──────────────────────────────────── */}
      <div className="ar-scan-lines" aria-hidden="true" />

      {/* ── Virtual object in scene ──────────────────────── */}
      <div
        className="ar-virtual-object"
        style={{
          transform: `scale(${localScale}) rotate(${localRotation}deg)`,
          transition: isDragging ? "none" : "transform 0.2s ease",
        }}
      >
        <div className="ar-object-shadow" />
        <div className="ar-object-body">
          <span className="ar-object-icon">{sceneConfig.icon}</span>
        </div>
        <div className={`ar-object-ring ${trackingQuality === "limited" ? "ar-object-ring--limited" : ""}`} />
      </div>

      {/* ── Hotspots ─────────────────────────────────────── */}
      {!isFocusMode && sceneConfig.hotspots.map(h => (
        <Hotspot key={h.id} hotspot={h} isSelected={selectedHotspot?.id === h.id}
                 onClick={onSelectHotspot} accentColor={sceneConfig.accentColor} />
      ))}

      {/* ── HUD ──────────────────────────────────────────── */}
      <div className="ar-hud" aria-hidden="true">
        <div className="ar-hud-corner ar-hud-corner--tl" />
        <div className="ar-hud-corner ar-hud-corner--tr" />
        <div className="ar-hud-corner ar-hud-corner--bl" />
        <div className="ar-hud-corner ar-hud-corner--br" />
      </div>

      {/* ── Top HUD bar ──────────────────────────────────── */}
      <div className="ar-hud-top">
        <span className="ar-hud-badge">
          <span className="ar-hud-badge__dot" />
          AR LIVE
        </span>
        <TrackingIndicator quality={trackingQuality} />
        <span className="ar-hud-env">{sceneConfig.icon} {sceneConfig.ambientLabel}</span>
      </div>

      {/* ── Tour info card ────────────────────────────────── */}
      {!isFocusMode && (
        <div className="ar-in-scene-card">
          <h4 className="ar-in-scene-card__title">{tour.title}</h4>
          <p className="ar-in-scene-card__location">📍 {tour.location}</p>
          <StarRating rating={tour.rating} />
          <div className="ar-in-scene-card__price">
            <span>From</span><strong>${tour.price}</strong><small>/person</small>
          </div>
        </div>
      )}

      {/* ── Control bar ──────────────────────────────────── */}
      <div className="ar-controls">
        <button className="ar-ctrl-btn" onClick={onResetTransform} title="Reset view" aria-label="Reset transform">
          ⟲
        </button>
        <button className={`ar-ctrl-btn ${isFocusMode ? "ar-ctrl-btn--active" : ""}`}
                onClick={onToggleFocus} title="Focus mode" aria-label="Toggle focus mode">
          {isFocusMode ? "⊙" : "◎"}
        </button>
        <button className="ar-ctrl-btn ar-ctrl-btn--exit" onClick={onExit} aria-label="Exit AR">
          ✕
        </button>
      </div>

      {/* ── Scale display (shows when not 1x) ────────────── */}
      {Math.abs(localScale - 1) > 0.05 && (
        <div className="ar-scale-indicator" aria-live="polite">
          {localScale.toFixed(1)}×
        </div>
      )}

      {/* ── Tracking lost overlay ─────────────────────────── */}
      {trackingQuality === "none" && (
        <div className="ar-tracking-lost">
          <div className="ar-tracking-lost__icon">📡</div>
          <p>Tracking Lost</p>
          <span>Move device slowly to restore</span>
        </div>
      )}

      {/* ── Onboarding ────────────────────────────────────── */}
      {showOnboarding && (
        <AROnboarding onDismiss={onDismissOnboarding} sceneConfig={sceneConfig} />
      )}
    </div>
  );
};

// ─── Main ARModal ─────────────────────────────────────────────────────────────
const ARModal = ({
  tour, isOpen, arState,
  onClose, onStart, onExit,
  showOnboarding, onDismissOnboarding,
  selectedHotspot, onSelectHotspot,
  scale, onUpdateScale,
  rotation, onUpdateRotation,
  isFocusMode, onToggleFocus,
  onResetTransform,
  trackingQuality,
}) => {
  const sceneConfig = SCENE_CONFIG[tour?.type] || SCENE_CONFIG.default;
  const isLoading = arState === "loading" || arState === "initializing";
  const isActive  = arState === "active";

  const handleOverlay = useCallback((e) => {
    if (e.target === e.currentTarget) onClose();
  }, [onClose]);

  if (!isOpen || !tour) return null;

  return (
    <div
      className={`ar-modal-overlay ar-modal-overlay--${arState}`}
      onClick={handleOverlay}
      role="dialog"
      aria-modal="true"
      aria-label={`AR Preview: ${tour.title}`}
    >
      <div className={`ar-modal ${sceneConfig.gradientClass} ${isActive ? "ar-modal--fullscreen" : ""}`}>

        {/* ── Close ─────────────────────────────────────────── */}
        <button className="ar-modal-close" onClick={onClose} aria-label="Close AR Modal">
          <AiOutlineClose size={20} />
        </button>

        {/* ── Header (hidden in active fullscreen) ──────────── */}
        {!isActive && (
          <div className="ar-modal-header">
            <div className="ar-modal-header__badge">
              <span className="ar-badge-dot" />
              Augmented Reality Experience
            </div>
            <h2 className="ar-modal-title">{tour.title}</h2>
            <div className="ar-modal-meta">
              <span className="ar-modal-location">
                📍 {tour.location.charAt(0).toUpperCase() + tour.location.slice(1)}
              </span>
              <span className="ar-modal-price">
                From <strong>${tour.price}</strong>/person
              </span>
            </div>
            <StarRating rating={tour.rating} />
          </div>
        )}

        {/* ── Preview container ──────────────────────────────── */}
        <div className={`ar-preview-container ${isActive ? "ar-preview-container--expanded" : ""}`}>
          {arState === "idle" && (
            <div className="ar-preview-idle">
              <div className={`ar-preview-scene ${sceneConfig.gradientClass}`}>
                <SceneParticles particles={sceneConfig.particles} />
                <WaveCanvas color={sceneConfig.waveColor} />
                <div className="ar-preview-scene__label">
                  <span className="ar-preview-scene__icon">{sceneConfig.icon}</span>
                  <span>{sceneConfig.label}</span>
                </div>
                <div className="ar-scan-lines" />
                {/* Preview hotspot hints */}
                <div className="ar-preview-hints" aria-hidden="true">
                  {sceneConfig.hotspots.slice(0,2).map(h => (
                    <div key={h.id} className="ar-preview-hint"
                         style={{ left: `${h.x}%`, top: `${h.y}%` }}>
                      <span>{h.icon}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {isLoading && <ARLoader state={arState} />}

          {isActive && (
            <ARActiveExperience
              tour={tour}
              sceneConfig={sceneConfig}
              onExit={onExit}
              selectedHotspot={selectedHotspot}
              onSelectHotspot={onSelectHotspot}
              scale={scale}
              rotation={rotation}
              isFocusMode={isFocusMode}
              onToggleFocus={onToggleFocus}
              onResetTransform={onResetTransform}
              trackingQuality={trackingQuality}
              showOnboarding={showOnboarding}
              onDismissOnboarding={onDismissOnboarding}
            />
          )}
        </div>

        {/* ── Tour details pills ─────────────────────────────── */}
        {!isActive && (
          <div className="ar-tour-details">
            <div className="ar-detail-pill"><span>⏰</span><span>{tour.duration}</span></div>
            <div className="ar-detail-pill"><span>👥</span><span>{tour.groupSize}</span></div>
            <div className="ar-detail-pill"><span>⭐</span><span>{tour.rating} ({tour.reviews} reviews)</span></div>
            <div className="ar-detail-pill"><span>📍</span><span>{sceneConfig.hotspots.length} hotspots</span></div>
          </div>
        )}

        {/* ── Feature tags ──────────────────────────────────── */}
        {arState === "idle" && (
          <div className="ar-feature-tags">
            <span className="ar-feature-tag">🤏 Pinch to scale</span>
            <span className="ar-feature-tag">🔄 Drag to rotate</span>
            <span className="ar-feature-tag">👆 Tap hotspots</span>
          </div>
        )}

        {/* ── Actions ───────────────────────────────────────── */}
        {!isActive && (
          <div className="ar-modal-actions">
            {arState === "idle" && (
              <button className="ar-btn ar-btn--primary" onClick={onStart}>
                <span className="ar-btn__icon">🥽</span>
                Start AR Experience
              </button>
            )}
            {isLoading && (
              <button className="ar-btn ar-btn--primary" disabled>
                <span className="ar-btn__spinner" />
                {arState === "loading" ? "Loading…" : "Calibrating…"}
              </button>
            )}
            <button className="ar-btn ar-btn--secondary" onClick={onClose}>
              Exit AR
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ARModal;
