import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ServiceCard from "../components/ServiceCard/ServiceCard";

import { getWishlist } from "../services/wishlistService";

function Wishlist() {
    const [wishlistServices, setWishlistServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getWishlist();

                if (data.success && Array.isArray(data.wishlist)) {
                    // Backend already returns populated Service documents
                    const validServices = data.wishlist.filter(
                        (service) =>
                            service &&
                            typeof service === "object" &&
                            service._id
                    );

                    setWishlistServices(validServices);
                } else {
                    setWishlistServices([]);
                }
            } catch (error) {
                console.error(
                    "Wishlist Page Error:",
                    error
                );

                if (error.response?.status === 401) {
                    setError(
                        "Please login to view your wishlist."
                    );
                } else {
                    setError(
                        error.response?.data?.message ||
                        "Unable to load your wishlist."
                    );
                }

                setWishlistServices([]);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlist();
    }, []);

    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 py-10">

                    {/* Header */}
                    <div className="mb-10">

                        <p className="text-gray-500 text-sm mb-3">
                            Home /
                            <span className="text-blue-600 font-medium">
                                {" "}Wishlist
                            </span>
                        </p>

                        <h1 className="text-4xl font-bold text-gray-900">
                            My Wishlist
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Your favourite services will appear here.
                        </p>

                    </div>

                    {/* Content */}
                    <div className="mt-8">

                        {/* Loading */}
                        {loading && (
                            <div className="bg-white rounded-2xl shadow-md p-12 text-center">

                                <div className="text-4xl mb-4">
                                    ⏳
                                </div>

                                <h2 className="text-xl font-semibold text-gray-800">
                                    Loading Wishlist...
                                </h2>

                                <p className="text-gray-500 mt-2">
                                    Please wait while we fetch your favourite services.
                                </p>

                            </div>
                        )}

                        {/* Error */}
                        {!loading && error && (
                            <div className="bg-white rounded-2xl shadow-md p-12 text-center">

                                <div className="text-5xl mb-5">
                                    ⚠️
                                </div>

                                <h2 className="text-2xl font-bold text-gray-800">
                                    Unable to Load Wishlist
                                </h2>

                                <p className="text-gray-500 mt-3">
                                    {error}
                                </p>

                                <Link
                                    to="/login"
                                    className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                                >
                                    Login
                                </Link>

                            </div>
                        )}

                        {/* Empty Wishlist */}
                        {!loading &&
                            !error &&
                            wishlistServices.length === 0 && (
                                <div className="bg-white rounded-2xl shadow-md p-12 text-center">

                                    <div className="text-6xl mb-6">
                                        ❤️
                                    </div>

                                    <h2 className="text-2xl font-bold text-gray-800">
                                        No Favourite Services Yet
                                    </h2>

                                    <p className="text-gray-500 mt-3">
                                        Start adding services to your wishlist.
                                    </p>

                                    <Link
                                        to="/services"
                                        className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                                    >
                                        Browse Services
                                    </Link>

                                </div>
                            )}

                        {/* Wishlist Services */}
                        {!loading &&
                            !error &&
                            wishlistServices.length > 0 && (
                                <>
                                    <div className="bg-white rounded-2xl shadow-md p-5 mb-6">

                                        <h2 className="text-2xl font-bold text-gray-800">
                                            Favourite Services
                                        </h2>

                                        <p className="text-gray-500 mt-1">
                                            Showing{" "}
                                            {wishlistServices.length}{" "}
                                            {wishlistServices.length === 1
                                                ? "service"
                                                : "services"}
                                        </p>

                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                                        {wishlistServices.map(
                                            (service) => (
                                                <ServiceCard
                                                    key={service._id}
                                                    service={service}
                                                />
                                            )
                                        )}

                                    </div>
                                </>
                            )}

                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}

export default Wishlist;