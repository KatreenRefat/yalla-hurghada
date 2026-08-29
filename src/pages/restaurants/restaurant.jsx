import RestaurantHeroSection from "../../components/restaurants/Herosectionrestaurant/Herosectionrestaurant";
import AvailableRestaurants from "../../components/restaurants/AvailableRestaurantscards/AvailableRestaurantcards";
import FeatureRestaurantCarousel from "../../components/restaurants/FeatureRestaurantCarousel/FeatureRestaurantCarousel";
import RestaurantTestimonial from "../../components/restaurants/TestimonialRestaurant/RestaurantTestimonial";
import "./restaurant.css";

const Restaurants = () => {
    return (
        <main className="restaurants-page">
            <RestaurantHeroSection />
            <AvailableRestaurants />
            <FeatureRestaurantCarousel />
            <RestaurantTestimonial />
        </main>
    );
};

export default Restaurants;
