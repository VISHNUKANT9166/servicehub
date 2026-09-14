import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Loader2,
    Save,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

import DashboardLayout from "../components/Dashboard/DashboardLayout";
import DashboardSidebar from "../components/Dashboard/DashboardSidebar";

import {
    getMyServices,
    updateService,
} from "../services/serviceService";


function EditService() {

    // =====================================================
    // ROUTER
    // =====================================================

    const navigate = useNavigate();

    const { serviceId } = useParams();


    // =====================================================
    // STATE
    // =====================================================

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        price: "",
        duration: "60",
        skills: "",
        serviceAreas: "",
        image: "",
    });


    // =====================================================
    // LOAD SERVICE
    // =====================================================

    useEffect(() => {

        const loadService = async () => {

            try {

                setLoading(true);

                const response =
                    await getMyServices();

                if (!response.success) {

                    toast.error(
                        response.message ||
                        "Unable to load service."
                    );

                    navigate(
                        "/professional/services"
                    );

                    return;
                }


                const services =
                    response.services || [];


                const service =
                    services.find(
                        (item) =>
                            item._id === serviceId
                    );


                if (!service) {

                    toast.error(
                        "Service not found."
                    );

                    navigate(
                        "/professional/services"
                    );

                    return;
                }


                setFormData({
                    title:
                        service.title || "",

                    description:
                        service.description || "",

                    category:
                        service.category || "",

                    price:
                        service.price ?? "",

                    duration:
                        service.duration ?? "60",

                    skills:
                        Array.isArray(service.skills)
                            ? service.skills.join(", ")
                            : "",

                    serviceAreas:
                        Array.isArray(
                            service.serviceAreas
                        )
                            ? service.serviceAreas.join(", ")
                            : "",

                    image:
                        service.image || "",
                });

            } catch (error) {

                console.error(
                    "Load Edit Service Error:",
                    error
                );

                toast.error(
                    error.response?.data?.message ||
                    "Unable to load service."
                );

                navigate(
                    "/professional/services"
                );

            } finally {

                setLoading(false);

            }
        };


        loadService();

    }, [serviceId, navigate]);


    // =====================================================
    // INPUT HANDLER
    // =====================================================

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setFormData(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );
    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();


        // =================================================
        // VALIDATION
        // =================================================

        if (!formData.title.trim()) {

            toast.error(
                "Service title is required."
            );

            return;
        }


        if (!formData.category.trim()) {

            toast.error(
                "Service category is required."
            );

            return;
        }


        if (
            formData.price === "" ||
            Number.isNaN(
                Number(formData.price)
            ) ||
            Number(formData.price) < 0
        ) {

            toast.error(
                "Please enter a valid price."
            );

            return;
        }


        if (
            formData.duration === "" ||
            Number.isNaN(
                Number(formData.duration)
            ) ||
            Number(formData.duration) < 1
        ) {

            toast.error(
                "Duration must be at least 1 minute."
            );

            return;
        }


        // =================================================
        // PREPARE DATA
        // =================================================

        const serviceData = {

            title:
                formData.title.trim(),

            description:
                formData.description.trim(),

            category:
                formData.category.trim(),

            price:
                Number(formData.price),

            duration:
                Number(formData.duration),

            skills:
                formData.skills
                    .split(",")
                    .map(
                        (skill) =>
                            skill.trim()
                    )
                    .filter(Boolean),

            serviceAreas:
                formData.serviceAreas
                    .split(",")
                    .map(
                        (area) =>
                            area.trim()
                    )
                    .filter(Boolean),

            image:
                formData.image.trim(),
        };


        // =================================================
        // UPDATE SERVICE
        // =================================================

        try {

            setSaving(true);

            const response =
                await updateService(
                    serviceId,
                    serviceData
                );


            if (!response.success) {

                toast.error(
                    response.message ||
                    "Unable to update service."
                );

                return;
            }


            toast.success(
                "Service updated successfully."
            );


            navigate(
                "/professional/services"
            );

        } catch (error) {

            console.error(
                "Update Service Error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Unable to update service."
            );

        } finally {

            setSaving(false);

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
                                Loading service...
                            </p>

                        </div>

                    </div>

                </DashboardLayout>

                <Footer />
            </>
        );
    }


    // =====================================================
    // UI
    // =====================================================

    return (
        <>
            <Navbar />

            <DashboardLayout
                sidebar={
                    <DashboardSidebar />
                }
            >

                <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="flex items-start justify-between gap-4 mb-8">

                        <div>

                            <h1 className="text-3xl font-bold text-gray-900">
                                Edit Service
                            </h1>

                            <p className="text-gray-500 mt-2">
                                Update your service details.
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/professional/services"
                                )
                            }
                            disabled={saving}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition disabled:opacity-50"
                        >

                            <ArrowLeft
                                size={18}
                            />

                            Back

                        </button>

                    </div>


                    {/* =================================================
                        FORM
                    ================================================= */}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >

                        {/* =================================================
                            TITLE
                        ================================================= */}

                        <div>

                            <label
                                htmlFor="title"
                                className="block font-semibold mb-2"
                            >
                                Service Title *
                            </label>

                            <input
                                id="title"
                                type="text"
                                name="title"
                                value={
                                    formData.title
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="e.g. Professional Plumbing Service"
                                disabled={saving}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            />

                        </div>


                        {/* =================================================
                            CATEGORY
                        ================================================= */}

                        <div>

                            <label
                                htmlFor="category"
                                className="block font-semibold mb-2"
                            >
                                Category *
                            </label>

                            <input
                                id="category"
                                type="text"
                                name="category"
                                value={
                                    formData.category
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="e.g. Plumber"
                                disabled={saving}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            />

                        </div>


                        {/* =================================================
                            DESCRIPTION
                        ================================================= */}

                        <div>

                            <label
                                htmlFor="description"
                                className="block font-semibold mb-2"
                            >
                                Description
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                value={
                                    formData.description
                                }
                                onChange={
                                    handleChange
                                }
                                rows={5}
                                placeholder="Describe your service..."
                                disabled={saving}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-gray-100"
                            />

                        </div>


                        {/* =================================================
                            PRICE + DURATION
                        ================================================= */}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            <div>

                                <label
                                    htmlFor="price"
                                    className="block font-semibold mb-2"
                                >
                                    Price (₹) *
                                </label>

                                <input
                                    id="price"
                                    type="number"
                                    name="price"
                                    min="0"
                                    value={
                                        formData.price
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="500"
                                    disabled={saving}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                />

                            </div>


                            <div>

                                <label
                                    htmlFor="duration"
                                    className="block font-semibold mb-2"
                                >
                                    Duration (minutes) *
                                </label>

                                <input
                                    id="duration"
                                    type="number"
                                    name="duration"
                                    min="1"
                                    value={
                                        formData.duration
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="60"
                                    disabled={saving}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                />

                            </div>

                        </div>


                        {/* =================================================
                            SKILLS
                        ================================================= */}

                        <div>

                            <label
                                htmlFor="skills"
                                className="block font-semibold mb-2"
                            >
                                Skills
                            </label>

                            <input
                                id="skills"
                                type="text"
                                name="skills"
                                value={
                                    formData.skills
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Pipe Repair, Installation, Leakage Repair"
                                disabled={saving}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            />

                            <p className="text-sm text-gray-500 mt-1">
                                Separate multiple skills with commas.
                            </p>

                        </div>


                        {/* =================================================
                            SERVICE AREAS
                        ================================================= */}

                        <div>

                            <label
                                htmlFor="serviceAreas"
                                className="block font-semibold mb-2"
                            >
                                Service Areas
                            </label>

                            <input
                                id="serviceAreas"
                                type="text"
                                name="serviceAreas"
                                value={
                                    formData.serviceAreas
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Delhi, Noida, Ghaziabad"
                                disabled={saving}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            />

                            <p className="text-sm text-gray-500 mt-1">
                                Separate multiple areas with commas.
                            </p>

                        </div>


                        {/* =================================================
                            IMAGE URL
                        ================================================= */}

                        <div>

                            <label
                                htmlFor="image"
                                className="block font-semibold mb-2"
                            >
                                Image URL
                            </label>

                            <input
                                id="image"
                                type="url"
                                name="image"
                                value={
                                    formData.image
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="https://example.com/image.jpg"
                                disabled={saving}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            />

                        </div>


                        {/* =================================================
                            ACTIONS
                        ================================================= */}

                        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">

                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >

                                {saving ? (

                                    <>
                                        <Loader2
                                            size={20}
                                            className="animate-spin"
                                        />

                                        Updating...

                                    </>

                                ) : (

                                    <>
                                        <Save
                                            size={20}
                                        />

                                        Update Service

                                    </>
                                )}

                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/professional/services"
                                    )
                                }
                                disabled={saving}
                                className="sm:w-40 px-6 py-3 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition disabled:opacity-50"
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>

            </DashboardLayout>

            <Footer />
        </>
    );
}

export default EditService;