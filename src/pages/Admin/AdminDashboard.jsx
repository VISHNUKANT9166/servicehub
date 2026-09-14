import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";

import {
    getAdminDashboardStats,
    getProfessionalApplications,
} from "../../services/adminService";


// =====================================================
// CONSTANTS
// =====================================================

const APPLICATION_STATUSES = [
    {
        value: "pending",
        label: "Pending Applications",
    },
    {
        value: "approved",
        label: "Approved Professionals",
    },
    {
        value: "rejected",
        label: "Rejected Applications",
    },
    {
        value: "",
        label: "All Applications",
    },
];

const APPLICATION_LIMIT = 5;


// =====================================================
// COMPONENT
// =====================================================

function AdminDashboard() {

    // =====================================================
    // DASHBOARD STATS STATE
    // =====================================================

    const [stats, setStats] = useState(null);

    const [statsLoading, setStatsLoading] =
        useState(true);

    const [statsError, setStatsError] =
        useState("");


    // =====================================================
    // APPLICATION STATE
    // =====================================================

    const [applications, setApplications] =
        useState([]);

    const [applicationsLoading, setApplicationsLoading] =
        useState(true);

    const [applicationsError, setApplicationsError] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("pending");


    // =====================================================
    // FETCH DASHBOARD STATS
    // =====================================================

    const fetchStats = useCallback(async () => {

        try {

            setStatsLoading(true);

            setStatsError("");


            const response =
                await getAdminDashboardStats();


            if (
                response?.success &&
                response?.stats
            ) {

                setStats(response.stats);

            } else {

                setStats(null);

                setStatsError(
                    "Unable to load dashboard statistics."
                );

            }

        } catch (error) {

            console.error(
                "Fetch Admin Dashboard Stats Error:",
                error
            );


            setStats(null);

            setStatsError(
                error?.response?.data?.message ||
                "Unable to load dashboard statistics."
            );

        } finally {

            setStatsLoading(false);

        }

    }, []);


    // =====================================================
    // FETCH APPLICATIONS
    // =====================================================

    const fetchApplications = useCallback(
        async (status = statusFilter) => {

            try {

                setApplicationsLoading(true);

                setApplicationsError("");


                const response =
                    await getProfessionalApplications(
                        status,
                        1,
                        APPLICATION_LIMIT
                    );


                setApplications(
                    Array.isArray(
                        response?.applications
                    )
                        ? response.applications
                        : []
                );

            } catch (error) {

                console.error(
                    "Fetch Admin Applications Error:",
                    error
                );


                setApplications([]);

                setApplicationsError(
                    error?.response?.data?.message ||
                    "Unable to load professional applications."
                );

            } finally {

                setApplicationsLoading(false);

            }

        },
        [statusFilter]
    );


    // =====================================================
    // INITIAL DASHBOARD LOAD
    // =====================================================

    useEffect(() => {

        fetchStats();

    }, [fetchStats]);


    // =====================================================
    // APPLICATION LOAD
    // =====================================================

    useEffect(() => {

        fetchApplications();

    }, [fetchApplications]);


    // =====================================================
    // STATUS FILTER CHANGE
    // =====================================================

    const handleStatusChange = (event) => {

        setStatusFilter(
            event.target.value
        );

    };


    // =====================================================
    // REFRESH DASHBOARD
    // =====================================================

    const handleRefresh = async () => {

        await Promise.all([
            fetchStats(),
            fetchApplications(statusFilter),
        ]);

    };


    // =====================================================
    // FORMAT NUMBER
    // =====================================================

    const formatNumber = (value) => {

        if (
            typeof value !== "number" ||
            !Number.isFinite(value)
        ) {

            return "—";

        }


        return value.toLocaleString(
            "en-IN"
        );
    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "Not available";
        }


        const parsedDate =
            new Date(date);


        if (
            Number.isNaN(
                parsedDate.getTime()
            )
        ) {

            return "Not available";

        }


        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    };


    // =====================================================
    // STATUS BADGE
    // =====================================================

    const getStatusBadge = (status) => {

        const styles = {

            pending:
                "bg-yellow-100 text-yellow-800",

            approved:
                "bg-green-100 text-green-700",

            rejected:
                "bg-red-100 text-red-700",

        };


        return (

            <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${styles[status] ||
                    "bg-gray-100 text-gray-700"
                    }`}
            >

                {status || "Unknown"}

            </span>

        );
    };


    // =====================================================
    // STATS CARD DATA
    // =====================================================

    const statCards = [

        {
            title: "Total Users",
            value: stats?.totalUsers,
            description: "Registered user accounts",
            icon: "U",
        },

        {
            title: "Professionals",
            value: stats?.totalProfessionals,
            description: "Approved professionals",
            icon: "P",
        },

        {
            title: "Pending Applications",
            value: stats?.pendingApplications,
            description: "Awaiting review",
            icon: "P",
        },

        {
            title: "Approved Applications",
            value: stats?.approvedApplications,
            description: "Successfully approved",
            icon: "A",
        },

        {
            title: "Rejected Applications",
            value: stats?.rejectedApplications,
            description: "Rejected applications",
            icon: "R",
        },

        {
            title: "Total Services",
            value: stats?.totalServices,
            description: "Services on platform",
            icon: "S",
        },

        {
            title: "Total Bookings",
            value: stats?.totalBookings,
            description: "Platform bookings",
            icon: "B",
        },

    ];


    // =====================================================
    // UI
    // =====================================================

    return (
        <>
            <Navbar />


            <main className="min-h-screen bg-gray-50">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">


                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

                        <div>

                            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">

                                Admin Dashboard

                            </h1>


                            <p className="text-gray-500 mt-2">

                                Monitor platform activity and manage professional applications.

                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={handleRefresh}
                            disabled={
                                statsLoading ||
                                applicationsLoading
                            }
                            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >

                            {(statsLoading ||
                                applicationsLoading) ? (

                                <>
                                    <span className="w-4 h-4 border-2 border-blue-200 border-t-white rounded-full animate-spin" />

                                    Refreshing...

                                </>

                            ) : (

                                "Refresh Dashboard"

                            )}

                        </button>

                    </div>


                    {/* =================================================
                        STATS ERROR
                    ================================================= */}

                    {statsError && (

                        <div
                            className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4"
                            role="alert"
                        >

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                                <p>
                                    {statsError}
                                </p>


                                <button
                                    type="button"
                                    onClick={fetchStats}
                                    disabled={statsLoading}
                                    className="font-semibold underline hover:no-underline disabled:opacity-50"
                                >

                                    Try again

                                </button>

                            </div>

                        </div>

                    )}


                    {/* =================================================
                        DASHBOARD STATISTICS
                    ================================================= */}

                    <section aria-labelledby="dashboard-statistics">

                        <div className="flex items-center justify-between mb-4">

                            <h2
                                id="dashboard-statistics"
                                className="text-xl font-bold text-gray-900"
                            >

                                Platform Overview

                            </h2>

                        </div>


                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                            {statCards.map(
                                (card) => (

                                    <div
                                        key={card.title}
                                        className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5"
                                    >

                                        <div className="flex items-start justify-between gap-4">

                                            <div>

                                                <p className="text-sm font-medium text-gray-500">

                                                    {card.title}

                                                </p>


                                                <p className="text-3xl font-bold text-gray-900 mt-2">

                                                    {statsLoading
                                                        ? "—"
                                                        : formatNumber(
                                                            card.value
                                                        )}

                                                </p>

                                            </div>


                                            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">

                                                {card.icon}

                                            </div>

                                        </div>


                                        <p className="text-sm text-gray-500 mt-4">

                                            {card.description}

                                        </p>

                                    </div>

                                )
                            )}

                        </div>

                    </section>


                    {/* =================================================
                        APPLICATIONS SECTION
                    ================================================= */}

                    <section
                        aria-labelledby="professional-applications"
                        className="mt-10"
                    >

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">

                            <div>

                                <h2
                                    id="professional-applications"
                                    className="text-xl font-bold text-gray-900"
                                >

                                    Professional Applications

                                </h2>


                                <p className="text-sm text-gray-500 mt-1">

                                    Review recent professional applications.

                                </p>

                            </div>


                            <Link
                                to="/admin/professionals"
                                className="inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                            >

                                Manage Applications

                            </Link>

                        </div>


                        {/* =================================================
                            FILTER
                        ================================================= */}

                        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 mb-5">

                            <label
                                htmlFor="application-status"
                                className="block text-sm font-medium text-gray-700 mb-2"
                            >

                                Application Status

                            </label>


                            <select
                                id="application-status"
                                value={statusFilter}
                                onChange={
                                    handleStatusChange
                                }
                                className="w-full sm:w-auto min-w-64 border border-gray-300 rounded-xl px-4 py-3 bg-white text-gray-700 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >

                                {APPLICATION_STATUSES.map(
                                    (status) => (

                                        <option
                                            key={
                                                status.value ||
                                                "all"
                                            }
                                            value={
                                                status.value
                                            }
                                        >

                                            {status.label}

                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* =================================================
                            APPLICATION ERROR
                        ================================================= */}

                        {applicationsError && (

                            <div
                                className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4"
                                role="alert"
                            >

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                                    <p>
                                        {applicationsError}
                                    </p>


                                    <button
                                        type="button"
                                        onClick={() =>
                                            fetchApplications(
                                                statusFilter
                                            )
                                        }
                                        disabled={
                                            applicationsLoading
                                        }
                                        className="font-semibold underline hover:no-underline disabled:opacity-50"
                                    >

                                        Try again

                                    </button>

                                </div>

                            </div>

                        )}


                        {/* =================================================
                            APPLICATION LOADING
                        ================================================= */}

                        {applicationsLoading ? (

                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">

                                <div className="w-9 h-9 mx-auto border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />

                                <p className="text-gray-500 mt-4">

                                    Loading applications...

                                </p>

                            </div>

                        ) : applications.length === 0 ? (

                            /* =================================================
                               EMPTY STATE
                            ================================================= */

                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">

                                <div className="w-14 h-14 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-2xl">

                                    ✓

                                </div>


                                <h3 className="text-xl font-bold text-gray-900 mt-4">

                                    No applications found

                                </h3>


                                <p className="text-gray-500 mt-2">

                                    There are no applications matching the selected status.

                                </p>

                            </div>

                        ) : (

                            /* =================================================
                               APPLICATION LIST
                            ================================================= */

                            <div className="space-y-4">

                                {applications.map(
                                    (application) => (

                                        <article
                                            key={
                                                application._id
                                            }
                                            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6"
                                        >

                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">


                                                {/* APPLICANT */}

                                                <div className="flex items-center gap-4 min-w-0">

                                                    {application.profileImage ? (

                                                        <img
                                                            src={
                                                                application.profileImage
                                                            }
                                                            alt={
                                                                application.user
                                                                    ?.fullName
                                                                    ? `${application.user.fullName} profile`
                                                                    : "Professional profile"
                                                            }
                                                            className="w-14 h-14 rounded-full object-cover border border-gray-200 shrink-0"
                                                        />

                                                    ) : (

                                                        <div
                                                            className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-600 shrink-0"
                                                            aria-hidden="true"
                                                        >

                                                            {application.user
                                                                ?.fullName
                                                                ?.charAt(
                                                                    0
                                                                )
                                                                ?.toUpperCase() ||
                                                                "U"}

                                                        </div>

                                                    )}


                                                    <div className="min-w-0">

                                                        <h3 className="font-bold text-gray-900 truncate">

                                                            {application.user
                                                                ?.fullName ||
                                                                "Unknown User"}

                                                        </h3>


                                                        <p className="text-sm text-gray-500 truncate mt-1">

                                                            {application.user
                                                                ?.email ||
                                                                "No email"}

                                                        </p>


                                                        <p className="text-sm text-gray-500 mt-1">

                                                            {application.profession ||
                                                                "Profession not provided"}

                                                        </p>

                                                    </div>

                                                </div>


                                                {/* DETAILS */}

                                                <div className="flex flex-wrap items-center gap-3">

                                                    <div className="text-sm text-gray-500">

                                                        Applied{" "}

                                                        <span className="font-medium text-gray-700">

                                                            {formatDate(
                                                                application.createdAt
                                                            )}

                                                        </span>

                                                    </div>


                                                    {getStatusBadge(
                                                        application.applicationStatus
                                                    )}

                                                </div>

                                            </div>


                                            {/* APPLICATION DETAILS */}

                                            <div className="grid sm:grid-cols-3 gap-4 mt-5 pt-5 border-t border-gray-100">

                                                <div>

                                                    <p className="text-xs uppercase tracking-wide text-gray-400">

                                                        Category

                                                    </p>

                                                    <p className="font-medium text-gray-900 mt-1">

                                                        {application.category ||
                                                            "Not provided"}

                                                    </p>

                                                </div>


                                                <div>

                                                    <p className="text-xs uppercase tracking-wide text-gray-400">

                                                        Experience

                                                    </p>

                                                    <p className="font-medium text-gray-900 mt-1">

                                                        {application.experience ??
                                                            0}{" "}

                                                        {Number(
                                                            application.experience
                                                        ) === 1
                                                            ? "year"
                                                            : "years"}

                                                    </p>

                                                </div>


                                                <div>

                                                    <p className="text-xs uppercase tracking-wide text-gray-400">

                                                        Starting Charges

                                                    </p>

                                                    <p className="font-medium text-gray-900 mt-1">

                                                        ₹
                                                        {Number(
                                                            application.startingCharges ??
                                                            0
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}

                                                    </p>

                                                </div>

                                            </div>

                                        </article>

                                    )
                                )}


                                {/* =================================================
                                    VIEW ALL
                                ================================================= */}

                                <div className="flex justify-center pt-2">

                                    <Link
                                        to="/admin/professionals"
                                        className="text-blue-600 font-semibold hover:text-blue-700 hover:underline"
                                    >

                                        View All Professional Applications →

                                    </Link>

                                </div>

                            </div>

                        )}

                    </section>

                </div>

            </main>


            <Footer />
        </>
    );
}


export default AdminDashboard;