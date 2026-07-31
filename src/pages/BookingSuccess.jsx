import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

function BookingSuccess() {
    const location = useLocation();

    const bookingId = location.state?.bookingId;
    const formData = location.state?.formData;
    const service = location.state?.service;
    const totalAmount = location.state?.totalAmount;
    if (!bookingId || !service) {
        return (
            <>
                <Navbar />

                <main className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
                    <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md">

                        <h2 className="text-3xl font-bold text-red-500">
                            Invalid Booking
                        </h2>

                        <p className="text-gray-600 mt-4">
                            No booking information was found.
                        </p>

                        <Link
                            to="/"
                            className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
                        >
                            Go To Home
                        </Link>

                    </div>
                </main>

                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <main className="min-h-screen flex items-center justify-center bg-gray-100 py-16 px-6">

                <div className="bg-white shadow-xl rounded-2xl p-10 text-center max-w-xl w-full">

                    <div className="text-6xl">
                        ✅
                    </div>

                    <h1 className="text-4xl font-bold mt-4">
                        Booking Successful!
                    </h1>

                    <p className="text-gray-600 mt-4">
                        Your booking has been confirmed.
                    </p>

                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">

                        <p className="text-gray-600">
                            Booking ID
                        </p>

                        <h2 className="text-2xl font-bold text-blue-600">
                            {bookingId}
                        </h2>

                    </div>

                    <div className="mt-6 bg-gray-50 rounded-xl p-5 space-y-3">

                        <div className="flex justify-between">
                            <span className="text-gray-500">Service</span>
                            <span className="font-semibold">
                                {service?.title}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">Professional</span>
                            <span className="font-semibold">
                                {service?.professional}
                            </span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-500">City</span>
                            <span className="font-semibold">
                                {service?.city}
                            </span>
                        </div>

                        <div className="border-t pt-3 flex justify-between text-lg font-bold text-blue-600">
                            <span>Price</span>
                            <span>
                                ₹{totalAmount ?? service?.price}
                            </span>
                        </div>

                    </div>
                    <div className="border-t pt-4 mt-4">

                        <h3 className="text-lg font-bold mb-3 text-left">
                            Customer Details
                        </h3>

                        <div className="space-y-2 text-left text-gray-700">

                            <p>
                                <span className="font-semibold">Name:</span>{" "}
                                {formData?.fullName}
                            </p>

                            <p>
                                <span className="font-semibold">Phone:</span>{" "}
                                {formData?.phone}
                            </p>

                            <p>
                                <span className="font-semibold">Email:</span>{" "}
                                {formData?.email}
                            </p>

                            <p>
                                <span className="font-semibold">Date:</span>{" "}
                                {formData?.date}
                            </p>

                            <p>
                                <span className="font-semibold">Time:</span>{" "}
                                {formData?.time}
                            </p>

                        </div>

                    </div>
                    <Link
                        to="/"
                        className="inline-block mt-8 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition"
                    >
                        Go To Home
                    </Link>

                </div>

            </main>

            <Footer />
        </>
    );
}

export default BookingSuccess;