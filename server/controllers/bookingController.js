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
        console.error("Create Booking Error:", error.message);

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
        console.error("Get Bookings Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};