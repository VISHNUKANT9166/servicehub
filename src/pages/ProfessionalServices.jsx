import { useEffect, useState } from "react";
import {
    Plus,
    Pencil,
    Trash2,
    Power,
    Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

import DashboardLayout from "../components/Dashboard/DashboardLayout";
import DashboardSidebar from "../components/Dashboard/DashboardSidebar";

import {
    getMyServices,
    deleteService,
    toggleServiceStatus,
} from "../services/serviceService";


function ProfessionalServices() {

    // =====================================================
    // NAVIGATION
    // =====================================================

    const navigate = useNavigate();


    // =====================================================
    // STATE
    // =====================================================

    const [services, setServices] = useState([]);

    const [loading, setLoading] = useState(true);

    const [actionLoading, setActionLoading] = useState(null);


    // =====================================================
    // LOAD SERVICES
    // =====================================================

    const loadServices = async () => {
        try {

            setLoading(true);

            const response = await getMyServices();

            if (response.success) {

                setServices(
                    response.services || []
                );

            } else {

                setServices([]);

                toast.error(
                    response.message ||
                    "Unable to load services."
                );
            }

        } catch (error) {

            console.error(
                "Load Professional Services Error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Unable to load services."
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        loadServices();
    }, []);


    // =====================================================
    // CREATE SERVICE
    // =====================================================

    const handleCreateService = () => {

        navigate(
            "/professional/services/create"
        );
    };


    // =====================================================
    // EDIT SERVICE
    // =====================================================

    const handleEditService = (serviceId) => {

        navigate(
            `/professional/services/${serviceId}/edit`
        );
    };


    // =====================================================
    // DELETE SERVICE
    // =====================================================

    const handleDelete = async (serviceId) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this service?"
        );

        if (!confirmed) {
            return;
        }

        try {

            setActionLoading(serviceId);

            const response =
                await deleteService(serviceId);

            if (response.success) {

                setServices(
                    (previousServices) =>
                        previousServices.filter(
                            (service) =>
                                service._id !== serviceId
                        )
                );

                toast.success(
                    "Service deleted successfully."
                );

            } else {

                toast.error(
                    response.message ||
                    "Unable to delete service."
                );
            }

        } catch (error) {

            console.error(
                "Delete Service Error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Unable to delete service."
            );

        } finally {

            setActionLoading(null);

        }
    };


    // =====================================================
    // TOGGLE ACTIVE STATUS
    // =====================================================

    const handleToggleStatus = async (service) => {

        try {

            setActionLoading(service._id);

            const response =
                await toggleServiceStatus(
                    service._id,
                    !service.isActive
                );

            if (response.success) {

                setServices(
                    (previousServices) =>
                        previousServices.map(
                            (item) =>
                                item._id === service._id
                                    ? {
                                        ...item,
                                        ...response.service,
                                    }
                                    : item
                        )
                );

                toast.success(
                    service.isActive
                        ? "Service deactivated."
                        : "Service activated."
                );

            } else {

                toast.error(
                    response.message ||
                    "Unable to update service status."
                );
            }

        } catch (error) {

            console.error(
                "Toggle Service Status Error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Unable to update service status."
            );

        } finally {

            setActionLoading(null);

        }
    };


    // =====================================================
    // LOADING SCREEN
    // =====================================================

    if (loading) {

        return (
            <>
                <Navbar />

                <DashboardLayout
                    sidebar={
                        <DashboardSidebar />
                    }
                >

                    <div className="min-h-[60vh] flex items-center justify-center">

                        <div className="text-center">

                            <Loader2
                                size={40}
                                className="animate-spin mx-auto text-blue-600"
                            />

                            <p className="text-gray-500 mt-4">
                                Loading your services...
                            </p>

                        </div>

                    </div>

                </DashboardLayout>

                <Footer />
            </>
        );
    }


    // =====================================================
    // MAIN UI
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

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                        <div>

                            <h1 className="text-3xl font-bold text-gray-900">
                                My Services
                            </h1>

                            <p className="text-gray-500 mt-2">
                                Manage the services you offer to customers.
                            </p>

                        </div>


                        {/* ADD SERVICE */}

                        <button
                            type="button"
                            onClick={
                                handleCreateService
                            }
                            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                        >

                            <Plus size={20} />

                            Add Service

                        </button>

                    </div>

                </div>


                {/* =================================================
                    SERVICES
                ================================================= */}

                <div className="mt-8">

                    {services.length === 0 ? (

                        /* =================================================
                            EMPTY STATE
                        ================================================= */

                        <div className="bg-white rounded-2xl shadow-lg p-10 text-center">

                            <div className="w-16 h-16 mx-auto rounded-full bg-blue-50 flex items-center justify-center">

                                <Plus
                                    size={30}
                                    className="text-blue-600"
                                />

                            </div>

                            <h2 className="text-2xl font-bold mt-5 text-gray-900">
                                No Services Yet
                            </h2>

                            <p className="text-gray-500 mt-2">
                                You haven't created any services yet.
                            </p>


                            <button
                                type="button"
                                onClick={
                                    handleCreateService
                                }
                                className="mt-6 inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                            >

                                <Plus size={20} />

                                Create Your First Service

                            </button>

                        </div>

                    ) : (

                        /* =================================================
                            SERVICE CARDS
                        ================================================= */

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {services.map(
                                (service) => (

                                    <div
                                        key={
                                            service._id
                                        }
                                        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                                    >

                                        {/* =================================================
                                            IMAGE
                                        ================================================= */}

                                        {service.image ? (

                                            <img
                                                src={
                                                    service.image
                                                }
                                                alt={
                                                    service.title
                                                }
                                                className="w-full h-48 object-cover"
                                            />

                                        ) : (

                                            <div className="w-full h-48 bg-gray-100 flex items-center justify-center">

                                                <span className="text-gray-400">
                                                    No image
                                                </span>

                                            </div>

                                        )}


                                        {/* =================================================
                                            CONTENT
                                        ================================================= */}

                                        <div className="p-6">

                                            {/* TITLE + STATUS */}

                                            <div className="flex items-start justify-between gap-4">

                                                <div className="min-w-0">

                                                    <h2 className="text-xl font-bold text-gray-900 break-words">
                                                        {
                                                            service.title
                                                        }
                                                    </h2>

                                                    <p className="text-blue-600 font-medium mt-1">
                                                        {
                                                            service.category
                                                        }
                                                    </p>

                                                </div>


                                                {/* STATUS */}

                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${service.isActive
                                                            ? "bg-green-100 text-green-700"
                                                            : "bg-gray-100 text-gray-600"
                                                        }`}
                                                >

                                                    {
                                                        service.isActive
                                                            ? "Active"
                                                            : "Inactive"
                                                    }

                                                </span>

                                            </div>


                                            {/* DESCRIPTION */}

                                            {service.description && (

                                                <p className="text-gray-600 mt-4 line-clamp-3">
                                                    {
                                                        service.description
                                                    }
                                                </p>

                                            )}


                                            {/* PRICE + DURATION */}

                                            <div className="grid grid-cols-2 gap-4 mt-5">

                                                <div className="bg-gray-50 rounded-xl p-4">

                                                    <p className="text-sm text-gray-500">
                                                        Price
                                                    </p>

                                                    <p className="text-lg font-bold mt-1">
                                                        ₹
                                                        {
                                                            service.price
                                                        }
                                                    </p>

                                                </div>


                                                <div className="bg-gray-50 rounded-xl p-4">

                                                    <p className="text-sm text-gray-500">
                                                        Duration
                                                    </p>

                                                    <p className="text-lg font-bold mt-1">
                                                        {
                                                            service.duration
                                                        }{" "}
                                                        min
                                                    </p>

                                                </div>

                                            </div>


                                            {/* =================================================
                                                SKILLS
                                            ================================================= */}

                                            {service.skills?.length > 0 && (

                                                <div className="mt-5">

                                                    <p className="text-sm font-semibold text-gray-900">
                                                        Skills
                                                    </p>

                                                    <div className="flex flex-wrap gap-2 mt-2">

                                                        {service.skills.map(
                                                            (
                                                                skill,
                                                                index
                                                            ) => (

                                                                <span
                                                                    key={`${service._id}-skill-${index}`}
                                                                    className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                                                                >
                                                                    {
                                                                        skill
                                                                    }
                                                                </span>

                                                            )
                                                        )}

                                                    </div>

                                                </div>

                                            )}


                                            {/* =================================================
                                                SERVICE AREAS
                                            ================================================= */}

                                            {service.serviceAreas?.length > 0 && (

                                                <div className="mt-5">

                                                    <p className="text-sm font-semibold text-gray-900">
                                                        Service Areas
                                                    </p>

                                                    <div className="flex flex-wrap gap-2 mt-2">

                                                        {service.serviceAreas.map(
                                                            (
                                                                area,
                                                                index
                                                            ) => (

                                                                <span
                                                                    key={`${service._id}-area-${index}`}
                                                                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                                                >
                                                                    {
                                                                        area
                                                                    }
                                                                </span>

                                                            )
                                                        )}

                                                    </div>

                                                </div>

                                            )}


                                            {/* =================================================
                                                ACTIONS
                                            ================================================= */}

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t">

                                                {/* EDIT */}

                                                <button
                                                    type="button"
                                                    disabled={
                                                        actionLoading ===
                                                        service._id
                                                    }
                                                    onClick={() =>
                                                        handleEditService(
                                                            service._id
                                                        )
                                                    }
                                                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                >

                                                    <Pencil
                                                        size={18}
                                                    />

                                                    Edit

                                                </button>


                                                {/* TOGGLE */}

                                                <button
                                                    type="button"
                                                    disabled={
                                                        actionLoading ===
                                                        service._id
                                                    }
                                                    onClick={() =>
                                                        handleToggleStatus(
                                                            service
                                                        )
                                                    }
                                                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-yellow-50 text-yellow-700 font-semibold hover:bg-yellow-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                >

                                                    {actionLoading ===
                                                        service._id ? (

                                                        <Loader2
                                                            size={18}
                                                            className="animate-spin"
                                                        />

                                                    ) : (

                                                        <Power
                                                            size={18}
                                                        />

                                                    )}

                                                    {
                                                        service.isActive
                                                            ? "Disable"
                                                            : "Enable"
                                                    }

                                                </button>


                                                {/* DELETE */}

                                                <button
                                                    type="button"
                                                    disabled={
                                                        actionLoading ===
                                                        service._id
                                                    }
                                                    onClick={() =>
                                                        handleDelete(
                                                            service._id
                                                        )
                                                    }
                                                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-700 font-semibold hover:bg-red-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                >

                                                    {actionLoading ===
                                                        service._id ? (

                                                        <Loader2
                                                            size={18}
                                                            className="animate-spin"
                                                        />

                                                    ) : (

                                                        <Trash2
                                                            size={18}
                                                        />

                                                    )}

                                                    Delete

                                                </button>

                                            </div>

                                        </div>

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

export default ProfessionalServices;