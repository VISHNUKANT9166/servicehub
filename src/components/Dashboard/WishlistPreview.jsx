import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import services from "../../data/services";
import { getWishlist } from "../../services/wishlistService";

function WishlistPreview() {

    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchWishlist = async () => {

            try {

                const data = await getWishlist();

                if (data.success) {
                    setWishlist(data.wishlist);
                }

            } catch (error) {

                console.error(
                    "Wishlist Preview Error:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        fetchWishlist();

    }, []);

    const wishlistServices = services.filter((service) =>
        wishlist.includes(service.id)
    );

    return (

        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

            <h2 className="text-2xl font-bold mb-6">
                Wishlist Preview
            </h2>

            {loading ? (

                <p className="text-gray-500">
                    Loading wishlist...
                </p>

            ) : wishlistServices.length === 0 ? (

                <p className="text-gray-500">
                    No services in wishlist.
                </p>

            ) : (

                <div className="space-y-4">

                    {wishlistServices
                        .slice(0, 3)
                        .map((service) => (

                            <div
                                key={service.id}
                                className="flex items-center justify-between border-b pb-4 last:border-none"
                            >

                                <div>

                                    <h3 className="font-semibold">
                                        {service.title}
                                    </h3>

                                    <p className="text-blue-600 font-bold mt-1">
                                        ₹{service.price}
                                    </p>

                                </div>

                                <Link
                                    to={`/services/${service.id}`}
                                    className="text-blue-600 hover:underline"
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