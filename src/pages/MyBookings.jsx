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
    Star,
} from "lucide-react";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

import {
    getMyBookings,
    cancelBooking,
    rescheduleBooking,
} from "../services/bookingService";

import {
    createReview,
    getMyBookingReview,
} from "../services/reviewService";


function MyBookings() {

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const [actionLoading, setActionLoading] =
        useState(null);

    const [reschedulingId, setReschedulingId] =
        useState(null);

    const [newDate, setNewDate] =
        useState("");

    const [newTime, setNewTime] =
        useState("");

    // =====================================================
    // REVIEW STATE
    // =====================================================

    const [reviewsByBooking, setReviewsByBooking] =
        useState({});

    const [reviewOpenId, setReviewOpenId] =
        useState(null);

    const [reviewRating, setReviewRating] =
        useState(0);

    const [reviewComment, setReviewComment] =
        useState("");

    const [reviewLoadingId, setReviewLoadingId] =
        useState(null);


    // =====================================================
    // FETCH EXISTING REVIEWS
    // =====================================================

    const fetchBookingReviews = async (
        bookingList
    ) => {

        const completedBookings =
            bookingList.filter(
                (booking) =>
                    booking.status ===
                    "completed"
            );

        if (
            completedBookings.length === 0
        ) {
            return;
        }

        try {

            const reviewResults =
                await Promise.all(
                    completedBookings.map(
                        async (booking) => {

                            try {

                                const data =
                                    await getMyBookingReview(
                                        booking._id
                                    );

                                return {
                                    bookingId:
                                        booking._id,

                                    review:
                                        data.success
                                            ? data.review
                                            : null,
                                };

                            } catch (error) {

                                console.error(
                                    `Fetch review error for booking ${booking._id}:`,
                                    error
                                );

                                return {
                                    bookingId:
                                        booking._id,

                                    review: null,
                                };
                            }
                        }
                    )
                );


            const reviewMap = {};

            reviewResults.forEach(
                ({
                    bookingId,
                    review,
                }) => {

                    reviewMap[
                        bookingId
                    ] = review;

                }
            );


            setReviewsByBooking(
                reviewMap
            );

        } catch (error) {

            console.error(
                "Fetch Booking Reviews Error:",
                error
            );
        }
    };


    // =====================================================
    // FETCH BOOKINGS
    // =====================================================

    const fetchBookings = async () => {

        try {

            setLoading(true);

            const data =
                await getMyBookings();

            if (data.success) {

                const bookingList =
                    Array.isArray(
                        data.bookings
                    )
                        ? data.bookings
                        : [];

                setBookings(
                    bookingList
                );

                await fetchBookingReviews(
                    bookingList
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
                error.response?.data
                    ?.message ||
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
                    prev.map(
                        (booking) =>
                            booking._id ===
                                bookingId
                                ? {
                                    ...booking,
                                    status:
                                        "cancelled",
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
                error.response?.data
                    ?.message ||
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
                        prev.map(
                            (booking) =>
                                booking._id ===
                                    bookingId
                                    ? {
                                        ...booking,

                                        bookingDate:
                                            data.booking
                                                ?.bookingDate ||
                                            newDate,

                                        bookingTime:
                                            data.booking
                                                ?.bookingTime ||
                                            newTime,

                                        status:
                                            data.booking
                                                ?.status ||
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
                    error.response?.data
                        ?.message ||
                    "Failed to reschedule booking.";

                toast.error(message);

            } finally {

                setActionLoading(null);

            }
        };


    // =====================================================
    // OPEN REVIEW
    // =====================================================

    const openReview = (
        booking
    ) => {

        const existingReview =
            reviewsByBooking[
            booking._id
            ];

        if (existingReview) {
            return;
        }

        setReviewOpenId(
            booking._id
        );

        setReviewRating(0);
        setReviewComment("");

    };


    // =====================================================
    // CLOSE REVIEW
    // =====================================================

    const closeReview = () => {

        setReviewOpenId(null);
        setReviewRating(0);
        setReviewComment("");

    };


    // =====================================================
    // SUBMIT REVIEW
    // =====================================================

    const handleSubmitReview =
        async (bookingId) => {

            if (
                reviewRating < 1 ||
                reviewRating > 5
            ) {

                toast.error(
                    "Please select a rating from 1 to 5."
                );

                return;
            }


            const trimmedComment =
                reviewComment.trim();


            if (
                trimmedComment.length < 2
            ) {

                toast.error(
                    "Review comment must be at least 2 characters."
                );

                return;
            }


            if (
                trimmedComment.length > 1000
            ) {

                toast.error(
                    "Review comment cannot exceed 1000 characters."
                );

                return;
            }


            try {

                setReviewLoadingId(
                    bookingId
                );


                const data =
                    await createReview(
                        bookingId,
                        reviewRating,
                        trimmedComment
                    );


                if (data.success) {

                    toast.success(
                        "Review submitted successfully."
                    );


                    setReviewsByBooking(
                        (prev) => ({
                            ...prev,

                            [bookingId]:
                                data.review,
                        })
                    );


                    closeReview();

                } else {

                    toast.error(
                        data.message ||
                        "Failed to submit review."
                    );

                }

            } catch (error) {

                console.error(
                    "Submit Review Error:",
                    error
                );

                const message =
                    error.response?.data
                        ?.message ||
                    "Failed to submit review.";

                toast.error(message);

            } finally {

                setReviewLoadingId(
                    null
                );

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
                booking?.professional
                    ?.user?.fullName ||
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


                                        const existingReview =
                                            reviewsByBooking[
                                            booking._id
                                            ];


                                        const isReviewLoading =
                                            reviewLoadingId ===
                                            booking._id;


                                        return (

                                            <div
                                                key={
                                                    booking._id
                                                }
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

                                                        {
                                                            booking.status
                                                        }

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
                                                                ₹
                                                                {booking.price ||
                                                                    0}
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
                                                            REVIEW
                                                    ================================================= */}

                                                {booking.status ===
                                                    "completed" && (

                                                        <div className="mt-5">

                                                            {existingReview ? (

                                                                /* =========================================
                                                                        EXISTING REVIEW
                                                                   ========================================= */

                                                                <div className="bg-green-50 border border-green-100 rounded-xl p-5">

                                                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                                                                        <div>

                                                                            <p className="text-sm font-medium text-green-700">
                                                                                Your Review
                                                                            </p>

                                                                            <div className="flex items-center gap-1 mt-2">

                                                                                {[1, 2, 3, 4, 5].map(
                                                                                    (
                                                                                        star
                                                                                    ) => (

                                                                                        <Star
                                                                                            key={
                                                                                                star
                                                                                            }
                                                                                            size={
                                                                                                18
                                                                                            }
                                                                                            className={
                                                                                                star <=
                                                                                                    existingReview.rating
                                                                                                    ? "fill-yellow-400 text-yellow-400"
                                                                                                    : "text-gray-300"
                                                                                            }
                                                                                        />

                                                                                    )
                                                                                )}

                                                                                <span className="ml-2 text-sm font-semibold text-gray-700">
                                                                                    {
                                                                                        existingReview.rating
                                                                                    }/5
                                                                                </span>

                                                                            </div>

                                                                        </div>

                                                                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-green-700">

                                                                            <CheckCircle2
                                                                                size={
                                                                                    17
                                                                                }
                                                                            />

                                                                            Reviewed

                                                                        </span>

                                                                    </div>


                                                                    <p className="mt-3 text-gray-700 leading-relaxed">
                                                                        {
                                                                            existingReview.comment
                                                                        }
                                                                    </p>

                                                                </div>

                                                            ) : (

                                                                /* =========================================
                                                                        REVIEW ACTION / FORM
                                                                   ========================================= */

                                                                <>
                                                                    {reviewOpenId !==
                                                                        booking._id && (

                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    openReview(
                                                                                        booking
                                                                                    )
                                                                                }
                                                                                className="px-5 py-2.5 bg-yellow-500 text-white rounded-xl font-semibold hover:bg-yellow-600 transition flex items-center gap-2"
                                                                            >

                                                                                <Star
                                                                                    size={
                                                                                        17
                                                                                    }
                                                                                />

                                                                                Rate & Review

                                                                            </button>

                                                                        )}


                                                                    {reviewOpenId ===
                                                                        booking._id && (

                                                                            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-5">

                                                                                <div className="flex items-center justify-between gap-3 mb-4">

                                                                                    <h3 className="font-semibold text-lg text-gray-800">
                                                                                        Rate & Review
                                                                                    </h3>

                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={
                                                                                            closeReview
                                                                                        }
                                                                                        disabled={
                                                                                            isReviewLoading
                                                                                        }
                                                                                        className="text-gray-500 hover:text-gray-800 disabled:opacity-50"
                                                                                    >
                                                                                        <XCircle
                                                                                            size={
                                                                                                22
                                                                                            }
                                                                                        />
                                                                                    </button>

                                                                                </div>


                                                                                {/* RATING */}

                                                                                <div>

                                                                                    <p className="text-sm font-medium text-gray-700 mb-2">
                                                                                        Your Rating
                                                                                    </p>

                                                                                    <div className="flex items-center gap-2">

                                                                                        {[1, 2, 3, 4, 5].map(
                                                                                            (
                                                                                                star
                                                                                            ) => (

                                                                                                <button
                                                                                                    key={
                                                                                                        star
                                                                                                    }
                                                                                                    type="button"
                                                                                                    onClick={() =>
                                                                                                        setReviewRating(
                                                                                                            star
                                                                                                        )
                                                                                                    }
                                                                                                    disabled={
                                                                                                        isReviewLoading
                                                                                                    }
                                                                                                    aria-label={`Rate ${star} out of 5`}
                                                                                                    className="transition-transform hover:scale-110 disabled:cursor-not-allowed"
                                                                                                >

                                                                                                    <Star
                                                                                                        size={
                                                                                                            30
                                                                                                        }
                                                                                                        className={
                                                                                                            star <=
                                                                                                                reviewRating
                                                                                                                ? "fill-yellow-400 text-yellow-400"
                                                                                                                : "text-gray-300 hover:text-yellow-400"
                                                                                                        }
                                                                                                    />

                                                                                                </button>

                                                                                            )
                                                                                        )}

                                                                                    </div>

                                                                                    <p className="text-xs text-gray-500 mt-2">

                                                                                        {reviewRating ===
                                                                                            0
                                                                                            ? "Select a rating"
                                                                                            : `${reviewRating} out of 5`}

                                                                                    </p>

                                                                                </div>


                                                                                {/* COMMENT */}

                                                                                <div className="mt-5">

                                                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                                        Your Review
                                                                                    </label>

                                                                                    <textarea
                                                                                        value={
                                                                                            reviewComment
                                                                                        }
                                                                                        onChange={(
                                                                                            e
                                                                                        ) =>
                                                                                            setReviewComment(
                                                                                                e
                                                                                                    .target
                                                                                                    .value
                                                                                            )
                                                                                        }
                                                                                        maxLength={
                                                                                            1000
                                                                                        }
                                                                                        rows={
                                                                                            4
                                                                                        }
                                                                                        disabled={
                                                                                            isReviewLoading
                                                                                        }
                                                                                        placeholder="Share your experience with this service..."
                                                                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400 disabled:bg-gray-100"
                                                                                    />

                                                                                    <div className="text-right text-xs text-gray-500 mt-1">
                                                                                        {
                                                                                            reviewComment.length
                                                                                        }
                                                                                        /1000
                                                                                    </div>

                                                                                </div>


                                                                                {/* ACTIONS */}

                                                                                <div className="flex justify-end gap-3 mt-4">

                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={
                                                                                            closeReview
                                                                                        }
                                                                                        disabled={
                                                                                            isReviewLoading
                                                                                        }
                                                                                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition disabled:opacity-50"
                                                                                    >
                                                                                        Cancel
                                                                                    </button>


                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() =>
                                                                                            handleSubmitReview(
                                                                                                booking._id
                                                                                            )
                                                                                        }
                                                                                        disabled={
                                                                                            isReviewLoading
                                                                                        }
                                                                                        className="px-5 py-2 bg-yellow-500 text-white rounded-xl font-semibold hover:bg-yellow-600 transition disabled:bg-gray-400 flex items-center gap-2"
                                                                                    >

                                                                                        {isReviewLoading ? (

                                                                                            <Loader2
                                                                                                size={
                                                                                                    17
                                                                                                }
                                                                                                className="animate-spin"
                                                                                            />

                                                                                        ) : (

                                                                                            <Star
                                                                                                size={
                                                                                                    17
                                                                                                }
                                                                                            />

                                                                                        )}

                                                                                        {isReviewLoading
                                                                                            ? "Submitting..."
                                                                                            : "Submit Review"}

                                                                                    </button>

                                                                                </div>

                                                                            </div>
                                                                        )}
                                                                </>
                                                            )}

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
                                                                        value={
                                                                            newDate
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setNewDate(
                                                                                e
                                                                                    .target
                                                                                    .value
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
                                                                        value={
                                                                            newTime
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setNewTime(
                                                                                e
                                                                                    .target
                                                                                    .value
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
                                                                                size={
                                                                                    17
                                                                                }
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
                                                                null ||
                                                                reviewOpenId !==
                                                                null
                                                            }
                                                            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                                                        >

                                                            <RefreshCw
                                                                size={
                                                                    17
                                                                }
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
                                                                isActionLoading ||
                                                                reviewOpenId !==
                                                                null
                                                            }
                                                            className="px-5 py-2.5 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                                                        >

                                                            {actionLoading ===
                                                                `cancel-${booking._id}` ? (

                                                                <Loader2
                                                                    size={
                                                                        17
                                                                    }
                                                                    className="animate-spin"
                                                                />

                                                            ) : (

                                                                <XCircle
                                                                    size={
                                                                        17
                                                                    }
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