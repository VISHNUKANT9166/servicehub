import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

function BecomeProfessional() {
    return (
        <>
            <Navbar />

            <main className="bg-gray-50 min-h-screen">

                <div className="max-w-5xl mx-auto px-6 py-10">

                    <h1 className="text-4xl font-bold text-center">
                        Become a Professional
                    </h1>

                    <p className="text-gray-500 text-center mt-3">
                        Join ServiceHub and start earning by offering your services.
                    </p>
                    <div className="bg-white rounded-3xl shadow-lg p-8 mt-10">

                        <h2 className="text-2xl font-bold mb-8">
                            Professional Registration Form
                        </h2>
                        {/* Personal Details */}

                        <div className="grid md:grid-cols-2 gap-6">

                            {/* Full Name */}

                            <div>

                                <label className="block font-medium mb-2">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>

                            {/* Email */}

                            <div>

                                <label className="block font-medium mb-2">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>

                            {/* Phone */}

                            <div>

                                <label className="block font-medium mb-2">
                                    Phone Number
                                </label>

                                <input
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>

                        </div>
                        {/* Professional Details */}

                        <div className="grid md:grid-cols-2 gap-6 mt-8">

                            {/* Service Category */}

                            <div>

                                <label className="block font-medium mb-2">
                                    Service Category
                                </label>

                                <select
                                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                >

                                    <option>Select Category</option>

                                    <option>Plumber</option>

                                    <option>Electrician</option>

                                    <option>Carpenter</option>

                                    <option>AC Repair</option>

                                    <option>Home Cleaning</option>

                                    <option>Salon at Home</option>

                                    <option>Pest Control</option>

                                    <option>RO Service</option>

                                </select>

                            </div>

                            {/* Experience */}

                            <div>

                                <label className="block font-medium mb-2">
                                    Experience
                                </label>

                                <input
                                    type="number"
                                    placeholder="Years of Experience"
                                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>

                            {/* City */}

                            <div>

                                <label className="block font-medium mb-2">
                                    City
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter your city"
                                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>

                            {/* Expected Charges */}

                            <div>

                                <label className="block font-medium mb-2">
                                    Starting Charges (₹)
                                </label>

                                <input
                                    type="number"
                                    placeholder="Enter starting charges"
                                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />

                            </div>

                        </div>
                        {/* About Yourself */}

                        <div className="mt-8">

                            <label className="block font-medium mb-2">
                                About Yourself
                            </label>

                            <textarea
                                rows="5"
                                placeholder="Tell customers about yourself, your experience and skills..."
                                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                            ></textarea>

                        </div>

                        {/* Upload Documents */}

                        <div className="grid md:grid-cols-2 gap-6 mt-8">

                            {/* Profile Photo */}

                            <div>

                                <label className="block font-medium mb-2">
                                    Upload Profile Photo
                                </label>

                                <input
                                    type="file"
                                    accept="image/*"
                                    className="w-full border rounded-xl px-4 py-3"
                                />

                            </div>

                            {/* Certificate */}

                            <div>

                                <label className="block font-medium mb-2">
                                    Upload Certificate
                                </label>

                                <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="w-full border rounded-xl px-4 py-3"
                                />

                            </div>

                        </div>
                        {/* Terms & Conditions */}

                        <div className="mt-8 flex items-start gap-3">

                            <input
                                type="checkbox"
                                id="terms"
                                className="mt-1 w-5 h-5"
                            />

                            <label
                                htmlFor="terms"
                                className="text-gray-600"
                            >
                                I agree to the Terms & Conditions and confirm that all the
                                information provided is correct.
                            </label>

                        </div>

                        {/* Submit Button */}

                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg mt-8 hover:bg-blue-700 transition"
                        >
                            Submit Application
                        </button>

                    </div>

                </div>

            </main>

            <Footer />
        </>
    );
}

export default BecomeProfessional;