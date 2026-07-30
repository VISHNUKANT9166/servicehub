import { useState } from "react";
import services from "../data/services";
import { useSearchParams } from "react-router-dom";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import SearchBar from "../components/SearchBar/SearchBar";
import ServiceFilters from "../components/ServiceFilters/ServiceFilters";
import ServiceGrid from "../components/ServiceGrid/ServiceGrid";

function Services() {
    const [searchParams] = useSearchParams();

    const search = searchParams.get("search") || "";
    const location = searchParams.get("location") || "";
    console.log(search);
    console.log(location);

    // =========================
    // State
    // =========================

    const [searchTerm, setSearchTerm] = useState(search);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [maxPrice, setMaxPrice] = useState(1000);
    const [selectedRating, setSelectedRating] = useState(0);
    const [selectedAvailability, setSelectedAvailability] = useState("All");
    const [sortBy, setSortBy] = useState("default");

    // =========================
    // Reset Filters
    // =========================

    const resetFilters = () => {
        setSearchTerm("");
        setSelectedCategory("All");
        setMaxPrice(1000);
        setSelectedRating(0);
        setSelectedAvailability("All");
        setSortBy("default");
    };

    // =========================
    // Filter + Sort Services
    // =========================

    const filteredServices = services
        .filter((service) => {

            const matchesSearch =
                service.title
                    .toLowerCase()
                    .includes(
                        (searchTerm || search).toLowerCase()
                    );

            const matchesLocation =
                location === "" ||
                service.city
                    .toLowerCase()
                    .includes(location.toLowerCase());

            const matchesCategory =
                selectedCategory === "All" ||
                service.category === selectedCategory;

            const matchesPrice =
                service.price <= maxPrice;

            const matchesRating =
                selectedRating === 0 ||
                service.rating >= selectedRating;

            const matchesAvailability =
                selectedAvailability === "All" ||
                service.availability === selectedAvailability;

            return (
                matchesSearch &&
                matchesLocation &&
                matchesCategory &&
                matchesPrice &&
                matchesRating &&
                matchesAvailability
            );
        })
        .sort((a, b) => {

            switch (sortBy) {

                case "price-low":
                    return a.price - b.price;

                case "price-high":
                    return b.price - a.price;

                case "rating":
                    return b.rating - a.rating;

                default:
                    return 0;
            }

        });
    const hasServices = filteredServices.length > 0;

    return (
        <>
            <Navbar />

            <main className="bg-gray-50 min-h-screen">

                <div className="max-w-7xl mx-auto px-6 py-10">

                    {/* Breadcrumb */}

                    <p className="text-gray-500 text-sm mb-4">
                        Home /
                        <span className="text-blue-600 font-medium">
                            {" "}Services
                        </span>
                    </p>

                    {/* Heading */}

                    <div className="mb-10">

                        <h1 className="text-4xl font-bold text-gray-900">
                            Browse Services
                        </h1>

                        <p className="text-gray-600 mt-3">
                            Find trusted professionals for every home service.
                        </p>

                    </div>

                    {/* Search */}

                    <div className="mb-10">

                        <SearchBar
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                        />

                    </div>

                    {/* Layout */}

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* Sidebar */}

                        <aside className="lg:col-span-3 lg:sticky lg:top-24 h-fit">

                            <ServiceFilters
                                selectedCategory={selectedCategory}
                                setSelectedCategory={setSelectedCategory}
                                maxPrice={maxPrice}
                                setMaxPrice={setMaxPrice}
                                selectedRating={selectedRating}
                                setSelectedRating={setSelectedRating}
                                selectedAvailability={selectedAvailability}
                                setSelectedAvailability={setSelectedAvailability}
                                resetFilters={resetFilters}
                            />

                        </aside>

                        {/* Right Section */}

                        <section className="lg:col-span-9">

                            {/* Toolbar */}

                            <div className="bg-white rounded-2xl shadow-md p-5 mb-6 flex flex-col md:flex-row md:items-center md:justify-between">

                                <div>

                                    <h2 className="text-2xl font-bold text-gray-800">
                                        Browse Services
                                    </h2>

                                    <p className="text-gray-500 mt-1">
                                        Showing {filteredServices.length} services

                                    </p>

                                </div>

                                <div className="mt-4 md:mt-0">

                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                    >

                                        <option value="default">
                                            Sort By
                                        </option>

                                        <option value="price-low">
                                            Price: Low to High
                                        </option>

                                        <option value="price-high">
                                            Price: High to Low
                                        </option>

                                        <option value="rating">
                                            Highest Rated
                                        </option>

                                    </select>

                                </div>

                            </div>

                            {/* Service Cards */}

                            {hasServices ? (

                                <ServiceGrid
                                    services={filteredServices}
                                />

                            ) : (

                                <div className="bg-white rounded-2xl shadow-md p-16 text-center flex flex-col items-center">
                                    <div className="text-6xl mb-6">
                                        🔍
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800">
                                        No Services Found
                                    </h3>

                                    <p className="text-gray-500 mt-3">
                                        Try changing your search or filters.
                                    </p>
                                    <button
                                        onClick={resetFilters}
                                        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
                                    >
                                        Reset Filters
                                    </button>
                                </div>

                            )}
                        </section>

                    </div>

                </div>

            </main>

            <Footer />
        </>
    );
}

export default Services;