import { useEffect, useState } from "react";
import {
    CalendarDays,
    Clock,
    MapPin,
    IndianRupee,
} from "lucide-react";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

import {
    getMyBookings,
    cancelBooking,
    rescheduleBooking,
} from "../services/bookingService";

function MyBookings() {

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reschedulingId, setReschedulingId] = useState(null);
    const [newDate, setNewDate] = useState("");
    const [newTime, setNewTime] = useState("");

    // Fetch user's bookings
    useEffect(() => {

        const fetchBookings = async () => {

            try {

                setLoading(true);

                const data = await getMyBookings();

                if (data.success) {
                    setBookings(data.bookings);
                }

            } catch (error) {

                console.error(
                    "Fetch Bookings Error:",
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


    // Cancel booking
    const handleCancelBooking = async (bookingId) => {

        try {

            const confirmCancel = window.confirm(
                "Are you sure you want to cancel this booking?"
            );

            if (!confirmCancel) {
                return;
            }

            const data = await cancelBooking(bookingId);

            if (data.success) {

                toast.success(
                    "Booking cancelled successfully."
                );

                setBookings((prev) =>
                    prev.map((booking) =>
                        booking._id === bookingId
                            ? {
                                ...booking,
                                status: "cancelled",
                            }
                            : booking
                    )
                );

            }

        } catch (error) {

            console.error(
                "Cancel Booking Error:",
                error
            );

            const message =
                error.response?.data?.message ||
                "Failed to cancel booking.";

            toast.error(message);

        }

    };
    const handleRescheduleBooking = async (bookingId) => {
        try {

            if (!newDate || !newTime) {
                toast.error("Please select a new date and time.");
                return;
            }

            const data = await rescheduleBooking(
                bookingId,
                {
                    bookingDate: newDate,
                    bookingTime: newTime,
                }
            );

            if (data.success) {

                toast.success(
                    "Booking rescheduled successfully."
                );

                setBookings((prev) =>
                    prev.map((booking) =>
                        booking._id === bookingId
                            ? {
                                ...booking,
                                bookingDate: newDate,
                                bookingTime: newTime,
                            }
                            : booking
                    )
                );

                setReschedulingId(null);
                setNewDate("");
                setNewTime("");
            }

        } catch (error) {

            console.error(
                "Reschedule Booking Error:",
                error
            );

            const message =
                error.response?.data?.message ||
                "Failed to reschedule booking.";

            toast.error(message);
        }
    };


    return (

        <>
            <Navbar />

            <main className="min-h-screen bg-gray-50 py-10">

                <div className="max-w-7xl mx-auto px-6">

                    {/* Page Header */}

                    <div className="mb-8">

                        <h1 className="text-3xl font-bold text-gray-900">
                            My Bookings
                        </h1>

                        <p className="text-gray-500 mt-2">
                            View and manage all your service bookings.
                        </p>

                    </div>


                    {/* Loading */}

                    {loading && (

                        <div className="flex justify-center items-center py-20">

                            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin">
                            </div>

                        </div>

                    )}


                    {/* Empty State */}

                    {!loading && bookings.length === 0 && (

                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">

                            <CalendarDays
                                size={50}
                                className="mx-auto text-gray-400 mb-4"
                            />

                            <h2 className="text-2xl font-semibold text-gray-800">
                                No bookings yet
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Your service bookings will appear here.
                            </p>

                        </div>

                    )}


                    {/* Bookings */}

                    {!loading && bookings.length > 0 && (

                        <div className="space-y-6">

                            {bookings.map((booking) => (

                                <div
                                    key={booking._id}
                                    className="bg-white rounded-2xl shadow-lg p-6"
                                >

                                    {/* Header */}

                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                                        {/* Service Info */}

                                        <div>

                                            <h2 className="text-xl font-bold text-gray-900">
                                                {booking.serviceTitle}
                                            </h2>

                                            {booking.professional && (

                                                <p className="text-gray-500 mt-1">

                                                    Professional:{" "}

                                                    <span className="font-medium text-gray-700">
                                                        {booking.professional}
                                                    </span>

                                                </p>

                                            )}

                                        </div>


                                        {/* Status */}

                                        <span
                                            className={`w-fit px-4 py-2 rounded-full text-sm font-semibold capitalize ${booking.status === "completed"
                                                ? "bg-green-100 text-green-700"
                                                : booking.status === "confirmed"
                                                    ? "bg-blue-100 text-blue-700"
                                                    : booking.status === "cancelled"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                }`}
                                        >
                                            {booking.status}
                                        </span>

                                    </div>


                                    {/* Booking Details */}

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t">

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

                                                    {new Date(
                                                        booking.bookingDate
                                                    ).toLocaleDateString(
                                                        "en-IN",
                                                        {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                        }
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
                                                    {booking.bookingTime}
                                                </p>

                                            </div>

                                        </div>


                                        {/* Location */}

                                        <div className="flex items-center gap-3">

                                            <MapPin
                                                size={20}
                                                className="text-red-500"
                                            />

                                            <div>

                                                <p className="text-xs text-gray-500">
                                                    Location
                                                </p>

                                                <p className="font-medium">
                                                    {booking.city ||
                                                        booking.address}
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
                                                    ₹{booking.price}
                                                </p>

                                            </div>

                                        </div>

                                    </div>


                                    {/* Address */}

                                    <div className="mt-5 bg-gray-50 rounded-xl p-4">

                                        <p className="text-sm text-gray-500">
                                            Service Address
                                        </p>

                                        <p className="font-medium mt-1">
                                            {booking.address}
                                        </p>

                                    </div>

                                    {/* Reschedule Form */}

                                    {reschedulingId === booking._id && (
                                        <div className="mt-5 bg-blue-50 rounded-xl p-5">

                                            <h3 className="font-semibold text-lg text-gray-800 mb-4">
                                                Reschedule Booking
                                            </h3>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                                {/* New Date */}

                                                <div>

                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        New Date
                                                    </label>

                                                    <input
                                                        type="date"
                                                        value={newDate}
                                                        onChange={(e) =>
                                                            setNewDate(e.target.value)
                                                        }
                                                        min={
                                                            new Date()
                                                                .toISOString()
                                                                .split("T")[0]
                                                        }
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />

                                                </div>

                                                {/* New Time */}

                                                <div>

                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        New Time
                                                    </label>

                                                    <input
                                                        type="time"
                                                        value={newTime}
                                                        onChange={(e) =>
                                                            setNewTime(e.target.value)
                                                        }
                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />

                                                </div>

                                            </div>

                                            {/* Actions */}

                                            <div className="flex justify-end gap-3 mt-4">

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setReschedulingId(null);
                                                        setNewDate("");
                                                        setNewTime("");
                                                    }}
                                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRescheduleBooking(
                                                            booking._id
                                                        )
                                                    }
                                                    className="px-4 py-2 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition"
                                                >
                                                    Confirm Reschedule
                                                </button>

                                            </div>

                                        </div>
                                    )}
                                    {/* Cancel Button */}

                                    {booking.status !== "completed" &&
                                        booking.status !== "cancelled" && (

                                            <div className="mt-5 flex justify-end gap-3">

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setReschedulingId(booking._id);
                                                        setNewDate("");
                                                        setNewTime("");
                                                    }}
                                                    className="px-5 py-2.5 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition"
                                                >
                                                    Reschedule
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleCancelBooking(
                                                            booking._id
                                                        )
                                                    }
                                                    className="px-5 py-2.5 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition"
                                                >
                                                    Cancel Booking
                                                </button>

                                            </div>

                                        )}
                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </main>

            <Footer />

        </>

    );

}

export default MyBookings;