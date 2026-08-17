import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        service: {
            type: Number,
            required: true,
        },

        serviceTitle: {
            type: String,
            required: true,
            trim: true,
        },

        professional: {
            type: String,
            default: "",
            trim: true,
        },

        bookingDate: {
            type: Date,
            required: true,
        },

        bookingTime: {
            type: String,
            required: true,
            trim: true,
        },

        address: {
            type: String,
            required: true,
            trim: true,
        },

        city: {
            type: String,
            default: "",
            trim: true,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        price: {
            type: Number,
            required: true,
        },

        status: {
            type: String,
            enum: [
                "pending",
                "confirmed",
                "completed",
                "cancelled",
            ],
            default: "pending",
        },

        paymentStatus: {
            type: String,
            enum: [
                "pending",
                "paid",
                "failed",
            ],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;