import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function PersonalInfo() {
    const { user } = useAuth();

    return (
        <div className="bg-white rounded-3xl shadow-lg p-8 mt-10">

            <div className="flex justify-between items-center mb-8">

                <h2 className="text-2xl font-bold">
                    Personal Information
                </h2>

                <Link
                    to="/edit-profile"
                    className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
                >
                    Edit Profile
                </Link>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Full Name */}
                <div>
                    <p className="text-gray-500">
                        Full Name
                    </p>

                    <h3 className="text-lg font-semibold">
                        {user?.fullName || "Not available"}
                    </h3>
                </div>

                {/* Email */}
                <div>
                    <p className="text-gray-500">
                        Email
                    </p>

                    <h3 className="text-lg font-semibold">
                        {user?.email || "Not available"}
                    </h3>
                </div>

                {/* Phone */}
                <div>
                    <p className="text-gray-500">
                        Phone
                    </p>

                    <h3 className="text-lg font-semibold">
                        {user?.phone || "Not available"}
                    </h3>
                </div>

                {/* City */}
                <div>
                    <p className="text-gray-500">
                        City
                    </p>

                    <h3 className="text-lg font-semibold">
                        {user?.city || "Not available"}
                    </h3>
                </div>

                {/* Address */}
                <div className="md:col-span-2">

                    <p className="text-gray-500">
                        Address
                    </p>

                    <h3 className="text-lg font-semibold">
                        {user?.address || "Not available"}
                    </h3>

                </div>

            </div>

        </div>
    );
}

export default PersonalInfo;