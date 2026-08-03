import bookings from "../../data/bookings";

function RecentBookings() {

    return (

        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

            <h2 className="text-2xl font-bold mb-6">
                Recent Bookings
            </h2>

            <div className="space-y-4">

                {bookings.map((booking) => (

                    <div
                        key={booking.id}
                        className="flex justify-between items-center border-b pb-4 last:border-none"
                    >

                        <div>

                            <h3 className="font-semibold text-lg">
                                {booking.service}
                            </h3>

                            <p className="text-gray-500 text-sm">
                                {booking.date}
                            </p>

                        </div>

                        <div className="text-right">

                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${booking.status === "Completed"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-yellow-100 text-yellow-700"
                                    }`}
                            >
                                {booking.status}
                            </span>

                            <p className="font-bold text-blue-600 mt-2">
                                ₹{booking.amount}
                            </p>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}

export default RecentBookings;