import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
    Save,
    User,
    Briefcase,
    Clock,
    IndianRupee,
    FileText,
    MapPin,
    Award,
} from "lucide-react";

import DashboardSidebar from "../components/Dashboard/DashboardSidebar";
import {
    getMyProfessionalProfile,
    updateMyProfessionalProfile,
} from "../services/professionalService";


const ProfessionalSettings = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        profession: "",
        category: "",
        experience: "",
        description: "",
        skills: "",
        serviceAreas: "",
        startingCharges: "",
        availability: "",
    });


    // =====================================================
    // FETCH PROFESSIONAL PROFILE
    // =====================================================

    useEffect(() => {

        const fetchProfile = async () => {

            try {

                const response =
                    await getMyProfessionalProfile();

                const professional =
                    response.professional;

                setFormData({
                    profession:
                        professional.profession || "",

                    category:
                        professional.category || "",

                    experience:
                        professional.experience ?? "",

                    description:
                        professional.description || "",

                    skills:
                        Array.isArray(professional.skills)
                            ? professional.skills.join(", ")
                            : "",

                    serviceAreas:
                        Array.isArray(professional.serviceAreas)
                            ? professional.serviceAreas.join(", ")
                            : "",

                    startingCharges:
                        professional.startingCharges ?? "",

                    availability:
                        professional.availability || "",
                });

            } catch (error) {

                console.error(
                    "Failed to load professional profile:",
                    error
                );

                toast.error(
                    error.response?.data?.message ||
                    "Failed to load professional profile."
                );

            } finally {

                setLoading(false);

            }
        };

        fetchProfile();

    }, []);


    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    };


    // =====================================================
    // HANDLE SUBMIT
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        try {

            setSaving(true);

            const payload = {
                profession:
                    formData.profession.trim(),

                category:
                    formData.category.trim(),

                experience:
                    Number(formData.experience),

                description:
                    formData.description.trim(),

                skills:
                    formData.skills
                        .split(",")
                        .map((skill) => skill.trim())
                        .filter(Boolean),

                serviceAreas:
                    formData.serviceAreas
                        .split(",")
                        .map((area) => area.trim())
                        .filter(Boolean),

                startingCharges:
                    Number(formData.startingCharges),

                availability:
                    formData.availability.trim(),
            };


            await updateMyProfessionalProfile(payload);

            toast.success(
                "Professional profile updated successfully."
            );

            navigate("/professional/profile");

        } catch (error) {

            console.error(
                "Failed to update professional profile:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to update professional profile."
            );

        } finally {

            setSaving(false);

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">

                <p className="text-gray-600">
                    Loading settings...
                </p>

            </div>
        );

    }


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="min-h-screen bg-gray-50">

            <div className="flex">

                {/* Sidebar */}

                <DashboardSidebar />


                {/* Main Content */}

                <main className="flex-1 p-6 lg:p-8">

                    <div className="max-w-4xl mx-auto">


                        {/* Header */}

                        <div className="mb-8">

                            <h1 className="text-3xl font-bold text-gray-900">
                                Professional Settings
                            </h1>

                            <p className="text-gray-600 mt-1">
                                Update your professional information
                            </p>

                        </div>


                        {/* Form */}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >


                            {/* =================================================
                                PROFESSIONAL INFORMATION
                            ================================================= */}

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                                <div className="flex items-center gap-2 mb-6">

                                    <Briefcase
                                        size={20}
                                        className="text-blue-600"
                                    />

                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Professional Information
                                    </h2>

                                </div>


                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                                    {/* Profession */}

                                    <div>

                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Profession
                                        </label>

                                        <input
                                            type="text"
                                            name="profession"
                                            value={formData.profession}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g. Electrician"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />

                                    </div>


                                    {/* Category */}

                                    <div>

                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category
                                        </label>

                                        <input
                                            type="text"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            required
                                            placeholder="e.g. Home Services"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />

                                    </div>


                                    {/* Experience */}

                                    <div>

                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Experience (Years)
                                        </label>

                                        <input
                                            type="number"
                                            name="experience"
                                            value={formData.experience}
                                            onChange={handleChange}
                                            min="0"
                                            required
                                            placeholder="e.g. 5"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />

                                    </div>


                                    {/* Starting Charges */}

                                    <div>

                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Starting Charges (₹)
                                        </label>

                                        <div className="relative">

                                            <IndianRupee
                                                size={18}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            />

                                            <input
                                                type="number"
                                                name="startingCharges"
                                                value={formData.startingCharges}
                                                onChange={handleChange}
                                                min="0"
                                                required
                                                placeholder="e.g. 499"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />

                                        </div>

                                    </div>


                                    {/* Availability */}

                                    <div className="md:col-span-2">

                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Availability
                                        </label>

                                        <div className="relative">

                                            <Clock
                                                size={18}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            />

                                            <input
                                                type="text"
                                                name="availability"
                                                value={formData.availability}
                                                onChange={handleChange}
                                                placeholder="e.g. Mon - Sat, 9 AM - 6 PM"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />

                                        </div>

                                    </div>

                                </div>

                            </div>


                            {/* =================================================
                                DESCRIPTION
                            ================================================= */}

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                                <div className="flex items-center gap-2 mb-6">

                                    <FileText
                                        size={20}
                                        className="text-blue-600"
                                    />

                                    <h2 className="text-lg font-semibold text-gray-900">
                                        About Your Services
                                    </h2>

                                </div>


                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="5"
                                    placeholder="Describe your professional experience and services..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>


                            {/* =================================================
                                SKILLS & SERVICE AREAS
                            ================================================= */}

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                                <div className="flex items-center gap-2 mb-6">

                                    <Award
                                        size={20}
                                        className="text-blue-600"
                                    />

                                    <h2 className="text-lg font-semibold text-gray-900">
                                        Skills & Service Areas
                                    </h2>

                                </div>


                                <div className="space-y-5">


                                    {/* Skills */}

                                    <div>

                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Skills
                                        </label>

                                        <input
                                            type="text"
                                            name="skills"
                                            value={formData.skills}
                                            onChange={handleChange}
                                            placeholder="e.g. Wiring, Installation, Repair"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />

                                        <p className="text-xs text-gray-500 mt-2">
                                            Separate multiple skills with commas.
                                        </p>

                                    </div>


                                    {/* Service Areas */}

                                    <div>

                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Service Areas
                                        </label>

                                        <div className="relative">

                                            <MapPin
                                                size={18}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                            />

                                            <input
                                                type="text"
                                                name="serviceAreas"
                                                value={formData.serviceAreas}
                                                onChange={handleChange}
                                                placeholder="e.g. Greater Noida, Noida, Delhi"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />

                                        </div>

                                        <p className="text-xs text-gray-500 mt-2">
                                            Separate multiple service areas with commas.
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* =================================================
                                ACTIONS
                            ================================================= */}

                            <div className="flex flex-col sm:flex-row justify-end gap-3">

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/professional/profile")
                                    }
                                    className="px-5 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
                                >

                                    <Save size={18} />

                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}

                                </button>

                            </div>

                        </form>

                    </div>

                </main>

            </div>

        </div>

    );
};


export default ProfessionalSettings;