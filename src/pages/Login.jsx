import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useState } from "react";
import AuthLayout from "../components/Auth/AuthLayout";
import AuthInput from "../components/Auth/AuthInput";
import SocialLogin from "../components/Auth/SocialLogin";

function Login() {

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        remember: false,
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

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

    const handleSubmit = (e) => {

        e.preventDefault();

        let newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        }

        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {

            toast.error("Please fix the highlighted errors.");

            return;
        }
        setLoading(true);
        console.log("Login Data:", formData);

        // Backend integration later
        setTimeout(() => {

            setLoading(false);

            toast.success("Login Successful!");

            console.log("Login Data:", formData);

        }, 1500);

        return;

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

                {/* Remember + Forgot */}

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
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                >
                    {
                        loading
                            ? "Logging In..."
                            : "Login"
                    }
                </button>

            </form>

            <SocialLogin />

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