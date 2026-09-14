import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true,
            index: true,
        },

        professional: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Professional",
            required: true,
            index: true,
        },

        serviceTitle: {
            type: String,
            required: true,
            trim: true,
        },

        bookingDate: {
            type: Date,
            required: true,
            index: true,
        },

        bookingTime: {
            type: String,
            required: true,
            trim: true,
        },

        /*
         * Unique key for an active professional time slot.
         *
         * Example:
         * professionalId_2026-09-20_14:30
         *
         * This field becomes null when a booking is cancelled,
         * allowing the slot to be booked again.
         */
        activeSlotKey: {
            type: String,
            default: null,
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
            min: 0,
        },

        notes: {
            type: String,
            default: "",
            trim: true,
            maxlength: 1000,
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
            index: true,
        },

        paymentStatus: {
            type: String,
            enum: [
                "pending",
                "paid",
                "failed",
            ],
            default: "pending",
            index: true,
        },
    },
    {
        timestamps: true,
    }
);


// =====================================================
// INDEXES
// =====================================================

bookingSchema.index({
    professional: 1,
    bookingDate: 1,
    bookingTime: 1,
});

bookingSchema.index({
    user: 1,
    createdAt: -1,
});


// =====================================================
// UNIQUE ACTIVE SLOT
// Prevents double booking at database level.
// Sparse index allows cancelled bookings to have null.
// =====================================================

bookingSchema.index(
    {
        activeSlotKey: 1,
    },
    {
        unique: true,
        sparse: true,
        name: "unique_active_booking_slot",
    }
);


const Booking = mongoose.model(
    "Booking",
    bookingSchema
);

export default Booking;