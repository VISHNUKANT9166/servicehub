import { useEffect, useState } from "react";
import { Bell } from "lucide-react";

import {
    getNotifications,
    markNotificationAsRead,
} from "../../services/notificationService";
function NotificationPanel({ onUnreadCountChange }) {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchNotifications = async () => {

            try {

                const data = await getNotifications();

                if (data.success) {
                    setNotifications(data.notifications);
                    const unreadCount = data.notifications.filter(
                        (notification) => !notification.read
                    ).length;

                    if (onUnreadCountChange) {
                        onUnreadCountChange(unreadCount);
                    }
                }

            } catch (error) {

                console.error(
                    "Notification Fetch Error:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        fetchNotifications();

    }, []);

    const handleNotificationClick = async (id) => {
        try {
            await markNotificationAsRead(id);

            setNotifications((prev) => {

                const updatedNotifications = prev.map(
                    (notification) =>
                        notification._id === id
                            ? { ...notification, read: true }
                            : notification
                );

                const unreadCount = updatedNotifications.filter(
                    (notification) => !notification.read
                ).length;

                if (onUnreadCountChange) {
                    onUnreadCountChange(unreadCount);
                }

                return updatedNotifications;
            });

        } catch (error) {
            console.error(
                "Mark Notification Read Error:",
                error
            );
        }
    };

    const formatTime = (createdAt) => {

        const date = new Date(createdAt);
        const now = new Date();

        const diffInSeconds =
            Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) {
            return "Just now";
        }

        const diffInMinutes =
            Math.floor(diffInSeconds / 60);

        if (diffInMinutes < 60) {
            return `${diffInMinutes} min ago`;
        }

        const diffInHours =
            Math.floor(diffInMinutes / 60);

        if (diffInHours < 24) {
            return `${diffInHours} hours ago`;
        }

        const diffInDays =
            Math.floor(diffInHours / 24);

        if (diffInDays === 1) {
            return "Yesterday";
        }

        return `${diffInDays} days ago`;
    };

    return (

        <div
            id="notifications"
            className="bg-white rounded-2xl shadow-lg p-6 mt-8"
        >
            <h2 className="text-2xl font-bold mb-6">
                Notifications
            </h2>

            {loading ? (

                <p className="text-gray-500">
                    Loading notifications...
                </p>

            ) : notifications.length === 0 ? (

                <p className="text-gray-500">
                    No notifications yet.
                </p>

            ) : (

                <div className="space-y-5">

                    {notifications.map((item) => (

                        <div
                            key={item._id}
                            onClick={() => handleNotificationClick(item._id)}
                            className={`flex gap-4 border-b pb-4 last:border-none cursor-pointer ${!item.read
                                ? "bg-blue-50 rounded-xl p-3"
                                : ""
                                }`}
                        >

                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">

                                <Bell
                                    size={18}
                                    className="text-blue-600"
                                />

                            </div>

                            <div>

                                <h3 className="font-semibold">
                                    {item.title}
                                </h3>

                                <p className="text-gray-600 text-sm mt-1">
                                    {item.message}
                                </p>

                                <p className="text-gray-500 text-sm mt-1">
                                    {formatTime(item.createdAt)}
                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );
}

export default NotificationPanel;