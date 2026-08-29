import HeroSection from "../../components/home/HeroSection/HeroSection";
import FeaturedTours from "../../components/home/FeaturedTours/FeaturedTours"; 
import TopDestinations from "../../components/home/TopDestinations/TopDestinations";
import ChooseAdventure from "../../components/home/ChooseAdventure/ChooseAdventure";
import DivingExperiences from "../../components/home/DivingExperiences/DivingExperiences"; 
import YachtTrips from "../../components/home/YachtTrips/YachtTrips";
import DesertSafariV2 from "../../components/home/DesertSafari/DesertSafari";
import Popularhotels from "../../components/home/PopularHotels/PopularHotels";
import IslandAdventures from "../../components/home/IslandAdventures/IslandAdventures";
import AquaParks from "../../components/home/AquaParks/AquaParks";
import RedSeaMagic from "../../components/home/RedSeaMagic/RedSeaMagic";
import WhyHurghada from "../../components/home/WhyHurghada/WhyHurghada";
import OffersSection from "../../components/home/OffersSection/OffersSection";
import Testimonials from "../../components/home/Testimonials/Testimonials";

function Home() {
  return (
     <>
      <HeroSection />
       <FeaturedTours />
         <TopDestinations /> 
             <ChooseAdventure /> 
                <DivingExperiences />
                 <YachtTrips />
                    <DesertSafariV2 />
                    <Popularhotels />
                       <IslandAdventures /> 
                          <AquaParks /> 
                            <RedSeaMagic />
                               <WhyHurghada />
                                  <OffersSection />
                                     <Testimonials />
    </>
  );
}

export default Home;
