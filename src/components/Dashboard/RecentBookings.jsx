function RecentBookings({ bookings = [] }) {

    // Show only latest 5 bookings
    const recentBookings = [...bookings]
        .sort(
            (a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
        )
        .slice(0, 5);

    return (

        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

            <h2 className="text-2xl font-bold mb-6">
                Recent Bookings
            </h2>

            {recentBookings.length === 0 ? (

                <div className="text-center py-8 text-gray-500">
                    No bookings yet.
                </div>

            ) : (

                <div className="space-y-4">

                    {recentBookings.map((booking) => (

                        <div
                            key={booking._id}
                            className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-b pb-4 last:border-none"
                        >

                            <div>

                                <h3 className="font-semibold text-lg">
                                    {booking.serviceTitle}
                                </h3>

                                <p className="text-gray-500 text-sm">
                                    {new Date(
                                        booking.bookingDate
                                    ).toLocaleDateString(
                                        "en-IN",
                                        {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        }
                                    )}
                                </p>

                                <p className="text-gray-400 text-sm mt-1">
                                    {booking.bookingTime}
                                </p>

                            </div>

                            <div className="md:text-right">

                                <span
                                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium capitalize ${booking.status === "completed"
                                            ? "bg-green-100 text-green-700"
                                            : booking.status === "confirmed"
                                                ? "bg-blue-100 text-blue-700"
                                                : booking.status === "cancelled"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                        }`}
                                >
                                    {booking.status}
                                </span>

                                <p className="font-bold text-blue-600 mt-2">
                                    ₹{booking.price}
                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );
}

export default RecentBookings;