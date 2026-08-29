import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import TransportationHero from "../../components/transportation/TransportationHero/TransportationHero";
import AvailableTransport from "../../components/transportation/AvailableTransport/AvailableTransport";
import FeaturedTransportCarousel from "../../components/transportation/FeaturedTransportCarousel/FeaturedTransportCarousel";

// ← ← ← الـ Import الجديد هنا
import TransportTestimonials from "../../components/transportation/TransportTestimonials/TransportTestimonials";

import { transportationHeroData } from "../../data/transportationHeroData";
import "./Transportation.css";

const Transportation = () => {
  
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out",
      once: true,
      offset: 50,
    });
  }, []);

  const handleHeroSearch = (searchData) => {
    console.log("Transportation Search:", searchData);
  };

  return (
    <main className="transportation-page">
      <TransportationHero
        heroData={transportationHeroData}
        onSearch={handleHeroSearch}
      />

      <AvailableTransport />

      <FeaturedTransportCarousel />

      {/* ← ← ← السكشن الجديد هنا */}
      <TransportTestimonials />

    </main>
  );
};

export default Transportation;
