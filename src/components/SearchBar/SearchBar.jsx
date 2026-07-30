function SearchBar({ searchTerm, setSearchTerm }) {
    return (
        <div className="bg-white rounded-2xl shadow-md p-6">

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

                {/* Location */}

                <input
                    type="text"
                    placeholder="📍 Enter your location"
                    className="md:col-span-4 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Search */}

                <input
                    type="text"
                    placeholder="🔍 Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="md:col-span-6 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Button */}

                <button
                    className="md:col-span-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
                >
                    Search
                </button>

            </div>

            {/* Popular Searches */}

            <div className="mt-5 flex flex-wrap gap-3">

                <span className="text-sm text-gray-500">
                    Popular:
                </span>

                {[
                    "Plumbing",
                    "Electrician",
                    "Cleaning",
                    "AC Repair",
                    "Salon"
                ].map((item) => (
                    <button
                        key={item}
                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition"
                    >
                        {item}
                    </button>
                ))}

            </div>

        </div>
    );
}

export default SearchBar;