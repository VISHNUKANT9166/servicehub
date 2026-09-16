import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

import DashboardLayout from "../components/Dashboard/DashboardLayout";
import DashboardSidebar from "../components/Dashboard/DashboardSidebar";

import { useEffect, useState } from "react";

import { getMyServices } from "../services/serviceService";
import {
    getProfessionalBookingStats,
} from "../services/bookingService";

import {
    getProfessionalReviews,
} from "../services/reviewService";

import {
    BriefcaseBusiness,
    CalendarDays,
    Clock,
    CheckCircle,
    Star,
    Loader2,
} from "lucide-react";


function ProfessionalDashboard() {

    // =====================================================
    // SERVICES
    // =====================================================

    const [services, setServices] =
        useState([]);


    // =====================================================
    // BOOKING STATISTICS
    // =====================================================

    const [bookingStats, setBookingStats] =
        useState({
            total: 0,
            pending: 0,
            completed: 0,
        });


    // =====================================================
    // REVIEWS
    // =====================================================

    const [reviews, setReviews] =
        useState([]);

    const [reviewsLoading, setReviewsLoading] =
        useState(true);


    // =====================================================
    // FETCH DASHBOARD DATA
    // =====================================================

    useEffect(() => {

        const fetchDashboardData =
            async () => {

                try {

                    // -------------------------------------------------
                    // Get professional services
                    // -------------------------------------------------

                    const servicesData =
                        await getMyServices();

                    let professionalServices = [];

                    if (
                        servicesData.success
                    ) {

                        professionalServices =
                            Array.isArray(
                                servicesData.services
                            )
                                ? servicesData.services
                                : [];

                        setServices(
                            professionalServices
                        );

                    }


                    // -------------------------------------------------
                    // Get professional booking statistics
                    // -------------------------------------------------

                    const bookingData =
                        await getProfessionalBookingStats();

                    if (
                        bookingData.success
                    ) {

                        setBookingStats(
                            bookingData.stats
                        );

                    }


                    // -------------------------------------------------
                    // Get professional reviews
                    // -------------------------------------------------

                    /*
                     * The Service response contains the professional
                     * reference. Since a professional must have a
                     * service before receiving a booking/review,
                     * the professional ID can safely be obtained
                     * from the professional's service.
                     */

                    const professional =
                        professionalServices[0]
                            ?.professional;

                    const professionalId =
                        professional?._id ||
                        professional;


                    if (
                        professionalId
                    ) {

                        try {

                            const reviewData =
                                await getProfessionalReviews(
                                    professionalId
                                );


                            if (
                                reviewData.success
                            ) {

                                setReviews(
                                    Array.isArray(
                                        reviewData.reviews
                                    )
                                        ? reviewData.reviews
                                        : []
                                );

                            } else {

                                setReviews([]);

                            }

                        } catch (
                        reviewError
                        ) {

                            console.error(
                                "Professional Reviews Error:",
                                reviewError
                            );

                            setReviews([]);

                        }

                    } else {

                        setReviews([]);

                    }

                } catch (error) {

                    console.error(
                        "Professional Dashboard Error:",
                        error
                    );

                } finally {

                    setReviewsLoading(
                        false
                    );

                }

            };


        fetchDashboardData();

    }, []);


    // =====================================================
    // PROFESSIONAL RATING
    // =====================================================

    const professionalRating =
        reviews.length > 0
            ? (
                reviews.reduce(
                    (
                        total,
                        review
                    ) =>
                        total +
                        Number(
                            review.rating || 0
                        ),
                    0
                ) /
                reviews.length
            ).toFixed(1)
            : "0.0";


    // =====================================================
    // FORMAT REVIEW DATE
    // =====================================================

    const formatReviewDate =
        (date) => {

            if (!date) {
                return "";
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
    // REVIEW STARS
    // =====================================================

    const renderStars =
        (rating) => {

            const numericRating =
                Number(rating) || 0;

            return (
                <div className="flex items-center gap-1">

                    {[1, 2, 3, 4, 5].map(
                        (star) => (

                            <Star
                                key={star}
                                size={17}
                                className={
                                    star <=
                                        numericRating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-300"
                                }
                            />

                        )
                    )}

                </div>
            );

        };


    // =====================================================
    // RENDER
    // =====================================================

    return (
        <>
            <Navbar />

            <DashboardLayout
                sidebar={
                    <DashboardSidebar />
                }
            >

                {/* =================================================
                            HEADER
                    ================================================= */}

                <div className="bg-white rounded-2xl shadow-lg p-6">

                    <h1 className="text-3xl font-bold">
                        Professional Dashboard 👋
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Manage your services and bookings from here.
                    </p>

                </div>


                {/* =================================================
                            STATISTICS
                    ================================================= */}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">


                    {/* =================================================
                                TOTAL SERVICES
                        ================================================= */}

                    <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between">

                        <div>

                            <p className="text-gray-500">
                                Total Services
                            </p>

                            <h2 className="text-3xl font-bold mt-2">
                                {services.length}
                            </h2>

                        </div>

                        <div className="w-14 h-14 rounded-xl bg-blue-500 flex items-center justify-center">

                            <BriefcaseBusiness
                                size={28}
                                className="text-white"
                            />

                        </div>

                    </div>


                    {/* =================================================
                                TOTAL BOOKINGS
                        ================================================= */}

                    <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between">

                        <div>

                            <p className="text-gray-500">
                                Total Bookings
                            </p>

                            <h2 className="text-3xl font-bold mt-2">
                                {bookingStats.total}
                            </h2>

                        </div>

                        <div className="w-14 h-14 rounded-xl bg-purple-500 flex items-center justify-center">

                            <CalendarDays
                                size={28}
                                className="text-white"
                            />

                        </div>

                    </div>


                    {/* =================================================
                                PENDING BOOKINGS
                        ================================================= */}

                    <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between">

                        <div>

                            <p className="text-gray-500">
                                Pending
                            </p>

                            <h2 className="text-3xl font-bold mt-2">
                                {bookingStats.pending}
                            </h2>

                        </div>

                        <div className="w-14 h-14 rounded-xl bg-yellow-500 flex items-center justify-center">

                            <Clock
                                size={28}
                                className="text-white"
                            />

                        </div>

                    </div>


                    {/* =================================================
                                COMPLETED BOOKINGS
                        ================================================= */}

                    <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between">

                        <div>

                            <p className="text-gray-500">
                                Completed
                            </p>

                            <h2 className="text-3xl font-bold mt-2">
                                {bookingStats.completed}
                            </h2>

                        </div>

                        <div className="w-14 h-14 rounded-xl bg-green-500 flex items-center justify-center">

                            <CheckCircle
                                size={28}
                                className="text-white"
                            />

                        </div>

                    </div>

                </div>


                {/* =================================================
                            RATING SUMMARY
                    ================================================= */}

                <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                        <div>

                            <h2 className="text-2xl font-bold text-gray-900">
                                Your Ratings & Reviews
                            </h2>

                            <p className="text-gray-500 mt-1">
                                See what customers think about your services.
                            </p>

                        </div>


                        <div className="flex items-center gap-3">

                            <Star
                                size={25}
                                className="fill-yellow-400 text-yellow-400"
                            />

                            <div>

                                <p className="text-2xl font-bold text-gray-900">
                                    {professionalRating}
                                </p>

                                <p className="text-sm text-gray-500">
                                    {reviews.length}{" "}
                                    {reviews.length === 1
                                        ? "Review"
                                        : "Reviews"}
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                                REVIEWS LOADING
                        ================================================= */}

                    {reviewsLoading && (

                        <div className="flex justify-center items-center py-10">

                            <Loader2
                                size={30}
                                className="animate-spin text-blue-600"
                            />

                        </div>

                    )}


                    {/* =================================================
                                NO REVIEWS
                        ================================================= */}

                    {!reviewsLoading &&
                        reviews.length === 0 && (

                            <div className="bg-gray-50 rounded-xl p-8 text-center mt-5">

                                <Star
                                    size={38}
                                    className="mx-auto text-gray-300 mb-3"
                                />

                                <h3 className="font-semibold text-gray-700">
                                    No reviews yet
                                </h3>

                                <p className="text-gray-500 text-sm mt-1">
                                    Customer reviews will appear here after completed bookings.
                                </p>

                            </div>

                        )}


                    {/* =================================================
                                REVIEWS LIST
                        ================================================= */}

                    {!reviewsLoading &&
                        reviews.length > 0 && (

                            <div className="space-y-4 mt-6">

                                {reviews.map(
                                    (review) => (

                                        <div
                                            key={
                                                review._id
                                            }
                                            className="border border-gray-100 rounded-xl p-5 bg-gray-50"
                                        >

                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">


                                                {/* CUSTOMER */}

                                                <div className="flex items-center gap-3">

                                                    {review.user
                                                        ?.profileImage ? (

                                                        <img
                                                            src={
                                                                review.user
                                                                    .profileImage
                                                            }
                                                            alt={
                                                                review.user
                                                                    ?.fullName ||
                                                                "Customer"
                                                            }
                                                            className="w-10 h-10 rounded-full object-cover"
                                                        />

                                                    ) : (

                                                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">

                                                            {(
                                                                review.user
                                                                    ?.fullName ||
                                                                "Customer"
                                                            )
                                                                .charAt(
                                                                    0
                                                                )
                                                                .toUpperCase()}

                                                        </div>

                                                    )}


                                                    <div>

                                                        <p className="font-semibold text-gray-900">
                                                            {
                                                                review.user
                                                                    ?.fullName ||
                                                                "Customer"
                                                            }
                                                        </p>

                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                            {formatReviewDate(
                                                                review.createdAt
                                                            )}
                                                        </p>

                                                    </div>

                                                </div>


                                                {/* RATING */}

                                                {renderStars(
                                                    review.rating
                                                )}

                                            </div>


                                            {/* SERVICE */}

                                            {review.service
                                                ?.title && (

                                                    <p className="text-xs text-blue-600 font-medium mt-3">
                                                        Service:{" "}
                                                        {
                                                            review.service
                                                                .title
                                                        }
                                                    </p>

                                                )}


                                            {/* COMMENT */}

                                            <p className="text-gray-700 mt-3 leading-6">
                                                {
                                                    review.comment
                                                }
                                            </p>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                </div>

            </DashboardLayout>

            <Footer />
        </>
    );
}

export default ProfessionalDashboard;