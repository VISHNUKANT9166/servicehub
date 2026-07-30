import { Link, useParams } from "react-router-dom";
import services from "../data/services";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

import {
    User,
    Briefcase,
    MapPin,
    Star,
    Phone,
} from "lucide-react";

function ServiceDetails() {

    const { id } = useParams();

    const service = services.find(
        (item) => item.id === Number(id)
    );
    if (!service) {
        return (
            <>
                <Navbar />

                <main className="min-h-screen flex items-center justify-center bg-gray-50">

                    <h1 className="text-4xl font-bold text-red-500">
                        Service Not Found
                    </h1>

                </main>

                <Footer />
            </>
        );
    }
    const similarServices = services
        .filter(
            (item) =>
                item.category === service.category &&
                item.id !== service.id
        )
        .slice(0, 3);



    return (
        <>
            <Navbar />

            <main className="bg-gray-50 min-h-screen">

                <div className="max-w-7xl mx-auto px-6 py-10">

                    {/* Breadcrumb */}

                    <p className="text-gray-500 mb-6">

                        Home /

                        <span className="text-blue-600">
                            {" "}Services
                        </span>

                        /

                        <span className="font-semibold text-gray-800">
                            {" "}{service.title}
                        </span>

                    </p>

                    {/* Hero Section */}

                    <div className="grid lg:grid-cols-2 gap-12 items-start">

                        {/* Image */}

                        <div>

                            <img
                                src={service.image}
                                alt={service.title}
                                className="w-full h-[500px] object-cover rounded-3xl shadow-lg"
                            />

                        </div>

                        {/* Details */}

                        <div>

                            <p className="text-blue-600 font-semibold uppercase tracking-wide">

                                {service.category}

                            </p>

                            <h1 className="text-5xl font-bold text-gray-900 mt-2">

                                {service.title}

                            </h1>

                            {/* Rating */}

                            <div className="flex items-center gap-3 mt-6">

                                <Star
                                    size={22}
                                    className="text-yellow-500 fill-yellow-500"
                                />

                                <span className="text-lg font-semibold">

                                    {service.rating}

                                </span>

                                <span className="text-gray-500">

                                    ({service.reviews} Reviews)

                                </span>

                            </div>

                            {/* Professional Info */}

                            <div className="space-y-5 mt-8">

                                <div className="flex items-center gap-3">

                                    <User
                                        className="text-blue-600"
                                        size={22}
                                    />

                                    <span className="text-lg">
                                        {service.professional}
                                    </span>

                                </div>

                                <div className="flex items-center gap-3">

                                    <Briefcase
                                        className="text-blue-600"
                                        size={22}
                                    />

                                    <span className="text-lg">
                                        {service.experience} Years Experience
                                    </span>

                                </div>

                                <div className="flex items-center gap-3">

                                    <MapPin
                                        className="text-red-500"
                                        size={22}
                                    />

                                    <span className="text-lg">
                                        {service.city}
                                    </span>

                                </div>

                                <div className="flex items-center gap-3">

                                    <Phone
                                        className="text-green-600"
                                        size={22}
                                    />

                                    <span className="font-semibold text-green-600">
                                        {service.availability}
                                    </span>

                                </div>

                            </div>

                            {/* Price */}

                            <h2 className="text-5xl font-bold text-blue-600 mt-10">

                                ₹{service.price}

                            </h2>

                            <p className="text-gray-500 mt-2">

                                Starting Price

                            </p>

                            {/* Buttons */}

                            {/* Buttons */}

                            <div className="flex gap-4 mt-10">

                                <Link
                                    to={`/booking/${service.id}`}
                                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition text-center"
                                >
                                    Book Now
                                </Link>

                                <Link
                                    to={`/contact/${service.id}`}
                                    className="border border-blue-600 text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition text-center"
                                >
                                    Contact
                                </Link>

                            </div>

                        </div>

                    </div>

                    {/* About Service */}

                    <div className="bg-white rounded-2xl shadow-md p-8 mt-12">

                        <h2 className="text-3xl font-bold mb-6">

                            About this Service

                        </h2>

                        <p className="text-gray-600 leading-8 text-lg">

                            {service.description}

                        </p>

                    </div>
                    {/* Services Included */}

                    <div className="bg-white rounded-2xl shadow-md p-8 mt-10">

                        <h2 className="text-3xl font-bold mb-6">
                            Services Included
                        </h2>

                        <div className="grid md:grid-cols-2 gap-4">

                            {service.includes.map((item, index) => (

                                <div
                                    key={index}
                                    className="flex items-center gap-3 bg-gray-50 rounded-xl p-4"
                                >

                                    <span className="text-green-600 text-xl">
                                        ✔
                                    </span>

                                    <span className="text-gray-700">
                                        {item}
                                    </span>

                                </div>

                            ))}

                        </div>

                    </div>
                    {/* Customer Reviews */}

                    <div className="bg-white rounded-2xl shadow-md p-8 mt-10">

                        <h2 className="text-3xl font-bold mb-6">
                            Customer Reviews
                        </h2>

                        <div className="space-y-6">

                            {service.reviewsData.map((review) => (

                                <div
                                    key={review.id}
                                    className="border-b pb-6 last:border-none"
                                >

                                    <div className="flex items-center justify-between">

                                        <h3 className="text-lg font-semibold">
                                            {review.name}
                                        </h3>

                                        <span className="text-yellow-500 font-semibold">
                                            ⭐ {review.rating}
                                        </span>

                                    </div>

                                    <p className="text-gray-600 mt-3">
                                        {review.comment}
                                    </p>

                                </div>

                            ))}

                        </div>

                    </div>
                    {/* Similar Services */}

                    <div className="mt-12">

                        <h2 className="text-3xl font-bold mb-6">
                            Similar Services
                        </h2>

                        <div className="grid md:grid-cols-3 gap-6">

                            {similarServices.map((item) => (

                                <Link
                                    key={item.id}
                                    to={`/services/${item.id}`}
                                    className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition block"
                                >

                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-48 object-cover"
                                    />

                                    <div className="p-5">

                                        <h3 className="text-xl font-bold">
                                            {item.title}
                                        </h3>

                                        <p className="text-gray-500 mt-2">
                                            {item.city}
                                        </p>

                                        <p className="text-blue-600 font-bold mt-4">
                                            ₹{item.price}
                                        </p>

                                    </div>

                                </Link>

                            ))}

                        </div>

                    </div>

                </div>

            </main>

            <Footer />
        </>
    );
}

export default ServiceDetails;