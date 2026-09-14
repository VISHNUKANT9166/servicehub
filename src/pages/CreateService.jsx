import { useState } from "react";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

import DashboardLayout from "../components/Dashboard/DashboardLayout";
import DashboardSidebar from "../components/Dashboard/DashboardSidebar";

import { createService } from "../services/serviceService";


function CreateService() {

    const navigate = useNavigate();

    // =====================================================
    // FORM STATE
    // =====================================================

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

    const [loading, setLoading] = useState(false);


    // =====================================================
    // INPUT HANDLER
    // =====================================================

    const handleChange = (event) => {

        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };


    // =====================================================
    // FORM VALIDATION
    // =====================================================

    const validateForm = () => {

        if (!formData.title.trim()) {
            toast.error("Service title is required.");
            return false;
        }

        if (!formData.category.trim()) {
            toast.error("Service category is required.");
            return false;
        }

        if (
            formData.price === "" ||
            Number.isNaN(Number(formData.price)) ||
            Number(formData.price) < 0
        ) {
            toast.error("Please enter a valid price.");
            return false;
        }

        if (
            formData.duration === "" ||
            Number.isNaN(Number(formData.duration)) ||
            Number(formData.duration) < 1
        ) {
            toast.error(
                "Duration must be at least 1 minute."
            );
            return false;
        }

        return true;
    };


    // =====================================================
    // PREPARE ARRAY DATA
    // =====================================================

    const convertToArray = (value) => {

        return value
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        const serviceData = {
            title: formData.title.trim(),

            description:
                formData.description.trim(),

            category:
                formData.category.trim(),

            price:
                Number(formData.price),

            duration:
                Number(formData.duration),

            skills:
                convertToArray(formData.skills),

            serviceAreas:
                convertToArray(
                    formData.serviceAreas
                ),

            image:
                formData.image.trim(),
        };

        try {

            setLoading(true);

            const response =
                await createService(serviceData);

            if (!response.success) {

                toast.error(
                    response.message ||
                    "Unable to create service."
                );

                return;
            }

            toast.success(
                "Service created successfully."
            );

            navigate(
                "/professional/services"
            );

        } catch (error) {

            console.error(
                "Create Service Error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Unable to create service."
            );

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // CANCEL
    // =====================================================

    const handleCancel = () => {

        if (loading) {
            return;
        }

        navigate(
            "/professional/services"
        );
    };


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

                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <div className="bg-white rounded-2xl shadow-lg p-6">

                    <div className="flex items-center gap-4">

                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={loading}
                            className="p-2 rounded-xl hover:bg-gray-100 transition disabled:opacity-50"
                            aria-label="Back to services"
                        >
                            <ArrowLeft
                                size={22}
                            />
                        </button>

                        <div>

                            <h1 className="text-3xl font-bold text-gray-900">
                                Create Service
                            </h1>

                            <p className="text-gray-500 mt-2">
                                Add a service that you offer to customers.
                            </p>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    FORM
                ================================================= */}

                <div className="bg-white rounded-2xl shadow-lg mt-8 p-6">

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >

                        {/* =================================================
                            SERVICE TITLE
                        ================================================= */}

                        <div>

                            <label
                                htmlFor="title"
                                className="block font-semibold text-gray-900 mb-2"
                            >
                                Service Title *
                            </label>

                            <input
                                id="title"
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter your service title"
                                disabled={loading}
                                maxLength={150}
                                required
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                            />

                        </div>


                        {/* =================================================
                            CATEGORY
                        ================================================= */}

                        <div>

                            <label
                                htmlFor="category"
                                className="block font-semibold text-gray-900 mb-2"
                            >
                                Category *
                            </label>

                            <input
                                id="category"
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                placeholder="e.g. Plumbing"
                                disabled={loading}
                                maxLength={100}
                                required
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                            />

                        </div>


                        {/* =================================================
                            DESCRIPTION
                        ================================================= */}

                        <div>

                            <label
                                htmlFor="description"
                                className="block font-semibold text-gray-900 mb-2"
                            >
                                Description
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the service you provide..."
                                rows={5}
                                maxLength={2000}
                                disabled={loading}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none disabled:bg-gray-100"
                            />

                            <p className="text-sm text-gray-500 mt-1">
                                {formData.description.length}/2000
                            </p>

                        </div>


                        {/* =================================================
                            PRICE + DURATION
                        ================================================= */}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {/* PRICE */}

                            <div>

                                <label
                                    htmlFor="price"
                                    className="block font-semibold text-gray-900 mb-2"
                                >
                                    Price (₹) *
                                </label>

                                <input
                                    id="price"
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="Enter service price"
                                    min="0"
                                    step="0.01"
                                    required
                                    disabled={loading}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                />

                            </div>


                            {/* DURATION */}

                            <div>

                                <label
                                    htmlFor="duration"
                                    className="block font-semibold text-gray-900 mb-2"
                                >
                                    Duration (minutes) *
                                </label>

                                <input
                                    id="duration"
                                    type="number"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    placeholder="60"
                                    min="1"
                                    step="1"
                                    required
                                    disabled={loading}
                                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                />

                            </div>

                        </div>


                        {/* =================================================
                            SKILLS
                        ================================================= */}

                        <div>

                            <label
                                htmlFor="skills"
                                className="block font-semibold text-gray-900 mb-2"
                            >
                                Skills
                            </label>

                            <input
                                id="skills"
                                type="text"
                                name="skills"
                                value={formData.skills}
                                onChange={handleChange}
                                placeholder="Pipe Repair, Installation, Maintenance"
                                disabled={loading}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
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
                                className="block font-semibold text-gray-900 mb-2"
                            >
                                Service Areas
                            </label>

                            <input
                                id="serviceAreas"
                                type="text"
                                name="serviceAreas"
                                value={formData.serviceAreas}
                                onChange={handleChange}
                                placeholder="Delhi, Noida, Ghaziabad"
                                disabled={loading}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
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
                                className="block font-semibold text-gray-900 mb-2"
                            >
                                Service Image URL
                            </label>

                            <input
                                id="image"
                                type="url"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                placeholder="https://..."
                                disabled={loading}
                                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none transition focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                            />

                            <p className="text-sm text-gray-500 mt-1">
                                Provide a publicly accessible image URL.
                            </p>

                        </div>


                        {/* =================================================
                            ACTIONS
                        ================================================= */}

                        <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t">

                            {/* CREATE */}

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >

                                {loading ? (
                                    <>
                                        <Loader2
                                            size={20}
                                            className="animate-spin"
                                        />

                                        Creating Service...
                                    </>
                                ) : (
                                    <>
                                        <Plus
                                            size={20}
                                        />

                                        Create Service
                                    </>
                                )}

                            </button>


                            {/* CANCEL */}

                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={loading}
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

export default CreateService;