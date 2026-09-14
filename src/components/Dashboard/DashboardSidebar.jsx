import { NavLink, useNavigate } from "react-router-dom";

import {
    LayoutDashboard,
    CalendarDays,
    Heart,
    User,
    Settings,
    LogOut,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

function DashboardSidebar() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();

        toast.success("Logged out successfully");

        navigate("/login");
    };

    // Menu for normal users
    const userMenuItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: <LayoutDashboard size={20} />,
        },
        {
            name: "My Bookings",
            path: "/dashboard/bookings",
            icon: <CalendarDays size={20} />,
        },
        {
            name: "Wishlist",
            path: "/dashboard/wishlist",
            icon: <Heart size={20} />,
        },
        {
            name: "Profile",
            path: "/profile",
            icon: <User size={20} />,
        },
        {
            name: "Settings",
            path: "/dashboard/settings",
            icon: <Settings size={20} />,
        },
    ];

    // Menu for professionals
    const professionalMenuItems = [
        {
            name: "Dashboard",
            path: "/professional/dashboard",
            icon: <LayoutDashboard size={20} />,
        },
        {
            name: "My Services",
            path: "/professional/services",
            icon: <Settings size={20} />,
        },
        {
            name: "Bookings",
            path: "/professional/bookings",
            icon: <CalendarDays size={20} />,
        },
        {
            name: "Profile",
            path: "/professional/profile",
            icon: <User size={20} />,
        },
        {
            name: "Settings",
            path: "/professional/settings",
            icon: <Settings size={20} />,
        },
    ];

    // Select menu according to user role
    const menuItems =
        user?.role === "professional"
            ? professionalMenuItems
            : userMenuItems;

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">

            {/* Logo */}
            <h2 className="text-2xl font-bold mb-8 text-blue-600">
                ServiceHub
            </h2>

            {/* Navigation */}
            <nav className="space-y-2">

                {menuItems.map((item) => (

                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition ${isActive
                                ? "bg-blue-600 text-white"
                                : "text-gray-700 hover:bg-blue-50"
                            }`
                        }
                    >
                        {item.icon}

                        <span>
                            {item.name}
                        </span>

                    </NavLink>

                ))}

            </nav>

            {/* Logout */}
            <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 mt-8 rounded-xl text-red-600 hover:bg-red-50 transition"
            >
                <LogOut size={20} />

                <span>
                    Logout
                </span>

            </button>

        </div>
    );
}

export default DashboardSidebar;