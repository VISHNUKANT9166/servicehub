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

import { getMyBookings } from "../services/bookingService";
import { getWishlist } from "../services/wishlistService";

function Dashboard() {

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [wishlist, setWishlist] = useState([]);
    const [wishlistLoading, setWishlistLoading] = useState(true);

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

        const fetchWishlist = async () => {

            try {

                const data = await getWishlist();

                if (data.success) {
                    setWishlist(data.wishlist);
                }

            } catch (error) {

                console.error(
                    "Dashboard Wishlist Error:",
                    error
                );

            } finally {

                setWishlistLoading(false);

            }

        };

        fetchWishlist();

    }, []);

    // Calculate booking statistics
    const totalBookings = bookings.length;

    const completedBookings = bookings.filter(
        (booking) => booking.status === "completed"
    ).length;

    const pendingBookings = bookings.filter(
        (booking) => booking.status === "pending"
    ).length;

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
                        value={loading ? "..." : totalBookings}
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
                        value={loading ? "..." : completedBookings}
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
                        value={loading ? "..." : pendingBookings}
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
                        value={wishlistLoading ? "..." : wishlist.length}
                        icon={
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

                <WishlistPreview />

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