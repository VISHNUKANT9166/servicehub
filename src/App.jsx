import { Toaster } from "react-hot-toast";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import Booking from "./pages/Booking";
import BookingSuccess from "./pages/BookingSuccess";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import BecomeProfessional from "./pages/BecomeProfessional";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster
        position="top-right"
        reverseOrder={false}
      />
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/services" element={<Services />} />
        <Route
          path="/services/:id"
          element={<ServiceDetails />}
        />
        <Route
          path="/booking/:id"
          element={<Booking />}
        />
        <Route
          path="/booking-success"
          element={<BookingSuccess />}
        />
        <Route
          path="/wishlist"
          element={<Wishlist />}
        />
        <Route
          path="/profile"
          element={<Profile />}
        />
        <Route
          path="/become-professional"
          element={<BecomeProfessional />}
        />

      </Routes>


    </BrowserRouter>
  );
}

export default App;