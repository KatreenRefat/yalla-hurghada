import { useEffect, useRef, useState } from "react"; 
import "./RedSeaMagic.css";
import { redSeaMagicData } from "../../../data/redSeaMagicData";

function RedSeaMagic() {
  const { label, title, description, stats, video } = redSeaMagicData;
  const videoRef = useRef(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [video]);

  const handleToggle = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setPaused(false);
    } else {
      videoRef.current.pause();
      setPaused(true);
    }
  };

  return (
    <section className="red-sea-magic" data-aos="fade-up" data-aos-duration="800">
      <div className="rsm-container">
        
        <div className="rsm-content" data-aos="fade-right" data-aos-delay="100">
          <span className="rsm-label">{label}</span>
          <h2 className="rsm-title">{title}</h2>
          <p className="rsm-description">{description}</p>
          
          <div className="rsm-stats">
            {stats.map((stat, index) => (
              <div className="stat-item" key={index}>
                <span className="stat-number">{stat.number}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rsm-video-wrapper" data-aos="fade-left" data-aos-delay="200" onClick={handleToggle}>
          <video 
            ref={videoRef}
            src={video} 
            className="rsm-video"
            autoPlay 
            loop 
            muted 
            playsInline
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            poster="https://images.unsplash.com/photo-1546026423-cc4642628d2b?w=800&h=500&fit=crop"
          >
            Your browser does not support the video tag.
          </video>
          
          <div className="play-btn" style={{ opacity: paused ? 1 : 0, pointerEvents: "none" }}>
            <div className="play-icon">▶</div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default RedSeaMagic;