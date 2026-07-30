import { Link } from "react-router-dom";
import { Heart, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";


function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [wishlistCount, setWishlistCount] = useState(0);

    useEffect(() => {

        const updateWishlistCount = () => {

            const wishlist =
                JSON.parse(localStorage.getItem("wishlist")) || [];

            setWishlistCount(wishlist.length);
        };

        // Initial Count
        updateWishlistCount();

        // Listen for storage changes
        window.addEventListener("storage", updateWishlistCount);

        return () => {
            window.removeEventListener("storage", updateWishlistCount);
        };

    }, []);

    return (

        <nav className="bg-blue-600 text-white px-6 py-4">

            <div className="max-w-7xl mx-auto flex justify-between items-center">

                {/* Logo */}

                <div className="flex items-center gap-2">

                    <div className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center font-bold text-xl">
                        S
                    </div>

                    <div>
                        <h2 className="text-xl font-bold">
                            ServiceHub
                        </h2>

                        <p className="text-xs text-blue-100">
                            Your Trusted Service Partner
                        </p>
                    </div>

                </div>

                {/* Navigation */}

                <ul className="hidden lg:flex items-center gap-8 font-medium">

                    <li className="hover:text-yellow-300 transition duration-300">
                        <Link to="/">Home</Link>
                    </li>

                    <li className="hover:text-yellow-300 transition duration-300">
                        <Link to="/services">Services</Link>
                    </li>

                    {/* Wishlist */}

                    <li className="hover:text-yellow-300 transition duration-300">

                        <Link
                            to="/wishlist"
                            className="flex items-center gap-2"
                        >

                            <Heart size={18} />

                            <span>Wishlist</span>

                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {wishlistCount}
                            </span>

                        </Link>

                    </li>

                    <li className="hover:text-yellow-300 transition duration-300">
                        <Link to="/become-professional">
                            Become a Professional
                        </Link>
                    </li>

                    <li className="hover:text-yellow-300 transition duration-300">
                        <Link to="/login">
                            Login
                        </Link>
                    </li>

                    <li>
                        <Link to="/signup">
                            <button className="bg-white text-blue-600 px-5 py-2 rounded-full font-semibold hover:bg-gray-100 transition duration-300">
                                Sign Up
                            </button>
                        </Link>
                    </li>

                </ul>
                <button
                    className="lg:hidden"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {
                        isOpen ? (
                            <X size={30} />
                        ) : (
                            <Menu size={30} />
                        )
                    }
                </button>

            </div>
            {
                isOpen && (
                    <div className="lg:hidden bg-blue-600 px-6 pb-6">

                        <ul className="flex flex-col gap-5 font-medium">

                            <li>
                                <Link
                                    to="/"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Home
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/services"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Services
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/wishlist"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Wishlist
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/profile"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Profile
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/become-professional"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Become a Professional
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Login
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/signup"
                                    onClick={() => setIsOpen(false)}
                                    className="bg-white text-blue-600 px-5 py-2 rounded-full inline-block font-semibold"
                                >
                                    Sign Up
                                </Link>
                            </li>

                        </ul>

                    </div>
                )
            }

        </nav>

    );
}

export default Navbar;