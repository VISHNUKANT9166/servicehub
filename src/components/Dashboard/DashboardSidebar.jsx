import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    CalendarDays,
    Heart,
    User,
    Settings,
    LogOut,
} from "lucide-react";

function DashboardSidebar() {

    const menuItems = [
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
            path: "/dashboard/profile",
            icon: <User size={20} />,
        },
        {
            name: "Settings",
            path: "/dashboard/settings",
            icon: <Settings size={20} />,
        },
    ];

    return (

        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">

            <h2 className="text-2xl font-bold mb-8 text-blue-600">
                ServiceHub
            </h2>

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
                        <span>{item.name}</span>
                    </NavLink>

                ))}

            </nav>

            <button
                className="mt-8 w-full flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition"
            >
                <LogOut size={20} />
                Logout
            </button>

        </div>

    );

}

export default DashboardSidebar;