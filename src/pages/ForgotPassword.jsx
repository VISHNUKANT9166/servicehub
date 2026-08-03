import { Link } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import AuthLayout from "../components/Auth/AuthLayout";
import AuthInput from "../components/Auth/AuthInput";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const handleSubmit = (e) => {

        e.preventDefault();

        if (!email.trim()) {

            setError("Email is required");

            toast.error("Please enter your email.");

            return;

        }

        setError("");

        setLoading(true);

        setTimeout(() => {

            setLoading(false);

            toast.success("Password reset link sent successfully!");

            console.log(email);

        }, 1500);

    };

    return (

        <AuthLayout
            title="Forgot Password"
            subtitle="Enter your email to receive a password reset link."
        >
            <form onSubmit={handleSubmit}>

                <AuthInput
                    label="Email"
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => {

                        setEmail(e.target.value);
                        setError("");

                    }}
                    placeholder="Enter your registered email"
                    error={error}
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
                >
                    {
                        loading
                            ? "Sending..."
                            : "Send Reset Link"
                    }
                </button>

            </form>
            <p className="text-center mt-6 text-gray-600">

                Remember your password?{" "}

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

export default ForgotPassword;