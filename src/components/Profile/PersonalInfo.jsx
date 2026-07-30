function PersonalInfo() {
    return (

        <div className="bg-white rounded-3xl shadow-lg p-8 mt-10">

            <div className="flex justify-between items-center mb-8">

                <h2 className="text-2xl font-bold">
                    Personal Information
                </h2>

                <button className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition">
                    Edit Profile
                </button>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                    <p className="text-gray-500">
                        Full Name
                    </p>

                    <h3 className="text-lg font-semibold">
                        Vishnukant Yadav
                    </h3>
                </div>

                <div>
                    <p className="text-gray-500">
                        Email
                    </p>

                    <h3 className="text-lg font-semibold">
                        vishnukant@example.com
                    </h3>
                </div>

                <div>
                    <p className="text-gray-500">
                        Phone
                    </p>

                    <h3 className="text-lg font-semibold">
                        +91 9876543210
                    </h3>
                </div>

                <div>
                    <p className="text-gray-500">
                        City
                    </p>

                    <h3 className="text-lg font-semibold">
                        Greater Noida
                    </h3>
                </div>

                <div className="md:col-span-2">

                    <p className="text-gray-500">
                        Address
                    </p>

                    <h3 className="text-lg font-semibold">
                        Alpha 1, Greater Noida, Uttar Pradesh
                    </h3>

                </div>

            </div>

        </div>

    );
}

export default PersonalInfo;