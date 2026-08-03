import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

import DashboardLayout from "../components/Dashboard/DashboardLayout";
import DashboardSidebar from "../components/Dashboard/DashboardSidebar";
import DashboardHeader from "../components/Dashboard/DashboardHeader";
import {
    CalendarDays,
    Heart,
    CheckCircle,
    Clock,
} from "lucide-react";

import StatsCard from "../components/Dashboard/StatsCard";
import RecentBookings from "../components/Dashboard/RecentBookings";
import WishlistPreview from "../components/Dashboard/WishlistPreview";
import NotificationPanel from "../components/Dashboard/NotificationPanel";
import ProfileCard from "../components/Dashboard/ProfileCard";

function Dashboard() {

    return (

        <>
            <Navbar />

            <DashboardLayout
                sidebar={<DashboardSidebar />}
            >

                <DashboardHeader />
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

                    <StatsCard
                        title="Total Bookings"
                        value="25"
                        icon={<CalendarDays size={28} className="text-white" />}
                        color="bg-blue-500"
                    />

                    <StatsCard
                        title="Completed"
                        value="18"
                        icon={<CheckCircle size={28} className="text-white" />}
                        color="bg-green-500"
                    />

                    <StatsCard
                        title="Pending"
                        value="5"
                        icon={<Clock size={28} className="text-white" />}
                        color="bg-yellow-500"
                    />

                    <StatsCard
                        title="Wishlist"
                        value="8"
                        icon={<Heart size={28} className="text-white" />}
                        color="bg-red-500"
                    />

                </div>
                <RecentBookings />
                <WishlistPreview />
                <NotificationPanel />
                <ProfileCard />

            </DashboardLayout>


            <Footer />

        </>

    );

}

export default Dashboard;