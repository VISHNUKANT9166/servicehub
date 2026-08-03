import { User, Mail, Phone, MapPin } from "lucide-react";

function ProfileCard() {

    return (

        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

            <div className="flex items-center gap-5">

                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">

                    <User
                        size={40}
                        className="text-blue-600"
                    />

                </div>

                <div>

                    <h2 className="text-2xl font-bold">
                        Vishnukant Yadav
                    </h2>

                    <p className="text-gray-500">
                        Computer Science Student
                    </p>

                </div>

            </div>

            <div className="mt-8 space-y-4">

                <div className="flex items-center gap-3">

                    <Mail
                        size={18}
                        className="text-blue-600"
                    />

                    <span>
                        vishnukant@gmail.com
                    </span>

                </div>

                <div className="flex items-center gap-3">

                    <Phone
                        size={18}
                        className="text-blue-600"
                    />

                    <span>
                        +91 9876543210
                    </span>

                </div>

                <div className="flex items-center gap-3">

                    <MapPin
                        size={18}
                        className="text-red-500"
                    />

                    <span>
                        Greater Noida
                    </span>

                </div>

            </div>

            <button
                className="mt-8 w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition"
            >
                Edit Profile
            </button>

        </div>

    );

}

export default ProfileCard;