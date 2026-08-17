import { useEffect, useState } from "react";
import { CalendarDays, Clock, MapPin, IndianRupee } from "lucide-react";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { getMyBookings } from "../services/bookingService";

function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);

                const data = await getMyBookings();

                if (data.success) {
                    setBookings(data.bookings);
                }
            } catch (error) {
                console.error("Fetch Bookings Error:", error);

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
                            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
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