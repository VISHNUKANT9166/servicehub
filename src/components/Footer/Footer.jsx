import {
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaLinkedinIn,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaEnvelope,
} from "react-icons/fa";

function Footer() {
    return (
        <footer className="bg-slate-900 text-gray-300 mt-20">

            <div className="max-w-7xl mx-auto px-6 py-16">

                <div className="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-10">

                    {/* Company */}

                    <div>

                        <h2 className="text-3xl font-bold text-white">
                            ServiceHub
                        </h2>

                        <p className="mt-5 leading-7 text-gray-400">
                            Your trusted platform for booking verified
                            professionals like electricians, plumbers,
                            cleaners, carpenters and more.
                        </p>

                        <div className="flex gap-4 mt-6">

                            <div className="bg-blue-600 p-3 rounded-full hover:bg-blue-500 cursor-pointer transition">
                                <FaFacebookF className="text-white" />
                            </div>

                            <div className="bg-pink-600 p-3 rounded-full hover:bg-pink-500 cursor-pointer transition">
                                <FaInstagram className="text-white" />
                            </div>

                            <div className="bg-sky-500 p-3 rounded-full hover:bg-sky-400 cursor-pointer transition">
                                <FaTwitter className="text-white" />
                            </div>

                            <div className="bg-blue-700 p-3 rounded-full hover:bg-blue-600 cursor-pointer transition">
                                <FaLinkedinIn className="text-white" />
                            </div>

                        </div>

                    </div>

                    {/* Quick Links */}

                    <div>

                        <h3 className="text-white text-xl font-semibold mb-5">
                            Quick Links
                        </h3>

                        <ul className="space-y-3">

                            <li className="hover:text-white cursor-pointer">Home</li>
                            <li className="hover:text-white cursor-pointer">Services</li>
                            <li className="hover:text-white cursor-pointer">Become Professional</li>
                            <li className="hover:text-white cursor-pointer">Login</li>
                            <li className="hover:text-white cursor-pointer">Sign Up</li>

                        </ul>

                    </div>

                    {/* Services */}

                    <div>

                        <h3 className="text-white text-xl font-semibold mb-5">
                            Popular Services
                        </h3>

                        <ul className="space-y-3">

                            <li>Electrician</li>
                            <li>Plumber</li>
                            <li>Carpenter</li>
                            <li>Salon at Home</li>
                            <li>Home Cleaning</li>

                        </ul>

                    </div>

                    {/* Support */}

                    <div>

                        <h3 className="text-white text-xl font-semibold mb-5">
                            Support
                        </h3>

                        <ul className="space-y-3">

                            <li>Help Center</li>
                            <li>FAQs</li>
                            <li>Privacy Policy</li>
                            <li>Terms & Conditions</li>
                            <li>Contact Us</li>

                        </ul>

                    </div>

                    {/* Contact */}

                    <div>

                        <h3 className="text-white text-xl font-semibold mb-5">
                            Contact
                        </h3>

                        <div className="space-y-5">

                            <div className="flex gap-3">
                                <FaMapMarkerAlt className="mt-1 text-blue-400" />
                                <p>Greater Noida, Uttar Pradesh</p>
                            </div>

                            <div className="flex gap-3">
                                <FaPhoneAlt className="mt-1 text-blue-400" />
                                <p>+91 98765 43210</p>
                            </div>

                            <div className="flex gap-3">
                                <FaEnvelope className="mt-1 text-blue-400" />
                                <p>support@servicehub.com</p>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* Bottom */}

            <div className="border-t border-slate-700">

                <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center">

                    <p>
                        © 2026 ServiceHub. All Rights Reserved.
                    </p>

                    <div className="flex gap-6 mt-4 md:mt-0">

                        <p className="hover:text-white cursor-pointer">
                            Privacy
                        </p>

                        <p className="hover:text-white cursor-pointer">
                            Terms
                        </p>

                        <p className="hover:text-white cursor-pointer">
                            Cookies
                        </p>

                    </div>

                </div>

            </div>

        </footer>
    );
}

export default Footer;