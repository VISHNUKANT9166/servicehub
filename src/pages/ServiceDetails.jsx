import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    CalendarDays,
    Clock,
    MapPin,
    Loader2,
    Star,
} from "lucide-react";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

import { getServiceById } from "../services/serviceService";

function ServiceDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadService = async () => {
            try {
                setLoading(true);

                const response = await getServiceById(id);

                if (response.success) {
                    setService(response.service);
                } else {
                    toast.error(
                        response.message || "Unable to load service."
                    );
                }
            } catch (error) {
                console.error("Load Service Error:", error);

                toast.error(
                    error.response?.data?.message ||
                    "Unable to load service."
                );
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadService();
        }
    }, [id]);

    if (loading) {
        return (
            <>
                <Navbar />

                <main className="min-h-[70vh] flex items-center justify-center">
                    <div className="text-center">
                        <Loader2
                            size={42}
                            className="animate-spin mx-auto text-blue-600"
                        />

                        <p className="mt-4 text-gray-500">
                            Loading service...
                        </p>
                    </div>
                </main>

                <Footer />
            </>
        );
    }

    if (!service) {
        return (
            <>
                <Navbar />

                <main className="min-h-[70vh] flex items-center justify-center px-4">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold">
                            Service not found
                        </h1>

                        <p className="text-gray-500 mt-2">
                            This service may no longer be available.
                        </p>

                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="mt-6 inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                        >
                            <ArrowLeft size={18} />
                            Go Back
                        </button>
                    </div>
                </main>

                <Footer />
            </>
        );
    }

    const professional = service.professional;
    const professionalUser = professional?.user;

    return (
        <>
            <Navbar />

            <main className="bg-gray-50 min-h-screen py-8">
                <div className="max-w-6xl mx-auto px-4">

                    {/* Back */}
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition mb-6"
                    >
                        <ArrowLeft size={18} />
                        Back
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Main service */}
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden">

                            {service.image ? (
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-72 object-cover"
                                />
                            ) : (
                                <div className="w-full h-72 bg-gray-100 flex items-center justify-center">
                                    <span className="text-gray-400">
                                        No image available
                                    </span>
                                </div>
                            )}

                            <div className="p-6 md:p-8">

                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

                                    <div>
                                        <p className="text-blue-600 font-semibold">
                                            {service.category}
                                        </p>

                                        <h1 className="text-3xl font-bold mt-2">
                                            {service.title}
                                        </h1>
                                    </div>

                                    <div className="text-left sm:text-right">
                                        <p className="text-3xl font-bold">
                                            ₹{service.price}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            per service
                                        </p>
                                    </div>

                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-2 mt-5">
                                    <div className="flex items-center gap-1">
                                        <Star
                                            size={18}
                                            className="fill-yellow-400 text-yellow-400"
                                        />

                                        <span className="font-semibold">
                                            {service.rating ?? 0}
                                        </span>
                                    </div>

                                    <span className="text-gray-500">
                                        ({service.totalReviews ?? 0} reviews)
                                    </span>
                                </div>

                                {/* Description */}
                                {service.description && (
                                    <div className="mt-8">
                                        <h2 className="text-xl font-bold">
                                            About this service
                                        </h2>

                                        <p className="text-gray-600 mt-3 leading-7">
                                            {service.description}
                                        </p>
                                    </div>
                                )}

                                {/* Service information */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">

                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="flex items-center gap-3">
                                            <Clock
                                                size={20}
                                                className="text-blue-600"
                                            />

                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Duration
                                                </p>

                                                <p className="font-semibold mt-1">
                                                    {service.duration} minutes
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="flex items-center gap-3">
                                            <MapPin
                                                size={20}
                                                className="text-blue-600"
                                            />

                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    Service Areas
                                                </p>

                                                <p className="font-semibold mt-1">
                                                    {service.serviceAreas?.length
                                                        ? service.serviceAreas.join(", ")
                                                        : "Not specified"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                {/* Skills */}
                                {service.skills?.length > 0 && (
                                    <div className="mt-8">
                                        <h2 className="text-xl font-bold">
                                            Skills
                                        </h2>

                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {service.skills.map(
                                                (skill, index) => (
                                                    <span
                                                        key={`${service._id}-skill-${index}`}
                                                        className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm"
                                                    >
                                                        {skill}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>

                        {/* Booking sidebar */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 h-fit lg:sticky lg:top-24">

                            <h2 className="text-2xl font-bold">
                                Book this service
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Choose a convenient date and time for your service.
                            </p>

                            <div className="border-t my-6" />

                            {/* Professional */}
                            <div>
                                <p className="text-sm text-gray-500">
                                    Professional
                                </p>

                                <p className="font-semibold mt-1">
                                    {professionalUser?.fullName ||
                                        "Professional"}
                                </p>

                                {professionalUser?.city && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        {professionalUser.city}
                                        {professionalUser.state
                                            ? `, ${professionalUser.state}`
                                            : ""}
                                    </p>
                                )}
                            </div>

                            <div className="border-t my-6" />

                            {/* Price */}
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">
                                    Service price
                                </span>

                                <span className="font-bold">
                                    ₹{service.price}
                                </span>
                            </div>

                            {/* Book */}
                            <button
                                type="button"
                                onClick={() =>
                                    navigate(`/booking/${service._id}`)
                                }
                                className="w-full mt-6 flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                            >
                                <CalendarDays size={19} />
                                Book Service
                            </button>

                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}

export default ServiceDetails;