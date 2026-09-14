import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

function BookingSuccess() {
    const location = useLocation();

    const bookingId = location.state?.bookingId;
    const formData = location.state?.formData;
    const service = location.state?.service;
    const totalAmount = location.state?.totalAmount;

    const professionalName =
        service?.professional?.user?.fullName ||
        "Professional";

    const city =
        service?.professional?.user?.city ||
        "";

    const state =
        service?.professional?.user?.state ||
        "";

    const locationText = [city, state]
        .filter(Boolean)
        .join(", ");

    const displayAmount =
        totalAmount ?? service?.price ?? 0;

    if (!bookingId || !service) {
        return (
            <>
                <Navbar />

                <main className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
                    <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md w-full">

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

                <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-10 max-w-xl w-full">

                    {/* Success Header */}
                    <div className="text-center">

                        <div className="text-6xl">
                            ✅
                        </div>

                        <h1 className="text-4xl font-bold mt-4">
                            Booking Successful!
                        </h1>

                        <p className="text-gray-600 mt-4">
                            Your booking has been confirmed successfully.
                        </p>

                    </div>

                    {/* Booking ID */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">

                        <p className="text-gray-600">
                            Booking ID
                        </p>

                        <h2 className="text-xl sm:text-2xl font-bold text-blue-600 break-all mt-1">
                            {bookingId}
                        </h2>

                    </div>

                    {/* Booking Details */}
                    <div className="mt-6 bg-gray-50 rounded-xl p-5 space-y-4">

                        {/* Service */}
                        <div className="flex items-start justify-between gap-4">
                            <span className="text-gray-500">
                                Service
                            </span>

                            <span className="font-semibold text-right">
                                {service?.title || "Service"}
                            </span>
                        </div>

                        {/* Professional */}
                        <div className="flex items-start justify-between gap-4">
                            <span className="text-gray-500">
                                Professional
                            </span>

                            <span className="font-semibold text-right">
                                {professionalName}
                            </span>
                        </div>

                        {/* City */}
                        <div className="flex items-start justify-between gap-4">
                            <span className="text-gray-500">
                                Location
                            </span>

                            <span className="font-semibold text-right">
                                {locationText || "Not specified"}
                            </span>
                        </div>

                        {/* Category */}
                        <div className="flex items-start justify-between gap-4">
                            <span className="text-gray-500">
                                Category
                            </span>

                            <span className="font-semibold text-right">
                                {service?.category || "Not specified"}
                            </span>
                        </div>

                        {/* Price */}
                        <div className="border-t pt-4 flex items-center justify-between text-lg">
                            <span className="font-semibold">
                                Price
                            </span>

                            <span className="font-bold text-blue-600">
                                ₹{displayAmount}
                            </span>
                        </div>

                    </div>

                    {/* Customer Details */}
                    <div className="border-t pt-5 mt-5">

                        <h3 className="text-lg font-bold mb-4">
                            Customer Details
                        </h3>

                        <div className="space-y-3 text-gray-700">

                            <p>
                                <span className="font-semibold">
                                    Name:
                                </span>{" "}
                                {formData?.fullName || "Not provided"}
                            </p>

                            <p>
                                <span className="font-semibold">
                                    Phone:
                                </span>{" "}
                                {formData?.phone || "Not provided"}
                            </p>

                            <p>
                                <span className="font-semibold">
                                    Email:
                                </span>{" "}
                                {formData?.email || "Not provided"}
                            </p>

                            <p>
                                <span className="font-semibold">
                                    Date:
                                </span>{" "}
                                {formData?.date || "Not provided"}
                            </p>

                            <p>
                                <span className="font-semibold">
                                    Time:
                                </span>{" "}
                                {formData?.time || "Not provided"}
                            </p>

                            <p>
                                <span className="font-semibold">
                                    Address:
                                </span>{" "}
                                {formData?.address || "Not provided"}
                            </p>

                            {formData?.notes && (
                                <p>
                                    <span className="font-semibold">
                                        Notes:
                                    </span>{" "}
                                    {formData.notes}
                                </p>
                            )}

                        </div>

                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 mt-8">

                        <Link
                            to="/"
                            className="flex-1 text-center bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
                        >
                            Go To Home
                        </Link>

                        <Link
                            to="/dashboard"
                            className="flex-1 text-center border border-blue-600 text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition"
                        >
                            View Dashboard
                        </Link>

                    </div>

                </div>

            </main>

            <Footer />
        </>
    );
}

export default BookingSuccess;