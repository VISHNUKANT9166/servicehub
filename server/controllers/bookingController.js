import Booking from "../models/Booking.js";
import Notification from "../models/Notification.js";

// Create a new booking
export const createBooking = async (req, res) => {
    try {
        const {
            service,
            serviceTitle,
            professional,
            bookingDate,
            bookingTime,
            address,
            city,
            phone,
            price,
        } = req.body;

        // Validate required fields
        if (
            !service ||
            !serviceTitle ||
            !bookingDate ||
            !bookingTime ||
            !address ||
            !phone ||
            price === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required booking details",
            });
        }

        // Create booking
        const booking = await Booking.create({
            user: req.userId,
            service,
            serviceTitle,
            professional: professional || "",
            bookingDate,
            bookingTime,
            address,
            city: city || "",
            phone,
            price,
        });

        // Create notification
        await Notification.create({
            user: req.userId,
            title: "Booking Confirmed",
            message: `${serviceTitle} booking created successfully.`,
            type: "booking",
        });

        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            booking,
        });

    } catch (error) {
        console.error(
            "Create Booking Error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


// Get all bookings of logged-in user
export const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            user: req.userId,
        }).sort({
            createdAt: -1,
        });

        res.set("Cache-Control", "no-store");

        res.status(200).json({
            success: true,
            bookings,
        });

    } catch (error) {
        console.error(
            "Get Bookings Error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


// Get booking statistics of logged-in user
export const getBookingStats = async (req, res) => {
    try {
        const bookings = await Booking.find({
            user: req.userId,
        }).select("status");

        const total = bookings.length;

        const completed = bookings.filter(
            (booking) => booking.status === "completed"
        ).length;

        const pending = bookings.filter(
            (booking) =>
                booking.status === "pending" ||
                booking.status === "confirmed"
        ).length;

        res.status(200).json({
            success: true,
            stats: {
                total,
                completed,
                pending,
            },
        });

    } catch (error) {
        console.error(
            "Get Booking Stats Error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


// Cancel a booking
export const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findOne({
            _id: req.params.id,
            user: req.userId,
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        if (booking.status === "completed") {
            return res.status(400).json({
                success: false,
                message: "Completed booking cannot be cancelled",
            });
        }

        if (booking.status === "cancelled") {
            return res.status(400).json({
                success: false,
                message: "Booking is already cancelled",
            });
        }

        booking.status = "cancelled";

        await booking.save();

        // Create cancellation notification
        await Notification.create({
            user: req.userId,
            title: "Booking Cancelled",
            message: `${booking.serviceTitle} booking has been cancelled.`,
            type: "booking",
        });

        res.status(200).json({
            success: true,
            message: "Booking cancelled successfully",
            booking,
        });

    } catch (error) {
        console.error(
            "Cancel Booking Error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
// Reschedule a booking
export const rescheduleBooking = async (req, res) => {
    try {
        const {
            bookingDate,
            bookingTime,
        } = req.body;

        // Validate required fields
        if (!bookingDate || !bookingTime) {
            return res.status(400).json({
                success: false,
                message: "Booking date and time are required",
            });
        }

        // Find booking belonging to logged-in user
        const booking = await Booking.findOne({
            _id: req.params.id,
            user: req.userId,
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        // Completed booking cannot be rescheduled
        if (booking.status === "completed") {
            return res.status(400).json({
                success: false,
                message: "Completed booking cannot be rescheduled",
            });
        }

        // Cancelled booking cannot be rescheduled
        if (booking.status === "cancelled") {
            return res.status(400).json({
                success: false,
                message: "Cancelled booking cannot be rescheduled",
            });
        }

        // Update booking date and time
        booking.bookingDate = bookingDate;
        booking.bookingTime = bookingTime;

        await booking.save();

        // Create notification
        await Notification.create({
            user: req.userId,
            title: "Booking Rescheduled",
            message: `${booking.serviceTitle} booking has been rescheduled successfully.`,
            type: "booking",
        });

        res.status(200).json({
            success: true,
            message: "Booking rescheduled successfully",
            booking,
        });

    } catch (error) {
        console.error(
            "Reschedule Booking Error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};