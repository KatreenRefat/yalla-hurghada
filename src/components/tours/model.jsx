import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useParams, useNavigate, useLocation as useRouterLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { locations } from "../../data/locations";
import ImmersiveViewer from "../../components/3d/core/ImmersiveViewer";
import ViewerUI from "../../components/3d/ui/ViewerUI";
import "./Model.css";
import { useARStore } from "../../components/store/arStore";

const getSceneType = (loc) => loc?.type || "yacht";
const getTourTitle = (loc) => loc?.name || "Tour Experience";

export default function ModelPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const routerLocation = useRouterLocation();

  // البيانات الحقيقية الجاية من التور كارد (الاسم، النوع، السعر..) عبر navigation state
  const realTour = routerLocation.state?.tour || null;

  // أولاً نحاول نطابق بالـ id الثابت (للموديلات القديمة لو حد فتحها مباشرة)
  // لو مفيش تطابق، نستخدم بيانات التور الحقيقي ونحدد الـ scene من نوعه
  const location = useMemo(() => {
    const staticMatch = locations.find(l => l.id === Number(id));
    if (staticMatch) return staticMatch;
    if (!realTour) return null;
    return {
      id: realTour.id,
      name: realTour.title || realTour.name,
      type: ["diving", "safari", "yacht"].includes(realTour.type) ? realTour.type : "yacht",
    };
  }, [id, realTour]);

  const sceneType = useMemo(() => getSceneType(location), [location]);
  const { setActiveTour, setActiveScene, resetCamera,
          setIsMobile, isFullscreen, setFullscreen } = useARStore();
  const containerRef = useRef();
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    if (!location) return;
    setActiveTour(location);
    setActiveScene(sceneType);
    setIsMobile(/Mobi|Android/i.test(navigator.userAgent));
    const t = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(t);
  }, [location, sceneType, setActiveTour, setActiveScene, setIsMobile]);

  const handleFullscreen = useCallback(async () => {
    const el = containerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      try { await el.requestFullscreen(); setFullscreen(true); } catch { /* ignore fullscreen request failures */ }
    } else {
      try { await document.exitFullscreen(); setFullscreen(false); } catch { /* ignore fullscreen exit failures */ }
    }
  }, [setFullscreen]);

  useEffect(() => {
    const fn = () => setFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", fn);
    return () => document.removeEventListener("fullscreenchange", fn);
  }, [setFullscreen]);

  const handleReset = useCallback(() => resetCamera(), [resetCamera]);

  if (!location) {
    return (
      <div className="model-not-found">
        <div className="model-not-found__icon">🔍</div>
        <h2>Tour Not Found</h2>
        <p>This location doesn't exist.</p>
        <button onClick={() => navigate("/tours")} className="model-not-found__btn">
          Back to Tours
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef}
         className={`model-page${isFullscreen ? " model-page--fullscreen" : ""}`}>
      <div className="model-page__canvas">
        <ImmersiveViewer sceneType={sceneType} />
      </div>
      <div className="model-page__ui">
        <ViewerUI sceneType={sceneType} tourTitle={getTourTitle(location)}
          onReset={handleReset} onFullscreen={handleFullscreen}
          isFullscreen={isFullscreen} showHint={showHint} />
      </div>
      <motion.button className="model-page__back" onClick={() => navigate("/tours")}
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}>
        ←
      </motion.button>
    </div>
  );
}