import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import { getServiceById } from "../services/serviceService";

import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

import BookingSummary from "../components/Booking/BookingSummary";
import BookingForm from "../components/Booking/BookingForm";

function Booking() {
    const { id } = useParams();

    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const data = await getServiceById(id);

                if (data.success) {
                    setService(data.service);
                }
            } catch (error) {
                console.error(
                    "Fetch Service Error:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchService();
    }, [id]);

    // Loading state
    if (loading) {
        return (
            <>
                <Navbar />

                <main className="min-h-screen flex items-center justify-center bg-gray-50">
                    <p className="text-xl text-gray-500">
                        Loading service...
                    </p>
                </main>

                <Footer />
            </>
        );
    }

    // Service not found
    if (!service) {
        return (
            <>
                <Navbar />

                <main className="min-h-screen flex items-center justify-center bg-gray-50">
                    <h1 className="text-3xl font-bold text-red-500">
                        Service Not Found
                    </h1>
                </main>

                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="bg-gray-50 min-h-screen">

                <div className="max-w-7xl mx-auto px-6 py-10">

                    {/* Breadcrumb */}

                    <p className="text-gray-500 text-sm mb-4">
                        Home /
                        <span className="text-blue-600">
                            {" "}Services
                        </span>
                        /
                        <span className="text-blue-600">
                            {" "}{service.title}
                        </span>
                        /
                        <span className="font-semibold text-gray-800">
                            {" "}Booking
                        </span>
                    </p>

                    {/* Header */}

                    <div className="mb-10">

                        <h1 className="text-4xl font-bold">
                            Book {service.title}
                        </h1>

                        <p className="text-gray-600 mt-3">
                            Complete your booking by filling in the details below.
                        </p>

                    </div>

                    {/* Booking */}

                    <div className="grid lg:grid-cols-2 gap-8 items-start">

                        <BookingForm service={service} />

                        <div className="lg:sticky lg:top-24 h-fit">
                            <BookingSummary service={service} />
                        </div>

                    </div>

                </div>

            </main>

            <Footer />
        </>
    );
}

export default Booking;