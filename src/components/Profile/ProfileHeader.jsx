import { useAuth } from "../../context/AuthContext";

function ProfileHeader() {
    const { user } = useAuth();

    const location = [
        user?.city,
        user?.state,
    ]
        .filter(Boolean)
        .join(", ");

    return (
        <>
            {/* Heading */}

            <h1 className="text-4xl font-bold">
                My Profile
            </h1>

            <p className="text-gray-500 mt-2">
                Manage your account information.
            </p>

            {/* Profile Card */}

            <div className="bg-white rounded-3xl shadow-lg p-8 mt-10">

                <div className="flex flex-col md:flex-row items-center gap-8">

                    {/* Profile Image */}

                    <div className="w-40 h-40 rounded-full border-4 border-blue-500 shadow-md overflow-hidden bg-blue-100 flex items-center justify-center">

                        <img
                            src={
                                user?.profileImage ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    user?.fullName || "User"
                                )}&background=2563eb&color=fff&size=200`
                            }
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />

                    </div>

                    {/* User Details */}

                    <div>

                        <h2 className="text-3xl font-bold">
                            {user?.fullName || "User"}
                        </h2>

                        <p className="text-gray-500 mt-2 capitalize">
                            {user?.role || "user"}
                        </p>

                        <div className="mt-6 space-y-2">

                            <p>
                                📧 {user?.email || "Email not available"}
                            </p>

                            <p>
                                📱 {user?.phone || "Phone not available"}
                            </p>

                            <p>
                                📍 {location || "Location not available"}
                            </p>

                        </div>

                    </div>

                </div>

            </div>
        </>
    );
}

export default ProfileHeader;