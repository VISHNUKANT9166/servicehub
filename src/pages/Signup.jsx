import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import toast from "react-hot-toast";

import AuthLayout from "../components/Auth/AuthLayout";
import AuthInput from "../components/Auth/AuthInput";
import SocialLogin from "../components/Auth/SocialLogin";

import { signupUser } from "../services/authService";

function Signup() {
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        agree: false,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Prevent duplicate signup requests
    const submittingRef = useRef(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent duplicate submissions
        if (submittingRef.current) return;

        submittingRef.current = true;

        const newErrors = {};

        // Full Name
        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full Name is required";
        }

        // Email
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = "Enter a valid email";
        }

        // Phone
        if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = "Phone number must be 10 digits";
        }

        // Password
        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password =
                "Password must be at least 6 characters";
        }

        // Confirm Password
        if (!formData.confirmPassword.trim()) {
            newErrors.confirmPassword = "Confirm your password";
        } else if (
            formData.password !== formData.confirmPassword
        ) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        // Terms & Conditions
        if (!formData.agree) {
            newErrors.agree =
                "Please accept Terms & Conditions";
        }

        setErrors(newErrors);

        // Stop if validation fails
        if (Object.keys(newErrors).length > 0) {
            submittingRef.current = false;
            toast.error("Please fix the highlighted errors.");
            return;
        }

        try {
            setLoading(true);

            // Send data to backend
            const data = await signupUser({
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
            });

            if (data.success) {
                // Save JWT returned by backend
                localStorage.setItem("token", data.token);

                toast.success("Account created successfully!");

                // Redirect to login
                navigate("/login");
            }

        } catch (error) {
            console.error("Signup Error:", error);

            const message =
                error.response?.data?.message ||
                "Signup failed. Please try again.";

            toast.error(message);

        } finally {
            submittingRef.current = false;
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Create Account"
            subtitle="Join ServiceHub today"
        >
            <form onSubmit={handleSubmit}>

                {/* Full Name */}
                <AuthInput
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    error={errors.fullName}
                />

                {/* Email */}
                <AuthInput
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    error={errors.email}
                />

                {/* Phone */}
                <AuthInput
                    label="Phone Number"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    error={errors.phone}
                />

                {/* Password */}
                <AuthInput
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password"
                    error={errors.password}
                />

                {/* Confirm Password */}
                <AuthInput
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    error={errors.confirmPassword}
                />

                {/* Terms & Conditions */}
                <div className="mb-5">

                    <label className="flex items-center gap-2 text-sm text-gray-600">

                        <input
                            type="checkbox"
                            name="agree"
                            checked={formData.agree}
                            onChange={handleChange}
                        />

                        I agree to the Terms & Conditions

                    </label>

                    {errors.agree && (
                        <p className="text-red-500 text-sm mt-2">
                            {errors.agree}
                        </p>
                    )}

                </div>

                {/* Signup Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {loading
                        ? "Creating Account..."
                        : "Create Account"}
                </button>

            </form>

            {/* Social Login */}
            <SocialLogin />

            {/* Login Link */}
            <p className="text-center mt-6 text-gray-600">
                Already have an account?{" "}

                <Link
                    to="/login"
                    className="text-blue-600 font-semibold hover:underline"
                >
                    Login
                </Link>
            </p>

        </AuthLayout>
    );
}

export default Signup;