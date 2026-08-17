import { User, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function ProfileCard() {
    const { user } = useAuth();

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

            {/* Profile Header */}
            <div className="flex items-center gap-5">

                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                    <User
                        size={40}
                        className="text-blue-600"
                    />
                </div>

                <div>
                    <h2 className="text-2xl font-bold">
                        {user?.fullName || "User"}
                    </h2>

                    <p className="text-gray-500">
                        {user?.role || "ServiceHub User"}
                    </p>
                </div>

            </div>

            {/* User Information */}
            <div className="mt-8 space-y-4">

                {/* Email */}
                <div className="flex items-center gap-3">

                    <Mail
                        size={18}
                        className="text-blue-600"
                    />

                    <span>
                        {user?.email || "Email not available"}
                    </span>

                </div>

                {/* Phone */}
                <div className="flex items-center gap-3">

                    <Phone
                        size={18}
                        className="text-blue-600"
                    />

                    <span>
                        {user?.phone || "Phone not available"}
                    </span>

                </div>

                {/* Location */}
                <div className="flex items-center gap-3">

                    <MapPin
                        size={18}
                        className="text-red-500"
                    />

                    <span>
                        {user?.city || "Location not available"}
                    </span>

                </div>

            </div>

            {/* Edit Profile */}
            <Link
                to="/edit-profile"
                className="block mt-8 w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition text-center"
            >
                Edit Profile
            </Link>

        </div>
    );
}

export default ProfileCard;