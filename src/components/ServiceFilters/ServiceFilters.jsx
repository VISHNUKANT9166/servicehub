import {
    Filter,
    IndianRupee,
    Star,
    Clock,
    RotateCcw,
} from "lucide-react";

import categories from "../../data/categories";

function ServiceFilters({
    selectedCategory,
    setSelectedCategory,
    maxPrice,
    setMaxPrice,
    selectedRating,
    setSelectedRating,
    selectedAvailability,
    setSelectedAvailability,
    resetFilters,
}) {
    return (
        <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <Filter className="text-blue-600" />
                <h2 className="text-2xl font-bold">
                    Filters
                </h2>
            </div>

            {/* Categories */}
            <div className="mb-8">

                <h3 className="font-semibold mb-3">
                    Categories
                </h3>

                <div className="space-y-3">

                    {categories.map((category) => (

                        <label
                            key={category.id}
                            className="flex items-center gap-3 cursor-pointer"
                        >
                            <input
                                type="radio"
                                name="category"
                                checked={selectedCategory === category.name}
                                onChange={() =>
                                    setSelectedCategory(category.name)
                                }
                            />

                            <span className="text-lg">
                                {category.icon}
                            </span>

                            <span>
                                {category.name}
                            </span>

                        </label>

                    ))}

                </div>

            </div>

            {/* Price */}
            <div className="mb-8">

                <div className="flex items-center gap-2 mb-3">

                    <IndianRupee
                        size={18}
                        className="text-blue-600"
                    />

                    <h3 className="font-semibold">
                        Price
                    </h3>

                </div>

                <input
                    type="range"
                    min="100"
                    max="1000"
                    step="50"
                    value={maxPrice}
                    onChange={(e) =>
                        setMaxPrice(Number(e.target.value))
                    }
                    className="w-full accent-blue-600"
                />

                <div className="flex justify-between mt-2 text-sm text-gray-600">

                    <span>₹100</span>

                    <span className="font-semibold text-blue-600">
                        Max: ₹{maxPrice}
                    </span>

                </div>

            </div>

            {/* Rating */}
            <div className="mb-8">

                <div className="flex items-center gap-2 mb-3">

                    <Star
                        size={18}
                        className="text-yellow-500 fill-yellow-500"
                    />

                    <h3 className="font-semibold">
                        Rating
                    </h3>

                </div>

                <div className="space-y-2">

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="rating"
                            checked={selectedRating === 0}
                            onChange={() => setSelectedRating(0)}
                        />
                        All Ratings
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="rating"
                            checked={selectedRating === 4}
                            onChange={() => setSelectedRating(4)}
                        />
                        4★ & Above
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="rating"
                            checked={selectedRating === 3}
                            onChange={() => setSelectedRating(3)}
                        />
                        3★ & Above
                    </label>

                </div>

            </div>

            {/* Availability */}
            <div className="mb-8">

                <div className="flex items-center gap-2 mb-3">

                    <Clock
                        size={18}
                        className="text-green-600"
                    />

                    <h3 className="font-semibold">
                        Availability
                    </h3>

                </div>

                <div className="space-y-2">

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="availability"
                            checked={selectedAvailability === "All"}
                            onChange={() =>
                                setSelectedAvailability("All")
                            }
                        />
                        All
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="availability"
                            checked={selectedAvailability === "Available Today"}
                            onChange={() =>
                                setSelectedAvailability("Available Today")
                            }
                        />
                        Available Today
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="availability"
                            checked={selectedAvailability === "Available Tomorrow"}
                            onChange={() =>
                                setSelectedAvailability("Available Tomorrow")
                            }
                        />
                        Available Tomorrow
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name="availability"
                            checked={selectedAvailability === "Available This Week"}
                            onChange={() =>
                                setSelectedAvailability("Available This Week")
                            }
                        />
                        Available This Week
                    </label>

                </div>

            </div>

            {/* Reset Button */}
            <button
                onClick={resetFilters}
                className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition-all duration-300"
            >
                <RotateCcw size={18} />
                Reset Filters
            </button>

        </div>
    );
}

export default ServiceFilters;