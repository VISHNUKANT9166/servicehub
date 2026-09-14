import { useRef, useState } from "react";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

import {
    createProfessionalProfile,
} from "../services/professionalService";


function BecomeProfessional() {

    // =====================================================
    // FILE INPUT REFERENCES
    // =====================================================

    const profileImageInputRef = useRef(null);
    const certificateInputRef = useRef(null);


    // =====================================================
    // FORM STATE
    // =====================================================

    const [formData, setFormData] = useState({
        profession: "",
        category: "",
        experience: "",
        serviceAreas: "",
        startingCharges: "",
        description: "",
        profileImage: null,
        certificate: null,
        termsAccepted: false,
    });


    const [loading, setLoading] = useState(false);

    const [successMessage, setSuccessMessage] =
        useState("");

    const [errorMessage, setErrorMessage] =
        useState("");


    // =====================================================
    // HANDLE INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value,
            type,
            checked,
        } = e.target;


        setFormData((previousData) => ({
            ...previousData,

            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));


        // Clear previous messages
        setErrorMessage("");
        setSuccessMessage("");
    };


    // =====================================================
    // HANDLE FILE CHANGE
    // =====================================================

    const handleFileChange = (e) => {

        const {
            name,
            files,
        } = e.target;


        const file = files?.[0];

        if (!file) {
            return;
        }


        // =================================================
        // FILE SIZE VALIDATION
        // Maximum: 5MB
        // =================================================

        const maxFileSize =
            5 * 1024 * 1024;


        if (file.size > maxFileSize) {

            setErrorMessage(
                "File size must not exceed 5MB."
            );

            e.target.value = "";

            return;
        }


        // =================================================
        // PROFILE IMAGE VALIDATION
        // =================================================

        if (name === "profileImage") {

            const allowedImageTypes = [
                "image/jpeg",
                "image/png",
                "image/webp",
            ];


            if (
                !allowedImageTypes.includes(
                    file.type
                )
            ) {

                setErrorMessage(
                    "Profile image must be JPG, PNG, or WEBP."
                );

                e.target.value = "";

                return;
            }
        }


        // =================================================
        // CERTIFICATE VALIDATION
        // =================================================

        if (name === "certificate") {

            const allowedCertificateTypes = [
                "image/jpeg",
                "image/png",
                "application/pdf",
            ];


            if (
                !allowedCertificateTypes.includes(
                    file.type
                )
            ) {

                setErrorMessage(
                    "Certificate must be JPG, PNG, or PDF."
                );

                e.target.value = "";

                return;
            }
        }


        // =================================================
        // STORE ACTUAL FILE OBJECT
        // =================================================

        setFormData((previousData) => ({
            ...previousData,
            [name]: file,
        }));


        setErrorMessage("");
        setSuccessMessage("");
    };


    // =====================================================
    // RESET FORM
    // =====================================================

    const resetForm = () => {

        setFormData({
            profession: "",
            category: "",
            experience: "",
            serviceAreas: "",
            startingCharges: "",
            description: "",
            profileImage: null,
            certificate: null,
            termsAccepted: false,
        });


        // Reset actual file input fields

        if (profileImageInputRef.current) {
            profileImageInputRef.current.value = "";
        }


        if (certificateInputRef.current) {
            certificateInputRef.current.value = "";
        }
    };


    // =====================================================
    // FORM SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();


        setErrorMessage("");
        setSuccessMessage("");


        // =================================================
        // CHECK TERMS
        // =================================================

        if (!formData.termsAccepted) {

            setErrorMessage(
                "Please accept the Terms & Conditions."
            );

            return;
        }


        // =================================================
        // VALIDATE PROFESSION
        // =================================================

        if (!formData.profession.trim()) {

            setErrorMessage(
                "Please enter your profession."
            );

            return;
        }


        // =================================================
        // VALIDATE CATEGORY
        // =================================================

        if (!formData.category) {

            setErrorMessage(
                "Please select a service category."
            );

            return;
        }


        // =================================================
        // VALIDATE EXPERIENCE
        // =================================================

        const experience =
            Number(formData.experience);


        if (
            formData.experience === "" ||
            !Number.isFinite(experience) ||
            experience < 0
        ) {

            setErrorMessage(
                "Please enter a valid experience."
            );

            return;
        }


        // =================================================
        // VALIDATE STARTING CHARGES
        // =================================================

        const startingCharges =
            Number(formData.startingCharges);


        if (
            formData.startingCharges === "" ||
            !Number.isFinite(startingCharges) ||
            startingCharges < 0
        ) {

            setErrorMessage(
                "Please enter valid starting charges."
            );

            return;
        }


        // =================================================
        // VALIDATE PROFILE IMAGE
        // =================================================

        if (!formData.profileImage) {

            setErrorMessage(
                "Please upload your profile photo."
            );

            return;
        }


        // =================================================
        // VALIDATE CERTIFICATE
        // =================================================

        if (!formData.certificate) {

            setErrorMessage(
                "Please upload your certificate."
            );

            return;
        }


        try {

            setLoading(true);


            // =================================================
            // CREATE FORMDATA
            // =================================================

            const professionalData =
                new FormData();


            // =================================================
            // TEXT DATA
            // =================================================

            professionalData.append(
                "profession",
                formData.profession.trim()
            );


            professionalData.append(
                "category",
                formData.category.trim()
            );


            professionalData.append(
                "experience",
                String(experience)
            );


            professionalData.append(
                "description",
                formData.description.trim()
            );


            professionalData.append(
                "startingCharges",
                String(startingCharges)
            );


            professionalData.append(
                "termsAccepted",
                "true"
            );


            // =================================================
            // SERVICE AREAS
            // =================================================

            const serviceAreas =
                formData.serviceAreas
                    .split(",")
                    .map((area) => area.trim())
                    .filter(Boolean);


            professionalData.append(
                "serviceAreas",
                JSON.stringify(serviceAreas)
            );


            // =================================================
            // SKILLS
            // =================================================

            professionalData.append(
                "skills",
                JSON.stringify([])
            );


            // =================================================
            // FILES
            // =================================================

            professionalData.append(
                "profileImage",
                formData.profileImage
            );


            professionalData.append(
                "certificate",
                formData.certificate
            );


            // =================================================
            // API REQUEST
            // =================================================

            const response =
                await createProfessionalProfile(
                    professionalData
                );


            // =================================================
            // SUCCESS
            // =================================================

            setSuccessMessage(
                response.message ||
                "Professional application submitted successfully."
            );


            // =================================================
            // RESET FORM
            // =================================================

            resetForm();


        } catch (error) {

            console.error(
                "Professional Application Error:",
                error
            );


            const message =
                error.response?.data?.message ||
                "Something went wrong. Please try again.";


            setErrorMessage(message);

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // UI
    // =====================================================

    return (
        <>
            <Navbar />


            <main className="bg-gray-50 min-h-screen">

                <div className="max-w-5xl mx-auto px-6 py-10">

                    {/* PAGE HEADER */}

                    <h1 className="text-4xl font-bold text-center">
                        Become a Professional
                    </h1>


                    <p className="text-gray-500 text-center mt-3">
                        Join ServiceHub and start earning by offering
                        your services.
                    </p>


                    <form
                        onSubmit={handleSubmit}
                        className="bg-white rounded-3xl shadow-lg p-8 mt-10"
                    >

                        <h2 className="text-2xl font-bold mb-8">
                            Professional Registration Form
                        </h2>


                        {/* ERROR MESSAGE */}

                        {errorMessage && (
                            <div className="mb-6 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3">
                                {errorMessage}
                            </div>
                        )}


                        {/* SUCCESS MESSAGE */}

                        {successMessage && (
                            <div className="mb-6 rounded-xl bg-green-50 border border-green-200 text-green-700 px-4 py-3">
                                {successMessage}
                            </div>
                        )}


                        {/* PROFESSIONAL DETAILS */}

                        <div className="grid md:grid-cols-2 gap-6">

                            {/* Profession */}

                            <div>

                                <label className="block font-medium mb-2">
                                    Profession
                                </label>

                                <input
                                    type="text"
                                    name="profession"
                                    value={formData.profession}
                                    onChange={handleChange}
                                    placeholder="e.g. Electrician"
                                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>


                            {/* Category */}

                            <div>

                                <label className="block font-medium mb-2">
                                    Service Category
                                </label>

                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                >

                                    <option value="">
                                        Select Category
                                    </option>

                                    <option value="Plumber">
                                        Plumber
                                    </option>

                                    <option value="Electrician">
                                        Electrician
                                    </option>

                                    <option value="Carpenter">
                                        Carpenter
                                    </option>

                                    <option value="AC Repair">
                                        AC Repair
                                    </option>

                                    <option value="Home Cleaning">
                                        Home Cleaning
                                    </option>

                                    <option value="Salon at Home">
                                        Salon at Home
                                    </option>

                                    <option value="Pest Control">
                                        Pest Control
                                    </option>

                                    <option value="RO Service">
                                        RO Service
                                    </option>

                                </select>

                            </div>


                            {/* Experience */}

                            <div>

                                <label className="block font-medium mb-2">
                                    Experience
                                </label>

                                <input
                                    type="number"
                                    name="experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    min="0"
                                    step="1"
                                    placeholder="Years of Experience"
                                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>


                            {/* Starting Charges */}

                            <div>

                                <label className="block font-medium mb-2">
                                    Starting Charges (₹)
                                </label>

                                <input
                                    type="number"
                                    name="startingCharges"
                                    value={formData.startingCharges}
                                    onChange={handleChange}
                                    min="0"
                                    placeholder="Enter starting charges"
                                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>


                            {/* Service Areas */}

                            <div className="md:col-span-2">

                                <label className="block font-medium mb-2">
                                    Service Areas
                                </label>

                                <input
                                    type="text"
                                    name="serviceAreas"
                                    value={formData.serviceAreas}
                                    onChange={handleChange}
                                    placeholder="e.g. Delhi, Noida, Ghaziabad"
                                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />

                                <p className="text-sm text-gray-500 mt-2">
                                    Separate multiple areas using commas.
                                </p>

                            </div>

                        </div>


                        {/* ABOUT YOURSELF */}

                        <div className="mt-8">

                            <label className="block font-medium mb-2">
                                About Yourself
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="5"
                                maxLength="2000"
                                placeholder="Tell customers about yourself, your experience and skills..."
                                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            />

                            <p className="text-sm text-gray-500 mt-2">
                                Maximum 2000 characters.
                            </p>

                        </div>


                        {/* DOCUMENTS */}

                        <div className="grid md:grid-cols-2 gap-6 mt-8">

                            {/* PROFILE PHOTO */}

                            <div>

                                <label className="block font-medium mb-2">
                                    Upload Profile Photo
                                </label>

                                <input
                                    ref={profileImageInputRef}
                                    type="file"
                                    name="profileImage"
                                    accept=".jpg,.jpeg,.png,.webp"
                                    onChange={handleFileChange}
                                    className="w-full border rounded-xl px-4 py-3"
                                />

                                <p className="text-sm text-gray-500 mt-2">
                                    JPG, PNG or WEBP. Maximum 5MB.
                                </p>


                                {formData.profileImage && (
                                    <p className="text-sm text-green-600 mt-2">
                                        Selected:{" "}
                                        {formData.profileImage.name}
                                    </p>
                                )}

                            </div>


                            {/* CERTIFICATE */}

                            <div>

                                <label className="block font-medium mb-2">
                                    Upload Certificate
                                </label>

                                <input
                                    ref={certificateInputRef}
                                    type="file"
                                    name="certificate"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={handleFileChange}
                                    className="w-full border rounded-xl px-4 py-3"
                                />

                                <p className="text-sm text-gray-500 mt-2">
                                    PDF, JPG or PNG. Maximum 5MB.
                                </p>


                                {formData.certificate && (
                                    <p className="text-sm text-green-600 mt-2">
                                        Selected:{" "}
                                        {formData.certificate.name}
                                    </p>
                                )}

                            </div>

                        </div>


                        {/* TERMS */}

                        <div className="mt-8 flex items-start gap-3">

                            <input
                                type="checkbox"
                                id="terms"
                                name="termsAccepted"
                                checked={formData.termsAccepted}
                                onChange={handleChange}
                                className="mt-1 w-5 h-5"
                            />

                            <label
                                htmlFor="terms"
                                className="text-gray-600"
                            >
                                I agree to the Terms & Conditions and
                                confirm that all the information provided
                                is correct.
                            </label>

                        </div>


                        {/* SUBMIT */}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full text-white py-4 rounded-xl font-semibold text-lg mt-8 transition ${loading
                                    ? "bg-blue-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >

                            {loading
                                ? "Submitting Application..."
                                : "Submit Application"}

                        </button>

                    </form>

                </div>

            </main>


            <Footer />
        </>
    );
}


export default BecomeProfessional;