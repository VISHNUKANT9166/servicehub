import { Link } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

import AuthLayout from "../components/Auth/AuthLayout";
import AuthInput from "../components/Auth/AuthInput";
import SocialLogin from "../components/Auth/SocialLogin";

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

    const handleSubmit = (e) => {

        e.preventDefault();

        let newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        }

        if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
            newErrors.email = "Enter a valid email";
        }

        if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = "Phone number must be 10 digits";
        }

        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (!formData.confirmPassword.trim()) {
            newErrors.confirmPassword = "Confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (!formData.agree) {
            newErrors.agree = "Please accept Terms & Conditions";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            toast.error("Please fix the highlighted errors.");
            return;
        }

        setLoading(true);

        setTimeout(() => {

            setLoading(false);

            toast.success("Account created successfully!");

            console.log(formData);

            // Backend Integration Later

        }, 1500);

    };

    return (

        <AuthLayout
            title="Create Account"
            subtitle="Join ServiceHub today"
        >

            <form onSubmit={handleSubmit}>

                <AuthInput
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    error={errors.fullName}
                />

                <AuthInput
                    label="Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    error={errors.email}
                />

                <AuthInput
                    label="Phone Number"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    error={errors.phone}
                />

                <AuthInput
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password"
                    error={errors.password}
                />

                <AuthInput
                    label="Confirm Password"
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    error={errors.confirmPassword}
                />

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

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                    {loading ? "Creating Account..." : "Create Account"}
                </button>

            </form>

            <SocialLogin />

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