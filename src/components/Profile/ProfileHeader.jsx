function ProfileHeader() {
    return (

        <>
            {/* Heading */}

            <h1 className="text-4xl font-bold">
                My Profile
            </h1>

            <p className="text-gray-500 mt-2">
                Manage your account information.
            </p>

            {/* Profile Card */}

            <div className="bg-white rounded-3xl shadow-lg p-8 mt-10">

                <div className="flex flex-col md:flex-row items-center gap-8">

                    {/* Profile Image */}

                    <img
                        src="https://ui-avatars.com/api/?name=Vishnukant+Yadav&background=2563eb&color=fff&size=200"
                        alt="Profile"
                        className="w-40 h-40 rounded-full border-4 border-blue-500 shadow-md"
                    />

                    {/* User Details */}

                    <div>

                        <h2 className="text-3xl font-bold">
                            Vishnukant Yadav
                        </h2>

                        <p className="text-gray-500 mt-2">
                            Customer
                        </p>

                        <div className="mt-6 space-y-2">

                            <p>📧 vishnukant@example.com</p>

                            <p>📱 +91 9876543210</p>

                            <p>📍 Greater Noida, Uttar Pradesh</p>

                        </div>

                    </div>

                </div>

            </div>

        </>

    );
}

export default ProfileHeader;