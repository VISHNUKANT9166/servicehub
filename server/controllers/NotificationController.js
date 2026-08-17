import Notification from "../models/Notification.js";

// Get current user's notifications
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({
            user: req.userId,
        }).sort({
            createdAt: -1,
        });

        res.status(200).json({
            success: true,
            notifications,
        });

    } catch (error) {
        console.error(
            "Get Notifications Error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


// Mark notification as read
export const markNotificationAsRead = async (req, res) => {
    try {
        const notification =
            await Notification.findOneAndUpdate(
                {
                    _id: req.params.id,
                    user: req.userId,
                },
                {
                    read: true,
                },
                {
                    returnDocument: "after",
                }
            );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found",
            });
        }

        res.status(200).json({
            success: true,
            notification,
        });

    } catch (error) {
        console.error(
            "Mark Notification Error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};