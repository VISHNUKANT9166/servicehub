import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Briefcase,
    Clock,
    IndianRupee,
    Award,
    Edit,
} from "lucide-react";

import DashboardSidebar from "../components/Dashboard/DashboardSidebar";
import { getMyProfessionalProfile } from "../services/professionalService";

const ProfessionalProfile = () => {

    const [professional, setProfessional] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);

                const response = await getMyProfessionalProfile();

                setProfessional(response.professional);
            } catch (err) {
                console.error("Failed to fetch professional profile:", err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load professional profile."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-600">
                    Loading professional profile...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">{error}</p>

                    <Link
                        to="/professional/dashboard"
                        className="text-blue-600 hover:underline"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    if (!professional) {
        return null;
    }

    const user = professional.user;

    return (
        <div className="min-h-screen bg-gray-50">

            <div className="flex">

                {/* Sidebar */}
                <DashboardSidebar />

                {/* Main Content */}
                <main className="flex-1 p-6 lg:p-8">

                    <div className="max-w-5xl mx-auto">

                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Professional Profile
                                </h1>

                                <p className="text-gray-600 mt-1">
                                    View and manage your professional information
                                </p>
                            </div>

                            <Link
                                to="/professional/settings"
                                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                <Edit size={18} />
                                Edit Profile
                            </Link>

                        </div>

                        {/* Profile Header Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">

                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

                                {/* Profile Image */}
                                <img
                                    src={
                                        professional.profileImage ||
                                        user?.profileImage ||
                                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                            user?.fullName || "Professional"
                                        )}&background=2563eb&color=fff`
                                    }
                                    alt={user?.fullName || "Professional"}
                                    className="w-28 h-28 rounded-full object-cover border-4 border-gray-100"
                                />

                                <div className="text-center sm:text-left">

                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {user?.fullName || "Professional"}
                                    </h2>

                                    <p className="text-blue-600 font-medium mt-1">
                                        {professional.profession || "Professional"}
                                    </p>

                                    {professional.category && (
                                        <span className="inline-block mt-3 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                                            {professional.category}
                                        </span>
                                    )}

                                </div>

                            </div>

                        </div>

                        {/* Information Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* Personal Information */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                                <h3 className="text-lg font-semibold text-gray-900 mb-5">
                                    Personal Information
                                </h3>

                                <div className="space-y-4">

                                    <div className="flex items-center gap-3">
                                        <Mail className="text-gray-400" size={20} />
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Email
                                            </p>
                                            <p className="text-gray-900">
                                                {user?.email || "Not provided"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Phone className="text-gray-400" size={20} />
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Phone
                                            </p>
                                            <p className="text-gray-900">
                                                {user?.phone || "Not provided"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <MapPin className="text-gray-400" size={20} />
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Location
                                            </p>
                                            <p className="text-gray-900">
                                                {[user?.city, user?.state]
                                                    .filter(Boolean)
                                                    .join(", ") ||
                                                    "Not provided"}
                                            </p>
                                        </div>
                                    </div>

                                </div>

                            </div>

                            {/* Professional Information */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                                <h3 className="text-lg font-semibold text-gray-900 mb-5">
                                    Professional Information
                                </h3>

                                <div className="space-y-4">

                                    <div className="flex items-center gap-3">
                                        <Briefcase
                                            className="text-gray-400"
                                            size={20}
                                        />
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Experience
                                            </p>
                                            <p className="text-gray-900">
                                                {professional.experience
                                                    ? `${professional.experience} years`
                                                    : "Not provided"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <IndianRupee
                                            className="text-gray-400"
                                            size={20}
                                        />
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Starting Charges
                                            </p>
                                            <p className="text-gray-900">
                                                {professional.startingCharges
                                                    ? `₹${professional.startingCharges}`
                                                    : "Not provided"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Clock
                                            className="text-gray-400"
                                            size={20}
                                        />
                                        <div>
                                            <p className="text-xs text-gray-500">
                                                Availability
                                            </p>
                                            <p className="text-gray-900">
                                                {professional.availability ||
                                                    "Not provided"}
                                            </p>
                                        </div>
                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* Description */}
                        {professional.description && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">

                                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                    About
                                </h3>

                                <p className="text-gray-600 leading-relaxed">
                                    {professional.description}
                                </p>

                            </div>
                        )}

                        {/* Skills */}
                        {professional.skills?.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">

                                <div className="flex items-center gap-2 mb-4">
                                    <Award
                                        className="text-gray-500"
                                        size={20}
                                    />

                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Skills
                                    </h3>
                                </div>

                                <div className="flex flex-wrap gap-2">

                                    {professional.skills.map(
                                        (skill, index) => (
                                            <span
                                                key={`${skill}-${index}`}
                                                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg"
                                            >
                                                {skill}
                                            </span>
                                        )
                                    )}

                                </div>

                            </div>
                        )}

                        {/* Service Areas */}
                        {professional.serviceAreas?.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">

                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Service Areas
                                </h3>

                                <div className="flex flex-wrap gap-2">

                                    {professional.serviceAreas.map(
                                        (area, index) => (
                                            <span
                                                key={`${area}-${index}`}
                                                className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-lg"
                                            >
                                                {area}
                                            </span>
                                        )
                                    )}

                                </div>

                            </div>
                        )}

                    </div>

                </main>

            </div>

        </div>
    );
};

export default ProfessionalProfile;