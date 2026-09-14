import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

import DashboardLayout from "../components/Dashboard/DashboardLayout";
import DashboardSidebar from "../components/Dashboard/DashboardSidebar";

import {
    getProfessionalBookings,
    updateBookingStatus,
} from "../services/bookingService";

import {
    CalendarDays,
    Clock,
    MapPin,
    Phone,
    IndianRupee,
    User,
    BriefcaseBusiness,
} from "lucide-react";


function ProfessionalBookings() {

    // =====================================================
    // STATE
    // =====================================================

    const [bookings, setBookings] = useState([]);

    const [loading, setLoading] = useState(true);
    const [updatingBookingId, setUpdatingBookingId] =
        useState(null);


    // =====================================================
    // FETCH PROFESSIONAL BOOKINGS
    // =====================================================

    useEffect(() => {

        const fetchBookings = async () => {

            try {

                setLoading(true);

                const data =
                    await getProfessionalBookings();

                if (data.success) {

                    setBookings(
                        data.bookings || []
                    );

                }

            } catch (error) {

                console.error(
                    "Fetch Professional Bookings Error:",
                    error
                );

                const message =
                    error.response?.data?.message ||
                    "Failed to load bookings.";

                toast.error(message);

            } finally {

                setLoading(false);

            }

        };


        fetchBookings();

    }, []);


    // =====================================================
    // STATUS STYLES
    // =====================================================

    const getStatusStyle = (status) => {

        switch (status) {

            case "confirmed":
                return "bg-blue-100 text-blue-700";

            case "completed":
                return "bg-green-100 text-green-700";

            case "cancelled":
                return "bg-red-100 text-red-700";

            case "pending":
                return "bg-yellow-100 text-yellow-700";

            default:
                return "bg-gray-100 text-gray-700";

        }

    };
    // =====================================================
    // UPDATE BOOKING STATUS
    // =====================================================

    const handleStatusUpdate = async (
        bookingId,
        status
    ) => {
        try {
            setUpdatingBookingId(bookingId);

            const data = await updateBookingStatus(
                bookingId,
                status
            );

            if (data.success) {
                setBookings((currentBookings) =>
                    currentBookings.map((booking) =>
                        booking._id === bookingId
                            ? data.booking
                            : booking
                    )
                );

                toast.success(data.message);
            }
        } catch (error) {
            console.error(
                "Update Booking Status Error:",
                error
            );

            const message =
                error.response?.data?.message ||
                "Failed to update booking status.";

            toast.error(message);
        } finally {
            setUpdatingBookingId(null);
        }
    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "—";
        }

        return new Date(date).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );

    };


    // =====================================================
    // UI
    // =====================================================

    return (
        <>
            <Navbar />

            <DashboardLayout
                sidebar={<DashboardSidebar />}
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="bg-white rounded-2xl shadow-lg p-6">

                    <div className="flex items-center gap-3">

                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">

                            <BriefcaseBusiness
                                size={24}
                                className="text-blue-600"
                            />

                        </div>

                        <div>

                            <h1 className="text-3xl font-bold text-gray-900">
                                My Bookings
                            </h1>

                            <p className="text-gray-500 mt-1">
                                View and manage bookings received from customers.
                            </p>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (

                    <div className="bg-white rounded-2xl shadow-lg p-12 mt-8 flex justify-center">

                        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin">
                        </div>

                    </div>

                )}


                {/* =================================================
                    EMPTY STATE
                ================================================= */}

                {!loading && bookings.length === 0 && (

                    <div className="bg-white rounded-2xl shadow-lg p-12 mt-8 text-center">

                        <CalendarDays
                            size={50}
                            className="mx-auto text-gray-400 mb-4"
                        />

                        <h2 className="text-2xl font-semibold text-gray-800">
                            No bookings yet
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Customer bookings will appear here.
                        </p>

                    </div>

                )}


                {/* =================================================
                    BOOKINGS LIST
                ================================================= */}

                {!loading && bookings.length > 0 && (

                    <div className="space-y-6 mt-8">

                        {bookings.map((booking) => (

                            <div
                                key={booking._id}
                                className="bg-white rounded-2xl shadow-lg p-6"
                            >

                                {/* =================================================
                                    BOOKING HEADER
                                ================================================= */}

                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                                    <div>

                                        <h2 className="text-xl font-bold text-gray-900">
                                            {booking.serviceTitle ||
                                                booking.service?.title ||
                                                "Service"}
                                        </h2>

                                        <p className="text-gray-500 mt-1 flex items-center gap-2">

                                            <User size={16} />

                                            {booking.user?.fullName ||
                                                "Customer"}

                                        </p>

                                    </div>


                                    {/* Status */}

                                    <span
                                        className={`w-fit px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusStyle(
                                            booking.status
                                        )}`}
                                    >
                                        {booking.status}
                                    </span>

                                </div>


                                {/* =================================================
                                    BOOKING DETAILS
                                ================================================= */}

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6 pt-6 border-t">


                                    {/* Date */}

                                    <div className="flex items-center gap-3">

                                        <CalendarDays
                                            size={20}
                                            className="text-blue-600"
                                        />

                                        <div>

                                            <p className="text-xs text-gray-500">
                                                Date
                                            </p>

                                            <p className="font-medium">
                                                {formatDate(
                                                    booking.bookingDate
                                                )}
                                            </p>

                                        </div>

                                    </div>


                                    {/* Time */}

                                    <div className="flex items-center gap-3">

                                        <Clock
                                            size={20}
                                            className="text-blue-600"
                                        />

                                        <div>

                                            <p className="text-xs text-gray-500">
                                                Time
                                            </p>

                                            <p className="font-medium">
                                                {booking.bookingTime || "—"}
                                            </p>

                                        </div>

                                    </div>


                                    {/* Phone */}

                                    <div className="flex items-center gap-3">

                                        <Phone
                                            size={20}
                                            className="text-green-600"
                                        />

                                        <div>

                                            <p className="text-xs text-gray-500">
                                                Phone
                                            </p>

                                            <p className="font-medium">
                                                {booking.user?.phone ||
                                                    booking.phone ||
                                                    "—"}
                                            </p>

                                        </div>

                                    </div>


                                    {/* Price */}

                                    <div className="flex items-center gap-3">

                                        <IndianRupee
                                            size={20}
                                            className="text-green-600"
                                        />

                                        <div>

                                            <p className="text-xs text-gray-500">
                                                Price
                                            </p>

                                            <p className="font-medium">
                                                ₹{booking.price ?? 0}
                                            </p>

                                        </div>

                                    </div>

                                </div>


                                {/* =================================================
                                    CUSTOMER ADDRESS
                                ================================================= */}

                                <div className="mt-5 bg-gray-50 rounded-xl p-4">

                                    <div className="flex items-start gap-3">

                                        <MapPin
                                            size={20}
                                            className="text-red-500 mt-0.5"
                                        />

                                        <div>

                                            <p className="text-sm text-gray-500">
                                                Service Address
                                            </p>

                                            <p className="font-medium mt-1 text-gray-800">
                                                {booking.address ||
                                                    "Address not provided"}
                                            </p>

                                            {booking.city && (

                                                <p className="text-sm text-gray-500 mt-1">
                                                    {booking.city}
                                                </p>

                                            )}

                                        </div>

                                    </div>

                                </div>


                                {/* =================================================
                                    CUSTOMER NOTES
                                ================================================= */}

                                {booking.notes && (

                                    <div className="mt-4 bg-blue-50 rounded-xl p-4">

                                        <p className="text-sm text-gray-500">
                                            Customer Notes
                                        </p>

                                        <p className="font-medium mt-1 text-gray-800">
                                            {booking.notes}
                                        </p>

                                    </div>

                                )}
                                {/* =================================================
    BOOKING ACTIONS
================================================= */}

                                {booking.status !== "completed" &&
                                    booking.status !== "cancelled" && (

                                        <div className="mt-5 pt-5 border-t flex flex-col sm:flex-row gap-3">

                                            {booking.status === "pending" && (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                booking._id,
                                                                "confirmed"
                                                            )
                                                        }
                                                        disabled={
                                                            updatingBookingId ===
                                                            booking._id
                                                        }
                                                        className="flex-1 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                                                    >
                                                        {updatingBookingId === booking._id
                                                            ? "Updating..."
                                                            : "Confirm Booking"}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                booking._id,
                                                                "cancelled"
                                                            )
                                                        }
                                                        disabled={
                                                            updatingBookingId ===
                                                            booking._id
                                                        }
                                                        className="flex-1 bg-red-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                                                    >
                                                        {updatingBookingId === booking._id
                                                            ? "Updating..."
                                                            : "Cancel Booking"}
                                                    </button>
                                                </>
                                            )}

                                            {booking.status === "confirmed" && (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                booking._id,
                                                                "completed"
                                                            )
                                                        }
                                                        disabled={
                                                            updatingBookingId ===
                                                            booking._id
                                                        }
                                                        className="flex-1 bg-green-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                                                    >
                                                        {updatingBookingId === booking._id
                                                            ? "Updating..."
                                                            : "Mark Completed"}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleStatusUpdate(
                                                                booking._id,
                                                                "cancelled"
                                                            )
                                                        }
                                                        disabled={
                                                            updatingBookingId ===
                                                            booking._id
                                                        }
                                                        className="flex-1 bg-red-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                                                    >
                                                        {updatingBookingId === booking._id
                                                            ? "Updating..."
                                                            : "Cancel Booking"}
                                                    </button>
                                                </>
                                            )}

                                        </div>
                                    )}

                            </div>

                        ))}

                    </div>

                )}

            </DashboardLayout>

            <Footer />
        </>
    );
}


export default ProfessionalBookings;