import { Bell } from "lucide-react";

function DashboardHeader() {

    return (

        <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between">

            <div>

                <h1 className="text-3xl font-bold">
                    Welcome Back 👋
                </h1>

                <p className="text-gray-500 mt-2">
                    Manage your bookings and account from here.
                </p>

            </div>

            <button className="relative p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition">

                <Bell size={24} />

                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                    3
                </span>

            </button>

        </div>

    );

}

export default DashboardHeader;