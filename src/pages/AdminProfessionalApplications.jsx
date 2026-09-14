import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
    getProfessionalApplications,
    approveProfessionalApplication,
    rejectProfessionalApplication,
} from "../services/adminService";


// =====================================================
// CONSTANTS
// =====================================================

const APPLICATION_STATUSES = [
    "pending",
    "approved",
    "rejected",
];

const PAGE_LIMIT = 10;


// =====================================================
// COMPONENT
// =====================================================

function AdminProfessionalApplications() {

    // =====================================================
    // APPLICATION STATE
    // =====================================================

    const [applications, setApplications] = useState([]);

    const [loading, setLoading] = useState(true);

    const [errorMessage, setErrorMessage] = useState("");

    const [actionLoading, setActionLoading] = useState(null);

    const [statusFilter, setStatusFilter] =
        useState("pending");

    const [pagination, setPagination] =
        useState(null);

    const [currentPage, setCurrentPage] =
        useState(1);


    // =====================================================
    // REJECT MODAL STATE
    // =====================================================

    const [showRejectModal, setShowRejectModal] =
        useState(false);

    const [selectedApplication, setSelectedApplication] =
        useState(null);

    const [rejectionReason, setRejectionReason] =
        useState("");


    // =====================================================
    // LOAD APPLICATIONS
    // =====================================================

    const loadApplications = useCallback(
        async (
            status = statusFilter,
            page = currentPage
        ) => {

            try {

                setLoading(true);

                setErrorMessage("");

                const response =
                    await getProfessionalApplications(
                        status,
                        page,
                        PAGE_LIMIT
                    );


                const fetchedApplications =
                    Array.isArray(response?.applications)
                        ? response.applications
                        : [];


                setApplications(
                    fetchedApplications
                );


                setPagination(
                    response?.pagination || null
                );

            } catch (error) {

                console.error(
                    "Load Professional Applications Error:",
                    error
                );


                setApplications([]);

                setPagination(null);


                setErrorMessage(
                    error?.response?.data?.message ||
                    "Unable to load professional applications."
                );

            } finally {

                setLoading(false);

            }
        },
        [statusFilter, currentPage]
    );


    // =====================================================
    // INITIAL LOAD / FILTER / PAGINATION
    // =====================================================

    useEffect(() => {

        loadApplications();

    }, [loadApplications]);


    // =====================================================
    // HANDLE STATUS FILTER
    // =====================================================

    const handleStatusChange = (status) => {

        if (status === statusFilter) {
            return;
        }


        setStatusFilter(status);

        setCurrentPage(1);

    };


    // =====================================================
    // HANDLE PAGE CHANGE
    // =====================================================

    const handlePageChange = (page) => {

        if (loading) {
            return;
        }


        if (page < 1) {
            return;
        }


        const totalPages =
            pagination?.totalPages || 1;


        if (page > totalPages) {
            return;
        }


        setCurrentPage(page);

    };


    // =====================================================
    // REFRESH
    // =====================================================

    const handleRefresh = () => {

        loadApplications(
            statusFilter,
            currentPage
        );

    };


    // =====================================================
    // APPROVE APPLICATION
    // =====================================================

    const handleApprove = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to approve this professional application?"
        );


        if (!confirmed) {
            return;
        }


        try {

            setActionLoading(id);


            await approveProfessionalApplication(id);


            toast.success(
                "Professional application approved successfully."
            );


            /*
             * Reload the current page after approval.
             *
             * If the approved application was the last item
             * on the current page, the backend may return an
             * empty page. In that case, move to the previous page.
             */

            const response =
                await getProfessionalApplications(
                    statusFilter,
                    currentPage,
                    PAGE_LIMIT
                );


            const updatedApplications =
                Array.isArray(response?.applications)
                    ? response.applications
                    : [];


            const updatedPagination =
                response?.pagination || null;


            if (
                updatedApplications.length === 0 &&
                currentPage > 1
            ) {

                setCurrentPage(
                    currentPage - 1
                );

            } else {

                setApplications(
                    updatedApplications
                );

                setPagination(
                    updatedPagination
                );

            }

        } catch (error) {

            console.error(
                "Approve Professional Application Error:",
                error
            );


            toast.error(
                error?.response?.data?.message ||
                "Unable to approve application."
            );

        } finally {

            setActionLoading(null);

        }
    };


    // =====================================================
    // OPEN REJECT MODAL
    // =====================================================

    const openRejectModal = (application) => {

        if (actionLoading) {
            return;
        }


        setSelectedApplication(
            application
        );

        setRejectionReason("");

        setShowRejectModal(true);

    };


    // =====================================================
    // CLOSE REJECT MODAL
    // =====================================================

    const closeRejectModal = () => {

        if (actionLoading) {
            return;
        }


        setShowRejectModal(false);

        setSelectedApplication(null);

        setRejectionReason("");

    };


    // =====================================================
    // CONFIRM REJECTION
    // =====================================================

    const handleReject = async () => {

        if (!selectedApplication) {
            return;
        }


        const normalizedReason =
            rejectionReason.trim();


        if (!normalizedReason) {

            toast.error(
                "Rejection reason is required."
            );

            return;
        }


        try {

            setActionLoading(
                selectedApplication._id
            );


            await rejectProfessionalApplication(
                selectedApplication._id,
                normalizedReason
            );


            toast.success(
                "Professional application rejected successfully."
            );


            setShowRejectModal(false);

            setSelectedApplication(null);

            setRejectionReason("");


            /*
             * Reload current page after rejection.
             */

            const response =
                await getProfessionalApplications(
                    statusFilter,
                    currentPage,
                    PAGE_LIMIT
                );


            const updatedApplications =
                Array.isArray(response?.applications)
                    ? response.applications
                    : [];


            const updatedPagination =
                response?.pagination || null;


            if (
                updatedApplications.length === 0 &&
                currentPage > 1
            ) {

                setCurrentPage(
                    currentPage - 1
                );

            } else {

                setApplications(
                    updatedApplications
                );

                setPagination(
                    updatedPagination
                );

            }

        } catch (error) {

            console.error(
                "Reject Professional Application Error:",
                error
            );


            toast.error(
                error?.response?.data?.message ||
                "Unable to reject application."
            );

        } finally {

            setActionLoading(null);

        }
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

        const statusStyles = {

            pending:
                "bg-yellow-100 text-yellow-800",

            approved:
                "bg-green-100 text-green-700",

            rejected:
                "bg-red-100 text-red-700",

        };


        return (

            <span
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold capitalize ${statusStyles[status] ||
                    "bg-gray-100 text-gray-700"
                    }`}
            >

                {status || "Unknown"}

            </span>

        );
    };


    // =====================================================
    // LOADING STATE
    // =====================================================

    if (loading && applications.length === 0) {

        return (

            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">

                <div
                    className="text-center"
                    role="status"
                    aria-live="polite"
                >

                    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />

                    <h2 className="text-xl font-semibold text-gray-900 mt-5">

                        Loading applications...

                    </h2>

                    <p className="text-gray-500 mt-2">

                        Please wait while we fetch the professional applications.

                    </p>

                </div>

            </div>
        );
    }


    // =====================================================
    // MAIN UI
    // =====================================================

    return (

        <div className="min-h-screen bg-gray-50">


            {/* =================================================
                HEADER
            ================================================= */}

            <header className="bg-blue-600 text-white">

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                        <div>

                            <h1 className="text-3xl sm:text-4xl font-bold">

                                Professional Applications

                            </h1>

                            <p className="text-blue-100 mt-2">

                                Review and manage professional applications.

                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={handleRefresh}
                            disabled={loading}
                            className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-5 py-3 rounded-xl font-semibold hover:bg-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >

                            {loading ? (

                                <>
                                    <span className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />

                                    Refreshing...

                                </>

                            ) : (

                                "Refresh"

                            )}

                        </button>

                    </div>

                </div>

            </header>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


                {/* =================================================
                    ERROR MESSAGE
                ================================================= */}

                {errorMessage && (

                    <div
                        className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4"
                        role="alert"
                    >

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                            <p>

                                {errorMessage}

                            </p>


                            <button
                                type="button"
                                onClick={handleRefresh}
                                disabled={loading}
                                className="font-semibold underline hover:no-underline disabled:opacity-50"
                            >

                                Try again

                            </button>

                        </div>

                    </div>

                )}


                {/* =================================================
                    STATUS FILTERS
                ================================================= */}

                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-8">

                    <div
                        className="flex flex-wrap gap-3"
                        role="tablist"
                        aria-label="Application status filters"
                    >

                        {APPLICATION_STATUSES.map(
                            (status) => (

                                <button
                                    key={status}
                                    type="button"
                                    role="tab"
                                    aria-selected={
                                        statusFilter === status
                                    }
                                    onClick={() =>
                                        handleStatusChange(
                                            status
                                        )
                                    }
                                    className={`px-5 py-2.5 rounded-xl font-medium capitalize transition ${statusFilter === status
                                            ? "bg-blue-600 text-white shadow-sm"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                        }`}
                                >

                                    {status}

                                </button>

                            )
                        )}

                    </div>


                    {/* TOTAL APPLICATIONS */}

                    {pagination && (

                        <div className="mt-4 pt-4 border-t border-gray-100">

                            <p className="text-sm text-gray-500">

                                Total{" "}
                                <span className="font-medium capitalize">

                                    {statusFilter}

                                </span>{" "}
                                applications:{" "}

                                <span className="font-semibold text-gray-700">

                                    {pagination.totalApplications ??
                                        0}

                                </span>

                            </p>

                        </div>

                    )}

                </section>


                {/* =================================================
                    APPLICATION LIST
                ================================================= */}

                {applications.length === 0 ? (

                    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 sm:p-14 text-center">

                        <div className="w-16 h-16 mx-auto rounded-full bg-green-50 text-green-600 flex items-center justify-center text-3xl">

                            ✓

                        </div>


                        <h2 className="text-2xl font-bold text-gray-900 mt-5">

                            No {statusFilter} applications

                        </h2>


                        <p className="text-gray-500 mt-2 max-w-md mx-auto">

                            There are currently no professional applications in this category.

                        </p>

                    </section>

                ) : (

                    <div className="space-y-6">

                        {applications.map(
                            (application) => {

                                const isProcessing =
                                    actionLoading ===
                                    application._id;


                                return (

                                    <article
                                        key={
                                            application._id
                                        }
                                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6"
                                    >


                                        {/* =================================================
                                            APPLICATION HEADER
                                        ================================================= */}

                                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">


                                            {/* USER INFO */}

                                            <div className="flex gap-4 min-w-0">

                                                {application.profileImage ? (

                                                    <a
                                                        href={
                                                            application.profileImage
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        aria-label="View professional profile image"
                                                        className="shrink-0"
                                                    >

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
                                                            className="w-16 h-16 rounded-full object-cover border border-gray-200 hover:opacity-90 transition"
                                                        />

                                                    </a>

                                                ) : (

                                                    <div
                                                        className="shrink-0 w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600"
                                                        aria-hidden="true"
                                                    >

                                                        {application.user
                                                            ?.fullName
                                                            ?.charAt(0)
                                                            ?.toUpperCase() ||
                                                            "U"}

                                                    </div>

                                                )}


                                                <div className="min-w-0">

                                                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">

                                                        {application.user
                                                            ?.fullName ||
                                                            "Unknown User"}

                                                    </h2>


                                                    <p className="text-gray-500 mt-1 break-all">

                                                        {application.user
                                                            ?.email ||
                                                            "No email"}

                                                    </p>


                                                    <p className="text-gray-500">

                                                        {application.user
                                                            ?.phone ||
                                                            "No phone"}

                                                    </p>

                                                </div>

                                            </div>


                                            {/* STATUS */}

                                            <div className="shrink-0">

                                                {getStatusBadge(
                                                    application.applicationStatus
                                                )}

                                            </div>

                                        </div>


                                        {/* =================================================
                                            PROFESSIONAL DETAILS
                                        ================================================= */}

                                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">


                                            {/* PROFESSION */}

                                            <div className="bg-gray-50 rounded-xl p-4">

                                                <p className="text-sm text-gray-500">

                                                    Profession

                                                </p>

                                                <p className="font-semibold text-gray-900 mt-1 break-words">

                                                    {application.profession ||
                                                        "Not provided"}

                                                </p>

                                            </div>


                                            {/* CATEGORY */}

                                            <div className="bg-gray-50 rounded-xl p-4">

                                                <p className="text-sm text-gray-500">

                                                    Category

                                                </p>

                                                <p className="font-semibold text-gray-900 mt-1 break-words">

                                                    {application.category ||
                                                        "Not provided"}

                                                </p>

                                            </div>


                                            {/* EXPERIENCE */}

                                            <div className="bg-gray-50 rounded-xl p-4">

                                                <p className="text-sm text-gray-500">

                                                    Experience

                                                </p>

                                                <p className="font-semibold text-gray-900 mt-1">

                                                    {application.experience ??
                                                        0}{" "}

                                                    {Number(
                                                        application.experience
                                                    ) === 1
                                                        ? "year"
                                                        : "years"}

                                                </p>

                                            </div>


                                            {/* STARTING CHARGES */}

                                            <div className="bg-gray-50 rounded-xl p-4">

                                                <p className="text-sm text-gray-500">

                                                    Starting Charges

                                                </p>

                                                <p className="font-semibold text-gray-900 mt-1">

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


                                        {/* =================================================
                                            SERVICE AREAS
                                        ================================================= */}

                                        {Array.isArray(
                                            application.serviceAreas
                                        ) &&
                                            application.serviceAreas.length >
                                            0 && (

                                                <div className="mt-6">

                                                    <p className="font-semibold text-gray-900">

                                                        Service Areas

                                                    </p>


                                                    <div className="flex flex-wrap gap-2 mt-2">

                                                        {application.serviceAreas.map(
                                                            (
                                                                area,
                                                                index
                                                            ) => (

                                                                <span
                                                                    key={`${application._id}-area-${index}`}
                                                                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                                                                >

                                                                    {area}

                                                                </span>

                                                            )
                                                        )}

                                                    </div>

                                                </div>

                                            )}


                                        {/* =================================================
                                            SKILLS
                                        ================================================= */}

                                        {Array.isArray(
                                            application.skills
                                        ) &&
                                            application.skills.length >
                                            0 && (

                                                <div className="mt-6">

                                                    <p className="font-semibold text-gray-900">

                                                        Skills

                                                    </p>


                                                    <div className="flex flex-wrap gap-2 mt-2">

                                                        {application.skills.map(
                                                            (
                                                                skill,
                                                                index
                                                            ) => (

                                                                <span
                                                                    key={`${application._id}-skill-${index}`}
                                                                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                                                >

                                                                    {skill}

                                                                </span>

                                                            )
                                                        )}

                                                    </div>

                                                </div>

                                            )}


                                        {/* =================================================
                                            DESCRIPTION
                                        ================================================= */}

                                        {application.description && (

                                            <div className="mt-6">

                                                <p className="font-semibold text-gray-900">

                                                    About Professional

                                                </p>


                                                <p className="text-gray-600 mt-2 leading-relaxed whitespace-pre-line">

                                                    {application.description}

                                                </p>

                                            </div>

                                        )}


                                        {/* =================================================
                                            DOCUMENTS
                                        ================================================= */}

                                        <div className="mt-6">

                                            <p className="font-semibold text-gray-900 mb-3">

                                                Documents

                                            </p>


                                            <div className="flex flex-wrap gap-3">


                                                {/* PROFILE IMAGE */}

                                                {application.profileImage && (

                                                    <a
                                                        href={
                                                            application.profileImage
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition"
                                                    >

                                                        View Profile Image

                                                    </a>

                                                )}


                                                {/* CERTIFICATE */}

                                                {application.certificate && (

                                                    <a
                                                        href={
                                                            application.certificate
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center justify-center px-4 py-2 bg-purple-50 text-purple-700 rounded-lg font-medium hover:bg-purple-100 transition"
                                                    >

                                                        View Certificate

                                                    </a>

                                                )}


                                                {/* NO DOCUMENTS */}

                                                {!application.profileImage &&
                                                    !application.certificate && (

                                                        <span className="text-sm text-gray-500">

                                                            No documents uploaded.

                                                        </span>

                                                    )}

                                            </div>

                                        </div>


                                        {/* =================================================
                                            TERMS + DATES
                                        ================================================= */}

                                        <div className="mt-6 pt-5 border-t border-gray-100 text-sm text-gray-500 space-y-2">

                                            <p>

                                                Terms Accepted:{" "}

                                                <span
                                                    className={
                                                        application.termsAccepted
                                                            ? "font-medium text-green-600"
                                                            : "font-medium text-red-600"
                                                    }
                                                >

                                                    {application.termsAccepted
                                                        ? "Yes"
                                                        : "No"}

                                                </span>

                                            </p>


                                            <p>

                                                Applied on:{" "}

                                                <span className="font-medium text-gray-700">

                                                    {formatDate(
                                                        application.createdAt
                                                    )}

                                                </span>

                                            </p>


                                            {application.reviewedAt && (

                                                <p>

                                                    Reviewed on:{" "}

                                                    <span className="font-medium text-gray-700">

                                                        {formatDate(
                                                            application.reviewedAt
                                                        )}

                                                    </span>

                                                </p>

                                            )}

                                        </div>


                                        {/* =================================================
                                            REJECTION REASON
                                        ================================================= */}

                                        {application.applicationStatus ===
                                            "rejected" &&
                                            application.rejectionReason && (

                                                <div className="mt-5 bg-red-50 border border-red-100 rounded-xl p-4">

                                                    <p className="font-semibold text-red-700">

                                                        Rejection Reason

                                                    </p>


                                                    <p className="text-red-600 mt-1 whitespace-pre-line">

                                                        {
                                                            application.rejectionReason
                                                        }

                                                    </p>

                                                </div>

                                            )}


                                        {/* =================================================
                                            ACTIONS
                                        ================================================= */}

                                        {application.applicationStatus ===
                                            "pending" && (

                                                <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-100">


                                                    {/* APPROVE */}

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            Boolean(
                                                                actionLoading
                                                            )
                                                        }
                                                        onClick={() =>
                                                            handleApprove(
                                                                application._id
                                                            )
                                                        }
                                                        className="flex-1 inline-flex items-center justify-center bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                                                    >

                                                        {isProcessing ? (

                                                            <>
                                                                <span className="w-4 h-4 mr-2 border-2 border-green-200 border-t-white rounded-full animate-spin" />

                                                                Processing...

                                                            </>

                                                        ) : (

                                                            "Approve Application"

                                                        )}

                                                    </button>


                                                    {/* REJECT */}

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            Boolean(
                                                                actionLoading
                                                            )
                                                        }
                                                        onClick={() =>
                                                            openRejectModal(
                                                                application
                                                            )
                                                        }
                                                        className="flex-1 inline-flex items-center justify-center bg-red-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                                                    >

                                                        Reject Application

                                                    </button>

                                                </div>

                                            )}

                                    </article>

                                );
                            }
                        )}

                    </div>

                )}


                {/* =================================================
                    PAGINATION
                ================================================= */}

                {pagination &&
                    applications.length > 0 &&
                    pagination.totalPages > 1 && (

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">

                            <p className="text-sm text-gray-500">

                                Page{" "}

                                <span className="font-semibold text-gray-700">

                                    {pagination.currentPage ??
                                        currentPage}

                                </span>{" "}

                                of{" "}

                                <span className="font-semibold text-gray-700">

                                    {pagination.totalPages}

                                </span>

                            </p>


                            <div className="flex items-center gap-2">

                                <button
                                    type="button"
                                    disabled={
                                        loading ||
                                        currentPage <= 1
                                    }
                                    onClick={() =>
                                        handlePageChange(
                                            currentPage - 1
                                        )
                                    }
                                    className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >

                                    Previous

                                </button>


                                <button
                                    type="button"
                                    disabled={
                                        loading ||
                                        currentPage >=
                                        (pagination.totalPages ||
                                            1)
                                    }
                                    onClick={() =>
                                        handlePageChange(
                                            currentPage + 1
                                        )
                                    }
                                    className="px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >

                                    Next

                                </button>

                            </div>

                        </div>

                    )}

            </main>


            {/* =====================================================
                REJECT MODAL
            ===================================================== */}

            {showRejectModal &&
                selectedApplication && (

                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="reject-application-title"
                    >

                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">


                            {/* MODAL HEADER */}

                            <div className="flex items-start justify-between gap-4">

                                <div>

                                    <h2
                                        id="reject-application-title"
                                        className="text-xl font-bold text-gray-900"
                                    >

                                        Reject Application

                                    </h2>


                                    <p className="text-gray-500 mt-1">

                                        {selectedApplication.user
                                            ?.fullName ||
                                            "This professional"}

                                    </p>

                                </div>


                                <button
                                    type="button"
                                    onClick={closeRejectModal}
                                    disabled={
                                        Boolean(
                                            actionLoading
                                        )
                                    }
                                    aria-label="Close rejection modal"
                                    className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 text-2xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >

                                    ×

                                </button>

                            </div>


                            {/* =================================================
                                REJECTION REASON
                            ================================================= */}

                            <div className="mt-6">

                                <label
                                    htmlFor="rejectionReason"
                                    className="block font-medium text-gray-900 mb-2"
                                >

                                    Rejection Reason
                                    <span className="text-red-500 ml-1">
                                        *
                                    </span>

                                </label>


                                <textarea
                                    id="rejectionReason"
                                    value={rejectionReason}
                                    onChange={(event) =>
                                        setRejectionReason(
                                            event.target.value
                                        )
                                    }
                                    rows={5}
                                    maxLength={1000}
                                    disabled={
                                        Boolean(
                                            actionLoading
                                        )
                                    }
                                    placeholder="Explain why this application is being rejected..."
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none resize-y focus:ring-2 focus:ring-red-500 focus:border-red-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />


                                <div className="flex justify-between items-center mt-2">

                                    <p className="text-sm text-gray-400">

                                        Maximum 1000 characters

                                    </p>


                                    <p className="text-sm text-gray-400">

                                        {
                                            rejectionReason.length
                                        }
                                        /1000

                                    </p>

                                </div>

                            </div>


                            {/* =================================================
                                MODAL ACTIONS
                            ================================================= */}

                            <div className="flex flex-col-reverse sm:flex-row gap-3 mt-6">

                                <button
                                    type="button"
                                    onClick={closeRejectModal}
                                    disabled={
                                        Boolean(
                                            actionLoading
                                        )
                                    }
                                    className="flex-1 border border-gray-300 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >

                                    Cancel

                                </button>


                                <button
                                    type="button"
                                    onClick={handleReject}
                                    disabled={
                                        Boolean(
                                            actionLoading
                                        ) ||
                                        !rejectionReason.trim()
                                    }
                                    className="flex-1 inline-flex items-center justify-center bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >

                                    {actionLoading ? (

                                        <>
                                            <span className="w-4 h-4 mr-2 border-2 border-red-200 border-t-white rounded-full animate-spin" />

                                            Rejecting...

                                        </>

                                    ) : (

                                        "Reject Application"

                                    )}

                                </button>

                            </div>

                        </div>

                    </div>

                )}

        </div>
    );
}


export default AdminProfessionalApplications;