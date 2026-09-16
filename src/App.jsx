import { Toaster } from "react-hot-toast";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";


// =====================================================
// PUBLIC PAGES
// =====================================================

import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Booking from "./pages/Booking";
import BookingSuccess from "./pages/BookingSuccess";
import Wishlist from "./pages/Wishlist";
import Profile from "./pages/Profile";
import BecomeProfessional from "./pages/BecomeProfessional";


// =====================================================
// AUTH PAGES
// =====================================================

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";


// =====================================================
// USER PAGES
// =====================================================

import Dashboard from "./pages/Dashboard";
import EditProfile from "./pages/EditProfile";
import MyBookings from "./pages/MyBookings";


// =====================================================
// PROFESSIONAL PAGES
// =====================================================

import ProfessionalDashboard from "./pages/ProfessionalDashboard";
import ProfessionalServices from "./pages/ProfessionalServices";
import ProfessionalBookings from "./pages/ProfessionalBookings";
import ProfessionalProfile from "./pages/ProfessionalProfile";
import ProfessionalSettings from "./pages/ProfessionalSettings";
import CreateService from "./pages/CreateService";
import EditService from "./pages/EditService";


// =====================================================
// ADMIN PAGES
// =====================================================

import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminProfessionalApplications from "./pages/AdminProfessionalApplications";


// =====================================================
// ROUTE PROTECTION
// =====================================================

import ProtectedRoute from "./routes/ProtectedRoute";
import ProfessionalRoute from "./routes/ProfessionalRoute";
import AdminRoute from "./routes/AdminRoute";


// =====================================================
// COMPONENTS
// =====================================================

import ScrollToTop from "./components/ScrollToTop/ScrollToTop";


function App() {

  return (

    <BrowserRouter>

      {/* =================================================
                    SCROLL TO TOP
          ================================================= */}

      <ScrollToTop />


      {/* =================================================
                    GLOBAL TOASTER
          ================================================= */}

      <Toaster
        position="top-right"
        reverseOrder={false}
      />


      {/* =================================================
                    APPLICATION ROUTES
          ================================================= */}

      <Routes>


        {/* =================================================
                    PUBLIC ROUTES
            ================================================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/services"
          element={<Services />}
        />

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


        {/* =================================================
                    AUTH ROUTES
            ================================================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />


        {/* =================================================
                    USER DASHBOARD
            ================================================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />


        {/* =================================================
                    EDIT PROFILE
            ================================================= */}

        <Route
          path="/edit-profile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />


        {/* =================================================
                    PROFESSIONAL DASHBOARD
            ================================================= */}

        <Route
          path="/professional/dashboard"
          element={
            <ProfessionalRoute>
              <ProfessionalDashboard />
            </ProfessionalRoute>
          }
        />


        {/* =================================================
                    PROFESSIONAL PROFILE
            ================================================= */}

        <Route
          path="/professional/profile"
          element={
            <ProfessionalRoute>
              <ProfessionalProfile />
            </ProfessionalRoute>
          }
        />


        {/* =================================================
                    PROFESSIONAL SETTINGS
            ================================================= */}

        <Route
          path="/professional/settings"
          element={
            <ProfessionalRoute>
              <ProfessionalSettings />
            </ProfessionalRoute>
          }
        />


        {/* =================================================
                    PROFESSIONAL SERVICES
            ================================================= */}

        <Route
          path="/professional/services"
          element={
            <ProfessionalRoute>
              <ProfessionalServices />
            </ProfessionalRoute>
          }
        />


        {/* =================================================
                    PROFESSIONAL BOOKINGS
            ================================================= */}

        <Route
          path="/professional/bookings"
          element={
            <ProfessionalRoute>
              <ProfessionalBookings />
            </ProfessionalRoute>
          }
        />


        {/* =================================================
                    CREATE SERVICE
            ================================================= */}

        <Route
          path="/professional/services/create"
          element={
            <ProfessionalRoute>
              <CreateService />
            </ProfessionalRoute>
          }
        />


        {/* =================================================
                    EDIT SERVICE
            ================================================= */}

        <Route
          path="/professional/services/:serviceId/edit"
          element={
            <ProfessionalRoute>
              <EditService />
            </ProfessionalRoute>
          }
        />


        {/* =================================================
                    ADMIN DASHBOARD
            ================================================= */}

        <Route
          path="/admin/dashboard"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />


        {/* =================================================
                    ADMIN PROFESSIONAL APPLICATIONS
            ================================================= */}

        <Route
          path="/admin/professionals"
          element={
            <AdminRoute>
              <AdminProfessionalApplications />
            </AdminRoute>
          }
        />


        {/* =================================================
                    FALLBACK / 404
            ================================================= */}

        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">

              <div className="text-center">

                <h1 className="text-5xl font-bold text-gray-900">
                  404
                </h1>

                <p className="mt-3 text-gray-500">
                  Page not found
                </p>

              </div>

            </div>
          }
        />


      </Routes>

    </BrowserRouter>
  );
}


export default App;