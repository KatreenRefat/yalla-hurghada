import { Routes, Route, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { ThemeProvider } from "./context/Themeprovider";
import { LanguageProvider } from "./context/Languageprovider";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home/Home";
import Tours from "./pages/Tours/Tours";
import Hotels from "./pages/hotels/hotels";
import Restaurants from "./pages/restaurants/restaurant";
import Transportation from "./pages/Transportation/Transportation";
import Booking from "./pages/Booking/Booking";
import Contact from "./pages/Contact/Contact";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ProtectedRoute from "./routes/ProtectedRoute";
import ChatWidget from "./components/ChatWidget/ChatWidget";
import ModelPage from "./pages/ModelPage/Model";
import TravelGuide from "./components/TravelGuide/TravelGuide";

function App() {
  const location = useLocation();
  const hideFooter = ["/login", "/signup"].includes(location.pathname);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <Navbar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/transport" element={<Transportation />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Register />} />

          <Route path="/model/:id" element={<ModelPage />} />

          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            }
          />

          {/* لو عايزة صفحة Travel Guide */}
          <Route path="/guide" element={<TravelGuide />} />
        </Routes>
            <ChatWidget />
        {!hideFooter && <Footer />}
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;