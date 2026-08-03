import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import ProfileForm from "../components/Profile/ProfileForm";

function EditProfile() {
    return (
        <>
            <Navbar />

            <main className="min-h-screen bg-gray-100 py-10">
                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold mb-8">
                        Edit Profile
                    </h1>

                    <ProfileForm />
                </div>
            </main>

            <Footer />
        </>
    );
}

export default EditProfile;