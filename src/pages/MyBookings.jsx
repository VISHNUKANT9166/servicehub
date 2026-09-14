import { useEffect, useState } from "react";
import {
    CalendarDays,
    Clock,
    MapPin,
    IndianRupee,
    RefreshCw,
    XCircle,
    CheckCircle2,
    Loader2,
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

    const [actionLoading, setActionLoading] = useState(null);

    const [reschedulingId, setReschedulingId] =
        useState(null);

    const [newDate, setNewDate] = useState("");
    const [newTime, setNewTime] = useState("");


    // =====================================================
    // FETCH BOOKINGS
    // =====================================================

    const fetchBookings = async () => {

        try {

            setLoading(true);

            const data = await getMyBookings();

            if (data.success) {

                setBookings(
                    Array.isArray(data.bookings)
                        ? data.bookings
                        : []
                );

            } else {

                toast.error(
                    data.message ||
                    "Failed to load bookings."
                );

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


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        fetchBookings();

    }, []);


    // =====================================================
    // CANCEL BOOKING
    // =====================================================

    const handleCancelBooking = async (
        bookingId
    ) => {

        const confirmCancel =
            window.confirm(
                "Are you sure you want to cancel this booking?"
            );

        if (!confirmCancel) {
            return;
        }


        try {

            setActionLoading(
                `cancel-${bookingId}`
            );

            const data =
                await cancelBooking(
                    bookingId
                );


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

            } else {

                toast.error(
                    data.message ||
                    "Failed to cancel booking."
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

        } finally {

            setActionLoading(null);

        }
    };


    // =====================================================
    // OPEN RESCHEDULE
    // =====================================================

    const openReschedule = (
        booking
    ) => {

        setReschedulingId(
            booking._id
        );

        setNewDate("");
        setNewTime("");
    };


    // =====================================================
    // CLOSE RESCHEDULE
    // =====================================================

    const closeReschedule = () => {

        setReschedulingId(null);
        setNewDate("");
        setNewTime("");

    };


    // =====================================================
    // RESCHEDULE BOOKING
    // =====================================================

    const handleRescheduleBooking =
        async (bookingId) => {

            if (!newDate) {

                toast.error(
                    "Please select a new date."
                );

                return;
            }


            if (!newTime) {

                toast.error(
                    "Please select a new time."
                );

                return;
            }


            try {

                setActionLoading(
                    `reschedule-${bookingId}`
                );


                const data =
                    await rescheduleBooking(
                        bookingId,
                        {
                            bookingDate:
                                newDate,

                            bookingTime:
                                newTime,
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

                                    bookingDate:
                                        data.booking?.bookingDate ||
                                        newDate,

                                    bookingTime:
                                        data.booking?.bookingTime ||
                                        newTime,

                                    // Backend changes
                                    // rescheduled booking
                                    // back to pending
                                    status:
                                        data.booking?.status ||
                                        "pending",
                                }
                                : booking
                        )
                    );


                    closeReschedule();

                } else {

                    toast.error(
                        data.message ||
                        "Failed to reschedule booking."
                    );

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

            } finally {

                setActionLoading(null);

            }
        };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (
        date
    ) => {

        if (!date) {
            return "—";
        }

        return new Date(
            date
        ).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };


    // =====================================================
    // GET PROFESSIONAL NAME
    // =====================================================

    const getProfessionalName =
        (booking) => {

            return (
                booking?.professional?.user
                    ?.fullName ||
                "Professional"
            );
        };


    // =====================================================
    // STATUS STYLE
    // =====================================================

    const getStatusClasses =
        (status) => {

            switch (status) {

                case "completed":
                    return "bg-green-100 text-green-700";

                case "confirmed":
                    return "bg-blue-100 text-blue-700";

                case "cancelled":
                    return "bg-red-100 text-red-700";

                case "pending":
                default:
                    return "bg-yellow-100 text-yellow-700";
            }
        };


    // =====================================================
    // STATUS ICON
    // =====================================================

    const getStatusIcon =
        (status) => {

            switch (status) {

                case "completed":
                    return (
                        <CheckCircle2
                            size={16}
                        />
                    );

                case "cancelled":
                    return (
                        <XCircle
                            size={16}
                        />
                    );

                default:
                    return null;
            }
        };


    // =====================================================
    // RENDER
    // =====================================================

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-gray-50 py-10">

                <div className="max-w-7xl mx-auto px-6">

                    {/* =================================================
                                PAGE HEADER
                        ================================================= */}

                    <div className="mb-8">

                        <h1 className="text-3xl font-bold text-gray-900">
                            My Bookings
                        </h1>

                        <p className="text-gray-500 mt-2">
                            View and manage all your service bookings.
                        </p>

                    </div>


                    {/* =================================================
                                LOADING
                        ================================================= */}

                    {loading && (

                        <div className="flex flex-col justify-center items-center py-24">

                            <Loader2
                                size={40}
                                className="text-blue-600 animate-spin"
                            />

                            <p className="text-gray-500 mt-4">
                                Loading your bookings...
                            </p>

                        </div>

                    )}


                    {/* =================================================
                                EMPTY STATE
                        ================================================= */}

                    {!loading &&
                        bookings.length === 0 && (

                            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">

                                <CalendarDays
                                    size={52}
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


                    {/* =================================================
                                BOOKINGS
                        ================================================= */}

                    {!loading &&
                        bookings.length > 0 && (

                            <div className="space-y-6">

                                {bookings.map(
                                    (booking) => {

                                        const isActionLoading =
                                            actionLoading ===
                                            `cancel-${booking._id}` ||
                                            actionLoading ===
                                            `reschedule-${booking._id}`;


                                        const canManage =
                                            booking.status !==
                                            "completed" &&
                                            booking.status !==
                                            "cancelled";


                                        return (

                                            <div
                                                key={booking._id}
                                                className="bg-white rounded-2xl shadow-lg p-6"
                                            >

                                                {/* =================================================
                                                            HEADER
                                                    ================================================= */}

                                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                                                    <div>

                                                        <h2 className="text-xl font-bold text-gray-900">
                                                            {booking.serviceTitle ||
                                                                booking.service?.title ||
                                                                "Service"}
                                                        </h2>

                                                        <p className="text-gray-500 mt-1">

                                                            Professional:{" "}

                                                            <span className="font-medium text-gray-700">
                                                                {getProfessionalName(
                                                                    booking
                                                                )}
                                                            </span>

                                                        </p>

                                                    </div>


                                                    {/* STATUS */}

                                                    <span
                                                        className={`w-fit inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusClasses(
                                                            booking.status
                                                        )}`}
                                                    >

                                                        {getStatusIcon(
                                                            booking.status
                                                        )}

                                                        {booking.status}

                                                    </span>

                                                </div>


                                                {/* =================================================
                                                            DETAILS
                                                    ================================================= */}

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6 pt-6 border-t">

                                                    {/* DATE */}

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


                                                    {/* TIME */}

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
                                                                {booking.bookingTime ||
                                                                    "—"}
                                                            </p>

                                                        </div>

                                                    </div>


                                                    {/* LOCATION */}

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
                                                                    "Not specified"}
                                                            </p>

                                                        </div>

                                                    </div>


                                                    {/* PRICE */}

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
                                                                ₹{booking.price || 0}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </div>


                                                {/* =================================================
                                                            ADDRESS
                                                    ================================================= */}

                                                <div className="mt-5 bg-gray-50 rounded-xl p-4">

                                                    <p className="text-sm text-gray-500">
                                                        Service Address
                                                    </p>

                                                    <p className="font-medium mt-1 text-gray-800">
                                                        {booking.address ||
                                                            "Not specified"}
                                                    </p>

                                                </div>


                                                {/* =================================================
                                                            NOTES
                                                    ================================================= */}

                                                {booking.notes && (

                                                    <div className="mt-4 bg-gray-50 rounded-xl p-4">

                                                        <p className="text-sm text-gray-500">
                                                            Additional Notes
                                                        </p>

                                                        <p className="font-medium mt-1 text-gray-800">
                                                            {booking.notes}
                                                        </p>

                                                    </div>

                                                )}


                                                {/* =================================================
                                                            RESCHEDULE FORM
                                                    ================================================= */}

                                                {reschedulingId ===
                                                    booking._id && (

                                                        <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl p-5">

                                                            <h3 className="font-semibold text-lg text-gray-800 mb-4">
                                                                Reschedule Booking
                                                            </h3>


                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                                                {/* DATE */}

                                                                <div>

                                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                        New Date
                                                                    </label>

                                                                    <input
                                                                        type="date"
                                                                        value={newDate}
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setNewDate(
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        min={
                                                                            new Date()
                                                                                .toISOString()
                                                                                .split(
                                                                                    "T"
                                                                                )[0]
                                                                        }
                                                                        disabled={
                                                                            isActionLoading
                                                                        }
                                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                                                    />

                                                                </div>


                                                                {/* TIME */}

                                                                <div>

                                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                        New Time
                                                                    </label>

                                                                    <input
                                                                        type="time"
                                                                        value={newTime}
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setNewTime(
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            isActionLoading
                                                                        }
                                                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                                                    />

                                                                </div>

                                                            </div>


                                                            {/* ACTIONS */}

                                                            <div className="flex justify-end gap-3 mt-5">

                                                                <button
                                                                    type="button"
                                                                    onClick={
                                                                        closeReschedule
                                                                    }
                                                                    disabled={
                                                                        isActionLoading
                                                                    }
                                                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition disabled:opacity-50"
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
                                                                    disabled={
                                                                        isActionLoading
                                                                    }
                                                                    className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 flex items-center gap-2"
                                                                >

                                                                    {actionLoading ===
                                                                        `reschedule-${booking._id}` && (

                                                                            <Loader2
                                                                                size={17}
                                                                                className="animate-spin"
                                                                            />

                                                                        )}

                                                                    {actionLoading ===
                                                                        `reschedule-${booking._id}`
                                                                        ? "Updating..."
                                                                        : "Confirm Reschedule"}

                                                                </button>

                                                            </div>

                                                        </div>
                                                    )}


                                                {/* =================================================
                                                            ACTIONS
                                                    ================================================= */}

                                                {canManage && (
                                                    <div className="mt-5 flex flex-wrap justify-end gap-3">

                                                        {/* RESCHEDULE */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                openReschedule(
                                                                    booking
                                                                )
                                                            }
                                                            disabled={
                                                                isActionLoading ||
                                                                reschedulingId !==
                                                                null
                                                            }
                                                            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                                                        >

                                                            <RefreshCw
                                                                size={17}
                                                            />

                                                            Reschedule

                                                        </button>


                                                        {/* CANCEL */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleCancelBooking(
                                                                    booking._id
                                                                )
                                                            }
                                                            disabled={
                                                                isActionLoading
                                                            }
                                                            className="px-5 py-2.5 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                                                        >

                                                            {actionLoading ===
                                                                `cancel-${booking._id}` ? (

                                                                <Loader2
                                                                    size={17}
                                                                    className="animate-spin"
                                                                />

                                                            ) : (

                                                                <XCircle
                                                                    size={17}
                                                                />

                                                            )}

                                                            {actionLoading ===
                                                                `cancel-${booking._id}`
                                                                ? "Cancelling..."
                                                                : "Cancel Booking"}

                                                        </button>

                                                    </div>
                                                )}

                                            </div>

                                        );
                                    }
                                )}

                            </div>
                        )}

                </div>

            </main>

            <Footer />
        </>
    );
}

export default MyBookings;