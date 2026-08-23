import { Bell } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function DashboardHeader({ unreadNotificationCount }) {

    const { user } = useAuth();

    return (

        <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between">

            <div>

                <h1 className="text-3xl font-bold">
                    Welcome back, {user?.fullName || "User"} 👋
                </h1>

                <p className="text-gray-500 mt-2">
                    Manage your bookings and account from here.
                </p>

            </div>

            <button
                onClick={() =>
                    document
                        .getElementById("notifications")
                        ?.scrollIntoView({
                            behavior: "smooth",
                            block: "start",
                        })
                }
                className="relative p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                aria-label="Notifications"
            >

                <Bell size={24} />

                {unreadNotificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                        {unreadNotificationCount}
                    </span>
                )}

            </button>

        </div>

    );

}

export default DashboardHeader;