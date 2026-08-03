import { Bell } from "lucide-react";

function NotificationPanel() {

    const notifications = [
        {
            id: 1,
            title: "Booking Confirmed",
            time: "2 hours ago",
        },
        {
            id: 2,
            title: "Electrician arriving today",
            time: "Today",
        },
        {
            id: 3,
            title: "20% OFF on Home Cleaning",
            time: "Yesterday",
        },
    ];

    return (

        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

            <h2 className="text-2xl font-bold mb-6">
                Notifications
            </h2>

            <div className="space-y-5">

                {notifications.map((item) => (

                    <div
                        key={item.id}
                        className="flex gap-4 border-b pb-4 last:border-none"
                    >

                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">

                            <Bell
                                size={18}
                                className="text-blue-600"
                            />

                        </div>

                        <div>

                            <h3 className="font-semibold">
                                {item.title}
                            </h3>

                            <p className="text-gray-500 text-sm">
                                {item.time}
                            </p>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}

export default NotificationPanel;