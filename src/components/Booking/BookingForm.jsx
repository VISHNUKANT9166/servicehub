import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function BookingForm({ service }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        date: "",
        time: "",
        notes: "",
    });
    const [errors, setErrors] = useState({});
    const timeSlots = [
        "09:00 AM",
        "11:00 AM",
        "01:00 PM",
        "03:00 PM",
        "05:00 PM"
    ];
    const platformFee = 49;
    const gst = Math.round(service.price * 0.18);
    const totalAmount = service.price + platformFee + gst;

    const handleChange = (e) => {

        const { name } = e.target;
        let value = e.target.value;

        // Phone number ke liye sirf digits allow karo aur max 10 digits
        if (name === "phone") {
            value = value.replace(/\D/g, "").slice(0, 10);
        }

        setFormData({
            ...formData,
            [name]: value,
        });

        // Agar us field ka error hai to hata do
        setErrors({
            ...errors,
            [name]: "",
        });

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        let newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Full Name is required";
        }

        if (!/^\d{10}$/.test(formData.phone)) {
            newErrors.phone = "Phone number must be 10 digits";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
        ) {
            newErrors.email = "Enter a valid email address";
        }

        if (!formData.date) {
            newErrors.date = "Please select a date";
        }

        if (!formData.time) {
            newErrors.time = "Please select a time";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {

            toast.error("⚠ Please complete all required fields.");

            return;
        }
        const bookingId =
            "BK-" + Math.floor(100000 + Math.random() * 900000);

        console.log("Booking ID:", bookingId);

        console.log(formData);
        toast.success("🎉 Booking confirmed successfully!");

        // Future me yaha API call hogi

        navigate("/booking-success", {
            state: {
                bookingId,
                service,
                formData,
                totalAmount,
            },
        });

    };

    return (

        <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-lg p-8"
        >

            <h2 className="text-2xl font-bold mb-6">
                Customer Details
            </h2>
            <div className="mb-8 bg-blue-50 border border-blue-100 rounded-xl p-5">

                <h3 className="text-lg font-semibold text-gray-800">
                    Selected Service
                </h3>

                <div className="mt-3 flex items-center gap-4">

                    <img
                        src={service.image}
                        alt={service.title}
                        className="w-20 h-20 rounded-lg object-cover"
                    />

                    <div>
                        <h4 className="font-semibold text-lg">
                            {service.title}
                        </h4>

                        <p className="text-gray-600">
                            {service.professional}
                        </p>

                        <p className="text-blue-600 font-bold mt-1">
                            ₹{service.price}
                        </p>
                    </div>

                </div>

            </div>

            {/* Full Name */}

            <div className="mb-5">

                <label className="block mb-2 font-medium">
                    Full Name
                </label>

                <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                {errors.fullName && (
                    <p className="text-red-500 text-sm mt-2">
                        {errors.fullName}
                    </p>
                )}

            </div>

            {/* Phone */}

            <div className="mb-5">

                <label className="block mb-2 font-medium">
                    Phone Number
                </label>

                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                {errors.phone && (
                    <p className="text-red-500 text-sm mt-2">
                        {errors.phone}
                    </p>
                )}

            </div>

            {/* Email */}

            <div className="mb-5">

                <label className="block mb-2 font-medium">
                    Email
                </label>

                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mt-2">
                        {errors.email}
                    </p>
                )}

            </div>

            {/* Address */}

            <div className="mb-5">

                <label className="block mb-2 font-medium">
                    Address
                </label>

                <textarea
                    rows="3"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your address"
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />

            </div>

            {/* Date */}

            <div className="mb-5">

                <label className="block mb-2 font-medium">
                    Preferred Date
                </label>

                <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                {errors.date && (
                    <p className="text-red-500 text-sm mt-2">
                        {errors.date}
                    </p>
                )}

            </div>

            {/* Time */}

            <div className="mb-5">

                <label className="block mb-2 font-medium">
                    Preferred Time
                </label>

                <select
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                    required
                >

                    <option value="">
                        Select Time
                    </option>

                    {timeSlots.map((slot) => (

                        <option
                            key={slot}
                            value={slot}
                        >
                            {slot}
                        </option>

                    ))}

                </select>
                {errors.time && (
                    <p className="text-red-500 text-sm mt-2">
                        {errors.time}
                    </p>
                )}

            </div>

            {/* Notes */}

            <div className="mb-6">

                <label className="block mb-2 font-medium">
                    Additional Notes
                </label>

                <textarea
                    rows="4"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any special requirements..."
                    className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
                Confirm Booking
            </button>

        </form>

    );
}

export default BookingForm;