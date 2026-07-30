import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import ProfileHeader from "../components/Profile/ProfileHeader";
import ProfileStats from "../components/Profile/ProfileStats";
import PersonalInfo from "../components/Profile/PersonalInfo";
import RecentBookings from "../components/Profile/RecentBookings";

function Profile() {
    return (
        <>
            <Navbar />

            <main className="bg-gray-50 min-h-screen">

                <div className="max-w-7xl mx-auto px-6 py-10">



                    <ProfileHeader />

                    <ProfileStats />

                    <PersonalInfo />
                    
                    <RecentBookings />

                </div>

            </main>

            <Footer />
        </>
    );
}

export default Profile;