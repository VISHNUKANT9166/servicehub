import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import services from "../data/services";

import ServiceCard from "../components/ServiceCard/ServiceCard";

function Wishlist() {

    const [wishlistServices, setWishlistServices] = useState([]);

    useEffect(() => {

        const wishlist =
            JSON.parse(localStorage.getItem("wishlist")) || [];

        const filteredServices = services.filter((service) =>
            wishlist.includes(service.id)
        );

        setWishlistServices(filteredServices);

    }, []);
    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-gray-50">

                <div className="max-w-7xl mx-auto px-6 py-10">

                    <h1 className="text-4xl font-bold">
                        My Wishlist
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Your favourite services will appear here.
                    </p>
                    <div className="mt-10">

                        {wishlistServices.length === 0 ? (

                            <div className="bg-white rounded-2xl shadow-md p-10 text-center">

                                <h2 className="text-2xl font-bold text-gray-700">
                                    No Favourite Services Yet ❤️
                                </h2>

                                <p className="text-gray-500 mt-3">
                                    Start adding services to your wishlist.
                                </p>

                                <Link
                                    to="/services"
                                    className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
                                >
                                    Browse Services
                                </Link>

                            </div>

                        ) : (

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                                {wishlistServices.map((service) => (

                                    <ServiceCard
                                        key={service.id}
                                        service={service}
                                    />

                                ))}

                            </div>

                        )}

                    </div>

                </div>

            </main>

            <Footer />
        </>
    );
}

export default Wishlist;