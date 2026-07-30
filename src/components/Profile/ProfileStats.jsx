function ProfileStats() {
    return (

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

            <div className="bg-white rounded-2xl shadow-md p-6 text-center">

                <h3 className="text-4xl font-bold text-blue-600">
                    12
                </h3>

                <p className="text-gray-500 mt-2">
                    Total Bookings
                </p>

            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 text-center">

                <h3 className="text-4xl font-bold text-red-500">
                    8
                </h3>

                <p className="text-gray-500 mt-2">
                    Wishlist Services
                </p>

            </div>

            <div className="bg-white rounded-2xl shadow-md p-6 text-center">

                <h3 className="text-4xl font-bold text-yellow-500">
                    25
                </h3>

                <p className="text-gray-500 mt-2">
                    Reviews Given
                </p>

            </div>

        </div>

    );
}

export default ProfileStats;