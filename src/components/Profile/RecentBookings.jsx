function RecentBookings() {
    return (

        <div className="bg-white rounded-3xl shadow-lg p-8 mt-10">

            <h2 className="text-2xl font-bold mb-8">
                Recent Bookings
            </h2>

            <div className="space-y-5">

                {/* Booking 1 */}

                <div className="border rounded-2xl p-5 flex justify-between items-center">

                    <div>

                        <h3 className="text-xl font-semibold">
                            Plumbing Service
                        </h3>

                        <p className="text-gray-500">
                            Rahul Sharma • 15 July 2026
                        </p>

                    </div>

                    <div className="text-right">

                        <h3 className="text-xl font-bold text-blue-600">
                            ₹299
                        </h3>

                        <span className="inline-block mt-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                            Completed
                        </span>

                    </div>

                </div>

                {/* Booking 2 */}

                <div className="border rounded-2xl p-5 flex justify-between items-center">

                    <div>

                        <h3 className="text-xl font-semibold">
                            AC Repair
                        </h3>

                        <p className="text-gray-500">
                            Rohit Singh • 25 July 2026
                        </p>

                    </div>

                    <div className="text-right">

                        <h3 className="text-xl font-bold text-blue-600">
                            ₹599
                        </h3>

                        <span className="inline-block mt-2 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                            Upcoming
                        </span>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default RecentBookings;