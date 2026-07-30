import { Link, useLocation } from "react-router-dom";

function BookingSuccess() {
    const location = useLocation();

    const bookingId = location.state?.bookingId;
    const formData = location.state?.formData;

    const service = location.state?.service;

    const totalAmount = location.state?.totalAmount;

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white shadow-xl rounded-2xl p-10 text-center">

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
                        <span>₹{service?.price}</span>
                    </div>

                </div>

                <Link
                    to="/"
                    className="inline-block mt-8 bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700"
                >
                    Go To Home
                </Link>

            </div>

        </div>

    );

}

export default BookingSuccess;