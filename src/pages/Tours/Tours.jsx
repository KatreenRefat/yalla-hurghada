import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import ToursHero from "../../components/tours/ToursHero/ToursHero";
import AvailableTours from "../../components/tours/AvailableTours/AvailableTours";
import FeaturedToursCarousel from "../../components/tours/FeaturedToursCarousel/FeaturedToursCarousel";
import ToursTestimonials from "../../components/tours/ToursTestimonials/ToursTestimonials";
import { toursHeroData } from "../../data/ToursHeroData";
import "./Tours.css";




const Tours = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-out",
      once: true,
      offset: 50,
    });
  }, []);

  const handleHeroSearch = (searchData) => {
    console.log("Tours Search:", searchData);
  };

  return (
    
    <main className="tours-page">
      <ToursHero
        heroData={toursHeroData}
        onSearch={handleHeroSearch}
      />

      <AvailableTours />

      <FeaturedToursCarousel />

      {/* ← ← ← السكشن الجديد هنا */}
      <ToursTestimonials />

    </main>
  );
};

export default Tours;