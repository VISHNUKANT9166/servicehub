import { useEffect, useState } from "react";

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

import {
    getMyBookings,
    getBookingStats,
} from "../services/bookingService";

function Dashboard() {

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [bookingStats, setBookingStats] = useState({
        total: 0,
        completed: 0,
        pending: 0,
    });

    const [statsLoading, setStatsLoading] = useState(true);

    useEffect(() => {

        const fetchBookings = async () => {

            try {

                const data = await getMyBookings();

                if (data.success) {
                    setBookings(data.bookings);
                }

            } catch (error) {

                console.error(
                    "Dashboard Bookings Error:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        fetchBookings();

    }, []);
    useEffect(() => {

        const fetchBookingStats = async () => {

            try {

                const data = await getBookingStats();

                if (data.success) {
                    setBookingStats(data.stats);
                }

            } catch (error) {

                console.error(
                    "Dashboard Stats Error:",
                    error
                );

            } finally {

                setStatsLoading(false);

            }

        };

        fetchBookingStats();

    }, []);




    return (

        <>
            <Navbar />

            <DashboardLayout
                sidebar={<DashboardSidebar />}
            >

                <DashboardHeader />

                {/* Statistics */}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

                    <StatsCard
                        title="Total Bookings"
                        value={statsLoading ? "..." : bookingStats.total}
                        icon={
                            <CalendarDays
                                size={28}
                                className="text-white"
                            />
                        }
                        color="bg-blue-500"
                    />

                    <StatsCard
                        title="Completed"
                        value={statsLoading ? "..." : bookingStats.completed}
                        icon={
                            <CheckCircle
                                size={28}
                                className="text-white"
                            />
                        }
                        color="bg-green-500"
                    />

                    <StatsCard
                        title="Pending"
                        value={statsLoading ? "..." : bookingStats.pending}
                        icon={
                            <Clock
                                size={28}
                                className="text-white"
                            />
                        }
                        color="bg-yellow-500"
                    />

                    <StatsCard
                        title="Wishlist"
                        value={wishlistCount} icon={
                            <Heart
                                size={28}
                                className="text-white"
                            />
                        }
                        color="bg-red-500"
                    />

                </div>

                {/* Recent Bookings */}

                <RecentBookings bookings={bookings} />

                {/* Wishlist */}

                <WishlistPreview
                    onWishlistCountChange={setWishlistCount}
                />

                {/* Notifications */}

                <NotificationPanel />

                {/* Profile */}

                <ProfileCard />

            </DashboardLayout>

            <Footer />
        </>

    );
}

export default Dashboard;