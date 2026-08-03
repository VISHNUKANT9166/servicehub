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
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import EditProfile from "./pages/EditProfile";

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
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
        <Route
          path="/edit-profile"
          element={<EditProfile />}
        />

      </Routes>



    </BrowserRouter>
  );
}

export default App;