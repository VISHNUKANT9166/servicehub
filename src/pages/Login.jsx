import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";

import AuthLayout from "../components/Auth/AuthLayout";
import AuthInput from "../components/Auth/AuthInput";
import SocialLogin from "../components/Auth/SocialLogin";

import { useAuth } from "../context/AuthContext";
import { loginUser } from "../services/authService";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: false,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const submittingRef = useRef(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        // Remove error while typing
        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent duplicate form submissions
        if (submittingRef.current) return;

        submittingRef.current = true;

        const newErrors = {};

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        }

        // Password validation
        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
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

            // Call Login API
            const data = await loginUser({
                email: formData.email,
                password: formData.password,
            });

            if (data.success) {
                // Save JWT token
                localStorage.setItem("token", data.token);

                // Save user in AuthContext
                login(data.user);

                // Remove any existing toast
                toast.dismiss();

                // Show only one success toast
                toast.success("Login Successful!");

                // Redirect to dashboard
                navigate("/dashboard");
            }
        } catch (error) {
            console.error("Login Error:", error);

            const message =
                error.response?.data?.message ||
                "Login failed. Please try again.";

            toast.error(message);
        } finally {
            submittingRef.current = false;
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Login to continue using ServiceHub"
        >
            <form onSubmit={handleSubmit}>

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

                {/* Password */}
                <AuthInput
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    error={errors.password}
                />

                {/* Remember Me + Forgot Password */}
                <div className="flex items-center justify-between mb-5">

                    <label className="flex items-center gap-2 text-sm text-gray-600">
                        <input
                            type="checkbox"
                            name="remember"
                            checked={formData.remember}
                            onChange={handleChange}
                        />

                        Remember Me
                    </label>

                    <Link
                        to="/forgot-password"
                        className="text-sm text-blue-600 hover:underline"
                    >
                        Forgot Password?
                    </Link>

                </div>

                {/* Login Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? "Logging In..." : "Login"}
                </button>

            </form>

            {/* Social Login */}
            <SocialLogin />

            {/* Signup Link */}
            <p className="text-center mt-6 text-gray-600">
                Don't have an account?{" "}

                <Link
                    to="/signup"
                    className="text-blue-600 font-semibold hover:underline"
                >
                    Sign Up
                </Link>
            </p>

        </AuthLayout>
    );
}

export default Login;