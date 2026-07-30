import {
    User,
    MapPin,
    IndianRupee,
    Receipt,
} from "lucide-react";

function BookingSummary({ service }) {

    const platformFee = 49;

    const gst = Math.round(service.price * 0.18);

    const totalAmount =
        service.price + platformFee + gst;

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">

            <h2 className="text-2xl font-bold mb-6">
                Booking Summary
            </h2>

            <img
                src={service.image}
                alt={service.title}
                className="w-full h-52 object-cover rounded-xl"
            />

            <h3 className="text-2xl font-bold mt-5">
                {service.title}
            </h3>

            <div className="space-y-4 mt-6">

                <div className="flex items-center gap-3">
                    <User className="text-blue-600" size={20} />
                    <span>{service.professional}</span>
                </div>

                <div className="flex items-center gap-3">
                    <MapPin className="text-red-500" size={20} />
                    <span>{service.city}</span>
                </div>

            </div>
            <div className="flex justify-between text-sm text-gray-600 mt-4">

                <span>
                    Category
                </span>

                <span className="font-medium">
                    {service.category}
                </span>

            </div>

            <div className="flex justify-between text-sm text-gray-600">

                <span>
                    Experience
                </span>

                <span className="font-medium">
                    {service.experience}
                </span>

            </div>

            <hr className="my-6" />

            <div className="space-y-4">

                <div className="flex justify-between">
                    <span>Service Price</span>
                    <span>₹{service.price}</span>
                </div>

                <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span>₹{gst}</span>
                </div>

                <div className="flex justify-between">
                    <span>Platform Fee</span>
                    <span>₹{platformFee}</span>
                </div>

                <hr />

                <div className="flex justify-between text-xl font-bold text-blue-600">
                    <span>Total</span>
                    <span>₹{totalAmount}</span>
                </div>

            </div>
            <div className="mt-6 bg-gray-50 rounded-xl p-4">

                <h3 className="font-semibold mb-2">
                    Service Information
                </h3>

                <div className="flex justify-between text-sm">

                    <span>Estimated Duration</span>

                    <span>2 - 3 Hours</span>

                </div>

                <div className="flex justify-between text-sm mt-2">

                    <span>Availability</span>

                    <span className="text-green-600 font-medium">
                        {service.availability}
                    </span>

                </div>

            </div>

            <div className="mt-8 bg-blue-50 rounded-xl p-4 flex gap-3">

                <Receipt className="text-blue-600" />

                <p className="text-sm text-gray-600">
                    Secure booking. Final amount will be confirmed before payment.
                </p>
                <p className="text-xs text-green-600 mt-2 font-medium">
                    ✓ 100% Satisfaction Guarantee
                </p>

            </div>
            <div className="mt-6 border rounded-xl p-4">

                <h3 className="font-semibold mb-3">
                    Payment Information
                </h3>

                <div className="space-y-2 text-sm text-gray-600">

                    <div className="flex justify-between">
                        <span>Payment Method</span>
                        <span className="font-medium">
                            Online / Cash
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span>Cancellation</span>
                        <span className="font-medium text-green-600">
                            Free up to 24 hrs
                        </span>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default BookingSummary;