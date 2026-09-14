import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getWishlist } from "../../services/wishlistService";

function WishlistPreview({ onWishlistCountChange }) {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const fetchWishlist = async () => {
            try {
                const data = await getWishlist();

                if (!isMounted) return;

                const wishlistData =
                    data?.success && Array.isArray(data.wishlist)
                        ? data.wishlist
                        : [];

                setWishlist(wishlistData);

                if (onWishlistCountChange) {
                    onWishlistCountChange(wishlistData.length);
                }
            } catch (error) {
                if (!isMounted) return;

                console.error(
                    "Wishlist Preview Error:",
                    error
                );

                setWishlist([]);

                if (onWishlistCountChange) {
                    onWishlistCountChange(0);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchWishlist();

        return () => {
            isMounted = false;
        };
    }, [onWishlistCountChange]);

    /*
     * Backend wishlist can contain either:
     * - ObjectId strings
     * - populated service objects
     *
     * Normalize them into IDs.
     */
    const wishlistIds = wishlist
        .map((item) => {
            if (typeof item === "object" && item !== null) {
                return item._id;
            }

            return item;
        })
        .filter(Boolean)
        .map((id) => String(id));

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Wishlist Preview
                </h2>

                <Link
                    to="/wishlist"
                    className="text-blue-600 font-medium hover:underline"
                >
                    View All
                </Link>
            </div>

            {loading ? (
                <div className="py-6">
                    <p className="text-gray-500">
                        Loading wishlist...
                    </p>
                </div>
            ) : wishlistIds.length === 0 ? (
                <div className="py-6 text-center">
                    <p className="text-gray-500">
                        No services in wishlist.
                    </p>

                    <Link
                        to="/services"
                        className="inline-block mt-4 bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
                    >
                        Browse Services
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">

                    {wishlistIds.slice(0, 3).map((serviceId) => (
                        <div
                            key={serviceId}
                            className="flex items-center justify-between border-b pb-4 last:border-none"
                        >
                            <div>
                                <h3 className="font-semibold text-gray-800">
                                    Saved Service
                                </h3>

                                <p className="text-gray-500 text-sm mt-1">
                                    Service added to your wishlist
                                </p>
                            </div>

                            <Link
                                to={`/services/${serviceId}`}
                                className="text-blue-600 hover:underline font-medium"
                            >
                                View
                            </Link>
                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}

export default WishlistPreview;