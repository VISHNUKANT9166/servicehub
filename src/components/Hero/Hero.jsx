import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import categories from "../../data/categories";
import services from "../../data/services";
import CategoryCard from "../CategoryCard/CategoryCard";
import heroImage from "../../assets/images/hero/hero-illustration.svg";

function Hero() {
    const navigate = useNavigate();

    const [location, setLocation] = useState("");
    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const serviceDropdownRef = useRef(null);
    const locationDropdownRef = useRef(null);
    useEffect(() => {

        const handleClickOutside = (event) => {

            // Service dropdown
            if (
                serviceDropdownRef.current &&
                !serviceDropdownRef.current.contains(event.target)
            ) {
                setSuggestions([]);
            }

            // Location dropdown
            if (
                locationDropdownRef.current &&
                !locationDropdownRef.current.contains(event.target)
            ) {
                setLocationSuggestions([]);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };

    }, []);
    return (
        <section className="bg-gradient-to-br from-gray-50 via-blue-50 to-white min-h-[85vh] flex items-center">

            <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-12">

                {/* Left Side */}

                <motion.div
                    className="w-full lg:w-1/2"
                    initial={{ opacity: 0, x: -60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
                        Find Trusted Professionals
                        <br />
                        Near You
                    </h1>

                    <p className="mt-6 text-lg text-gray-600">
                        Book trusted electricians, plumbers, cleaners,
                        carpenters, beauticians and many more
                        professionals—all in one place.
                    </p>

                    {/* Search Box */}


                    <div className="mt-8 bg-white rounded-xl shadow-lg p-4 flex flex-col md:flex-row gap-4 relative">

                        {/* Location Input */}

                        <div
                            className="flex-1 relative"
                            ref={locationDropdownRef}
                        >

                            <input
                                type="text"
                                placeholder="📍 Enter your location"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                                value={location}
                                onChange={(e) => {

                                    const value = e.target.value;

                                    setLocation(value);

                                    if (value.trim() === "") {
                                        setLocationSuggestions([]);
                                        return;
                                    }

                                    const filteredCities = services.filter((service) =>
                                        service.city
                                            .toLowerCase()
                                            .includes(value.toLowerCase())
                                    );

                                    const uniqueCities = [
                                        ...new Map(
                                            filteredCities.map((service) => [service.city, service])
                                        ).values(),
                                    ];

                                    setLocationSuggestions(uniqueCities);

                                }}
                            />

                            {
                                location.length > 0 &&
                                locationSuggestions.length > 0 && (

                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border z-50">

                                        {
                                            locationSuggestions.map((service) => (

                                                <div
                                                    key={service.city}
                                                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition"
                                                    onClick={() => {

                                                        setLocation(service.city);
                                                        setLocationSuggestions([]);

                                                    }}
                                                >
                                                    📍 {service.city}
                                                </div>

                                            ))
                                        }

                                    </div>

                                )
                            }

                        </div>

                        {/* Service Search */}

                        <div
                            className="flex-1 relative"
                            ref={serviceDropdownRef}
                        >

                            <input
                                type="text"
                                placeholder="🔍 Search for a service"
                                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
                                value={search}
                                onChange={(e) => {

                                    const value = e.target.value;

                                    setSearch(value);

                                    if (value.trim() === "") {
                                        setSuggestions([]);
                                        return;
                                    }

                                    const filtered = services.filter((service) =>
                                        service.title
                                            .toLowerCase()
                                            .includes(value.toLowerCase())
                                    );

                                    const uniqueSuggestions = [
                                        ...new Map(
                                            filtered.map((service) => [service.title, service])
                                        ).values(),
                                    ];

                                    setSuggestions(uniqueSuggestions);

                                }}
                                onKeyDown={(e) => {

                                    if (e.key === "Enter") {

                                        navigate(
                                            `/services?search=${encodeURIComponent(search)}&location=${encodeURIComponent(location)}`
                                        );

                                    }

                                }}
                            />

                            {
                                search.length > 0 &&
                                suggestions.length > 0 && (

                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border z-50">

                                        {
                                            suggestions.map((service) => (

                                                <div
                                                    key={service.id}
                                                    className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition"
                                                    onClick={() => {

                                                        setSearch(service.title);
                                                        setSuggestions([]);

                                                    }}
                                                >
                                                    🔍 {service.title}
                                                </div>

                                            ))
                                        }

                                    </div>

                                )
                            }

                        </div>

                        {/* Search Button */}

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {

                                navigate(
                                    `/services?search=${encodeURIComponent(search)}&location=${encodeURIComponent(location)}`
                                );

                            }}
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition"
                        >
                            Search
                        </motion.button>

                    </div>



                    {/* Categories */}

                    <div className="mt-6 flex flex-wrap gap-3">

                        {categories.map((category) => (
                            <CategoryCard
                                key={category.id}
                                name={category.name}
                                icon={category.icon}
                            />
                        ))}

                    </div>

                    {/* CTA */}

                    <Link to="/services">

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-8 bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            Explore Services
                        </motion.button>

                    </Link>

                </motion.div>

                {/* Right Side */}

                <motion.div
                    className="w-full lg:w-1/2 flex justify-center items-center relative"
                    initial={{ opacity: 0, x: 80 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >

                    <img
                        src={heroImage}
                        alt="Professional Home Services"
                        className="w-full max-w-[650px] object-contain"
                    />

                    {/* Rating */}

                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute top-8 -left-6 bg-white shadow-xl rounded-xl px-5 py-3"
                    >
                        <p className="text-yellow-500 font-bold">
                            ⭐ 4.9 Rating
                        </p>
                    </motion.div>

                    {/* Verified */}

                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{
                            duration: 3.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute bottom-16 -left-4 bg-white shadow-xl rounded-xl px-5 py-3"
                    >
                        <p className="text-green-600 font-bold">
                            ✔ Verified Pros
                        </p>
                    </motion.div>

                    {/* Customers */}

                    <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="absolute top-24 -right-4 bg-white shadow-xl rounded-xl px-5 py-3"
                    >
                        <p className="text-blue-600 font-bold">
                            10K+ Happy Customers
                        </p>
                    </motion.div>

                </motion.div>

            </div >

        </section >
    );
}

export default Hero;