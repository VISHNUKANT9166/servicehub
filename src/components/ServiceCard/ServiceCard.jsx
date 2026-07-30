import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    User,
    MapPin,
    Briefcase,
    Star,
    Heart,
} from "lucide-react";

function ServiceCard({ service }) {
    const navigate = useNavigate();
    const [favorite, setFavorite] = useState(service.favorite);
    useEffect(() => {

        const wishlist =
            JSON.parse(localStorage.getItem("wishlist")) || [];

        setFavorite(wishlist.includes(service.id));

    }, [service.id]);
    return (
        <Link
            to={`/services/${service.id}`}
            className="block"
        >

            <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
                {/* Service Image */}
                <div className="relative h-52 overflow-hidden">

                    <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />

                    {/* Category Badge */}
                    <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow">
                        {service.category}
                    </span>
                    <button
                        onClick={(e) => {

                            e.preventDefault();
                            e.stopPropagation();

                            const wishlist =
                                JSON.parse(localStorage.getItem("wishlist")) || [];

                            if (favorite) {

                                const updatedWishlist =
                                    wishlist.filter((id) => id !== service.id);

                                localStorage.setItem(
                                    "wishlist",
                                    JSON.stringify(updatedWishlist)
                                );

                            } else {

                                wishlist.push(service.id);

                                localStorage.setItem(
                                    "wishlist",
                                    JSON.stringify(wishlist)
                                );

                            }

                            setFavorite(!favorite);

                        }}
                        className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:scale-110 transition"
                    >
                        <Heart
                            size={20}
                            className={
                                favorite
                                    ? "text-red-500 fill-red-500"
                                    : "text-gray-500"
                            }
                        />
                    </button>

                </div>

                {/* Card Content */}
                <div className="p-5">

                    {/* Service Title */}
                    <h2 className="text-2xl font-bold text-gray-800">
                        {service.title}
                    </h2>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mt-3 text-gray-600">
                        <Star
                            size={18}
                            className="text-yellow-500 fill-yellow-500"
                        />

                        <span className="text-sm">
                            {service.rating} ({service.reviews} Reviews)
                        </span>
                    </div>

                    {/* Professional */}
                    <div className="flex items-center gap-2 mt-3 text-gray-700">
                        <User size={18} className="text-blue-600" />
                        <span>{service.professional}</span>
                    </div>

                    {/* Experience */}
                    <div className="flex items-center gap-2 mt-2 text-gray-700">
                        <Briefcase size={18} className="text-blue-600" />
                        <span>{service.experience} Years Experience</span>
                    </div>

                    {/* City */}
                    <div className="flex items-center gap-2 mt-2 text-gray-700">
                        <MapPin size={18} className="text-red-500" />
                        <span>{service.city}</span>
                    </div>

                    {/* Availability */}
                    <div className="mt-4">
                        <span className="inline-block bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">
                            {service.availability}
                        </span>
                    </div>

                    {/* Price */}
                    <div className="mt-5">

                        <p className="text-sm text-gray-500">
                            Starting from
                        </p>

                        <h3 className="text-3xl font-bold text-blue-600">
                            ₹{service.price}
                        </h3>

                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 mt-6">

                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                navigate(`/booking/${service.id}`);
                            }}
                            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold text-center hover:bg-blue-700 transition-colors duration-300"
                        >
                            Book Now
                        </button>

                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                navigate(`/services/${service.id}`);
                            }}
                            className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition duration-300"
                        >
                            View Details
                        </button>

                    </div>

                </div>

            </div>
        </Link>
    );
}

export default ServiceCard;