// src/pages/Booking/Booking.jsx

import { BookingProvider, useBooking } from "../../context/BookingContext";
import BookingHeader from "../../components/Booking/BookingHeader/BookingHeader";
import BookingSteps from "../../components/Booking/BookingSteps/BookingSteps";
import BookingSummary from "../../components/Booking/BookingSummary/BookingSummary";
import BookingNavigation from "../../components/Booking/BookingNavigation/BookingNavigation";
import BookingTripBuilder from "../../components/Booking/BookingTripBuilder/BookingTripBuilder";
import BookingTabs from "../../components/Booking/BookingTabs/BookingTabs";
import BookingItemCard from "../../components/Booking/BookingItemCard/BookingItemCard";
import DetailsForm from "../../components/Booking/DetailsForm/DetailsForm";
import ExtrasCard from "../../components/Booking/ExtrasCard/ExtrasCard";
import PaymentForm from "../../components/Booking/PaymentForm/PaymentForm";
import Confirmation from "../../components/Booking/Confirmation/Confirmation";
import "./Booking.css";

function BookingContent() {
  const { step, activeTab, DATA_MAP, dataLoading, dataError } = useBooking();
  const items = DATA_MAP[activeTab] || [];

  return (
    <div className="booking-page">
      <div className="booking-page__inner">
        <BookingHeader />
        <BookingSteps />

        <div className="booking-page__layout">
          <div className="booking-page__main">
            {step === 1 && (
              <>
                <BookingTripBuilder />
                <BookingTabs />
                {dataLoading && (
                  <p style={{ padding: "24px", textAlign: "center", color: "#888" }}>Loading available services...</p>
                )}
                {dataError && (
                  <p style={{ padding: "24px", textAlign: "center", color: "#ef4444" }}>Error: {dataError}</p>
                )}
                {!dataLoading && !dataError && (
                  <div className="booking-page__grid">
                    {items.map(item => (
                      <BookingItemCard key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </>
            )}
            {step === 2 && <DetailsForm />}
            {step === 3 && <ExtrasCard />}
            {step === 4 && <PaymentForm />}
            {step === 5 && <Confirmation />}
          </div>

          <div className="booking-page__sidebar">
            <BookingSummary />
            <BookingNavigation />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Booking() {
  return (
    <BookingProvider>
      <BookingContent />
    </BookingProvider>
  );
}