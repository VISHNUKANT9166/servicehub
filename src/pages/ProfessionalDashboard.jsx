import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

import DashboardLayout from "../components/Dashboard/DashboardLayout";
import DashboardSidebar from "../components/Dashboard/DashboardSidebar";

import { useEffect, useState } from "react";

import { getMyServices } from "../services/serviceService";
import {
    getProfessionalBookingStats,
} from "../services/bookingService";

import {
    BriefcaseBusiness,
    CalendarDays,
    Clock,
    CheckCircle,
} from "lucide-react";

function ProfessionalDashboard() {

    // =====================================================
    // SERVICES
    // =====================================================

    const [services, setServices] = useState([]);


    // =====================================================
    // BOOKING STATISTICS
    // =====================================================

    const [bookingStats, setBookingStats] = useState({
        total: 0,
        pending: 0,
        completed: 0,
    });


    // =====================================================
    // FETCH DASHBOARD DATA
    // =====================================================

    useEffect(() => {

        const fetchDashboardData = async () => {

            try {

                // -------------------------------------------------
                // Get professional services
                // -------------------------------------------------

                const servicesData =
                    await getMyServices();

                if (servicesData.success) {

                    setServices(
                        servicesData.services || []
                    );

                }


                // -------------------------------------------------
                // Get professional booking statistics
                // -------------------------------------------------

                const bookingData =
                    await getProfessionalBookingStats();

                if (bookingData.success) {

                    setBookingStats(
                        bookingData.stats
                    );

                }

            } catch (error) {

                console.error(
                    "Professional Dashboard Error:",
                    error
                );

            }

        };


        fetchDashboardData();

    }, []);


    // =====================================================
    // UI
    // =====================================================

    return (
        <>
            <Navbar />

            <DashboardLayout
                sidebar={<DashboardSidebar />}
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="bg-white rounded-2xl shadow-lg p-6">

                    <h1 className="text-3xl font-bold">
                        Professional Dashboard 👋
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Manage your services and bookings from here.
                    </p>

                </div>


                {/* =================================================
                    STATISTICS
                ================================================= */}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">


                    {/* =================================================
                        TOTAL SERVICES
                    ================================================= */}

                    <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between">

                        <div>

                            <p className="text-gray-500">
                                Total Services
                            </p>

                            <h2 className="text-3xl font-bold mt-2">
                                {services.length}
                            </h2>

                        </div>

                        <div className="w-14 h-14 rounded-xl bg-blue-500 flex items-center justify-center">

                            <BriefcaseBusiness
                                size={28}
                                className="text-white"
                            />

                        </div>

                    </div>


                    {/* =================================================
                        TOTAL BOOKINGS
                    ================================================= */}

                    <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between">

                        <div>

                            <p className="text-gray-500">
                                Total Bookings
                            </p>

                            <h2 className="text-3xl font-bold mt-2">
                                {bookingStats.total}
                            </h2>

                        </div>

                        <div className="w-14 h-14 rounded-xl bg-purple-500 flex items-center justify-center">

                            <CalendarDays
                                size={28}
                                className="text-white"
                            />

                        </div>

                    </div>


                    {/* =================================================
                        PENDING BOOKINGS
                    ================================================= */}

                    <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between">

                        <div>

                            <p className="text-gray-500">
                                Pending
                            </p>

                            <h2 className="text-3xl font-bold mt-2">
                                {bookingStats.pending}
                            </h2>

                        </div>

                        <div className="w-14 h-14 rounded-xl bg-yellow-500 flex items-center justify-center">

                            <Clock
                                size={28}
                                className="text-white"
                            />

                        </div>

                    </div>


                    {/* =================================================
                        COMPLETED BOOKINGS
                    ================================================= */}

                    <div className="bg-white rounded-2xl shadow-lg p-6 flex items-center justify-between">

                        <div>

                            <p className="text-gray-500">
                                Completed
                            </p>

                            <h2 className="text-3xl font-bold mt-2">
                                {bookingStats.completed}
                            </h2>

                        </div>

                        <div className="w-14 h-14 rounded-xl bg-green-500 flex items-center justify-center">

                            <CheckCircle
                                size={28}
                                className="text-white"
                            />

                        </div>

                    </div>


                </div>

            </DashboardLayout>

            <Footer />
        </>
    );
}

export default ProfessionalDashboard;