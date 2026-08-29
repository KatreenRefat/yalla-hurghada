// import React from "react";
import Herosection from "../../components/hotels/Herosection/Herosection";
import Availablehotels from "../../components/hotels/Availablecards/AvailableHotels";
import "./hotels.css";
import FeaturedHotelCarousel from "../../components/hotels/FeatureHotelCarousel/FeatureHotelCarousel";
import HotelTestimonials from "../../components/hotels/Testemonial/HotelTestimonials";

const hotels = () => {
  return (
    <main className="hotels-page">

      <Herosection />

      <Availablehotels />

      <FeaturedHotelCarousel />

       <HotelTestimonials />
    </main>
  );
};

export default hotels;
