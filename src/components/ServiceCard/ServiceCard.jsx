import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
    User,
    MapPin,
    Briefcase,
    Star,
    Heart,
} from "lucide-react";

import {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
} from "../../services/wishlistService";


function ServiceCard({ service }) {

    const navigate = useNavigate();

    const [favorite, setFavorite] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);


    // =========================================
    // Safety check
    // =========================================

    if (!service) {
        return null;
    }


    // =========================================
    // Service ID
    // =========================================

    const serviceId = service._id;


    // =========================================
    // Professional Data
    // =========================================

    const professional = service.professional;

    const professionalName =
        professional &&
            typeof professional === "object"
            ? professional.name ||
            professional.user?.name ||
            "Professional"
            : "Professional";


    const experience =
        professional &&
            typeof professional === "object"
            ? professional.experience || 0
            : 0;


    // =========================================
    // Location
    // =========================================

    const location =
        Array.isArray(service.serviceAreas) &&
            service.serviceAreas.length > 0
            ? service.serviceAreas[0]
            : "Location not specified";


    // =========================================
    // Rating
    // =========================================

    const rating = service.rating || 0;

    const reviews =
        service.totalReviews ||
        service.reviews ||
        0;


    // =========================================
    // Availability
    // =========================================

    const availability =
        service.availability || "Available";


    // =========================================
    // Fetch Wishlist Status
    // =========================================

    useEffect(() => {

        if (!serviceId) {
            return;
        }


        // User login check

        const token = localStorage.getItem("token");


        // If user is not logged in,
        // don't call protected wishlist API.

        if (!token) {

            setFavorite(false);

            return;
        }


        const fetchWishlist = async () => {

            try {

                const data = await getWishlist();


                if (
                    data.success &&
                    Array.isArray(data.wishlist)
                ) {

                    const exists =
                        data.wishlist.some((item) => {

                            const wishlistId =
                                typeof item === "object"
                                    ? item._id
                                    : item;


                            return (
                                String(wishlistId) ===
                                String(serviceId)
                            );
                        });


                    setFavorite(exists);
                }

            } catch (error) {

                // 401 means user is not authorized.
                // Don't show unnecessary error.

                if (
                    error.response?.status !== 401
                ) {

                    console.error(
                        "Wishlist Fetch Error:",
                        error
                    );
                }


                setFavorite(false);
            }

        };


        fetchWishlist();

    }, [serviceId]);


    // =========================================
    // Add / Remove Wishlist
    // =========================================

    const handleWishlist = async (e) => {

        e.preventDefault();
        e.stopPropagation();


        if (
            !serviceId ||
            wishlistLoading
        ) {
            return;
        }


        // Check login

        const token =
            localStorage.getItem("token");


        if (!token) {

            toast.error(
                "Please login to manage your wishlist."
            );

            navigate("/login");

            return;
        }


        try {

            setWishlistLoading(true);


            // =====================================
            // Remove
            // =====================================

            if (favorite) {

                const data =
                    await removeFromWishlist(
                        serviceId
                    );


                if (data.success) {

                    setFavorite(false);

                    toast.success(
                        "Removed from wishlist"
                    );
                }

            }

            // =====================================
            // Add
            // =====================================

            else {

                const data =
                    await addToWishlist(
                        serviceId
                    );


                if (data.success) {

                    setFavorite(true);

                    toast.success(
                        "Added to wishlist ❤️"
                    );
                }
            }

        } catch (error) {

            console.error(
                "Wishlist Error:",
                error
            );


            const message =
                error.response?.data?.message ||
                "Unable to update wishlist.";


            toast.error(message);

        } finally {

            setWishlistLoading(false);

        }
    };


    // =========================================
    // Render
    // =========================================

    return (

        <Link
            to={`/services/${serviceId}`}
            className="block"
        >

            <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">


                {/* ================================= */}
                {/* Service Image */}
                {/* ================================= */}

                <div className="relative h-52 overflow-hidden bg-gray-200">

                    {service.image ? (

                        <img
                            src={service.image}
                            alt={
                                service.title ||
                                "Service"
                            }
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        />

                    ) : (

                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl font-semibold">
                            Service
                        </div>

                    )}


                    {/* Category */}

                    <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow">

                        {service.category ||
                            "Service"}

                    </span>


                    {/* Wishlist */}

                    <button
                        type="button"
                        onClick={handleWishlist}
                        disabled={
                            wishlistLoading
                        }
                        aria-label={
                            favorite
                                ? "Remove from wishlist"
                                : "Add to wishlist"
                        }
                        className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-md hover:scale-110 transition disabled:opacity-50"
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


                {/* ================================= */}
                {/* Card Content */}
                {/* ================================= */}

                <div className="p-5">


                    {/* Title */}

                    <h2 className="text-2xl font-bold text-gray-800">

                        {service.title ||
                            "Untitled Service"}

                    </h2>


                    {/* Rating */}

                    <div className="flex items-center gap-2 mt-3 text-gray-600">

                        <Star
                            size={18}
                            className="text-yellow-500 fill-yellow-500"
                        />

                        {rating > 0 ? (

                            <span className="text-sm">

                                {rating} (
                                {reviews} Reviews)

                            </span>

                        ) : (

                            <span className="text-sm">
                                New Service
                            </span>

                        )}

                    </div>


                    {/* Professional */}

                    <div className="flex items-center gap-2 mt-3 text-gray-700">

                        <User
                            size={18}
                            className="text-blue-600"
                        />

                        <span>
                            {professionalName}
                        </span>

                    </div>


                    {/* Experience */}

                    <div className="flex items-center gap-2 mt-2 text-gray-700">

                        <Briefcase
                            size={18}
                            className="text-blue-600"
                        />

                        <span>

                            {experience > 0
                                ? `${experience} Years Experience`
                                : "Professional Service"}

                        </span>

                    </div>


                    {/* Location */}

                    <div className="flex items-center gap-2 mt-2 text-gray-700">

                        <MapPin
                            size={18}
                            className="text-red-500"
                        />

                        <span>
                            {location}
                        </span>

                    </div>


                    {/* Availability */}

                    <div className="mt-4">

                        <span className="inline-block bg-green-100 text-green-700 text-sm font-medium px-3 py-1 rounded-full">

                            {availability}

                        </span>

                    </div>


                    {/* Price */}

                    <div className="mt-5">

                        <p className="text-sm text-gray-500">
                            Starting from
                        </p>

                        <h3 className="text-3xl font-bold text-blue-600">

                            ₹{service.price || 0}

                        </h3>

                    </div>


                    {/* Buttons */}

                    <div className="flex gap-3 mt-6">


                        {/* Book Now */}

                        <button
                            type="button"
                            onClick={(e) => {

                                e.preventDefault();
                                e.stopPropagation();

                                navigate(
                                    `/booking/${serviceId}`
                                );

                            }}
                            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold text-center hover:bg-blue-700 transition-colors duration-300"
                        >

                            Book Now

                        </button>


                        {/* View Details */}

                        <button
                            type="button"
                            onClick={(e) => {

                                e.preventDefault();
                                e.stopPropagation();

                                navigate(
                                    `/services/${serviceId}`
                                );

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