import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        // =====================================================
        // CUSTOMER
        // =====================================================

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        // =====================================================
        // SERVICE
        // =====================================================

        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: true,
            index: true,
        },

        // =====================================================
        // PROFESSIONAL
        // =====================================================

        professional: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Professional",
            required: true,
            index: true,
        },

        // =====================================================
        // SERVICE SNAPSHOT
        // =====================================================

        serviceTitle: {
            type: String,
            required: true,
            trim: true,
        },

        // =====================================================
        // BOOKING DATE & TIME
        // =====================================================

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

        // =====================================================
        // CUSTOMER CONTACT / ADDRESS
        // =====================================================

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

        // =====================================================
        // PRICE SNAPSHOT
        // =====================================================

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        // =====================================================
        // ADDITIONAL CUSTOMER NOTES
        // =====================================================

        notes: {
            type: String,
            default: "",
            trim: true,
            maxlength: 1000,
        },

        // =====================================================
        // BOOKING STATUS
        // =====================================================

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

        // =====================================================
        // PAYMENT STATUS
        // =====================================================

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
// COMPOUND INDEX
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

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;