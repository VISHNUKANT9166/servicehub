import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User is required"],
            index: true,
        },

        booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking",
            required: [true, "Booking is required"],
            unique: true,
            index: true,
        },

        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Service",
            required: [true, "Service is required"],
            index: true,
        },

        professional: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Professional",
            required: [true, "Professional is required"],
            index: true,
        },

        rating: {
            type: Number,
            required: [true, "Rating is required"],
            min: [1, "Rating must be at least 1"],
            max: [5, "Rating cannot exceed 5"],
            validate: {
                validator: Number.isInteger,
                message: "Rating must be a whole number",
            },
        },

        comment: {
            type: String,
            required: [true, "Review comment is required"],
            trim: true,
            minlength: [
                2,
                "Review comment must be at least 2 characters",
            ],
            maxlength: [
                1000,
                "Review comment cannot exceed 1000 characters",
            ],
        },
    },
    {
        timestamps: true,
    }
);


// =====================================================
// INDEXES
// =====================================================

reviewSchema.index({
    service: 1,
    createdAt: -1,
});

reviewSchema.index({
    professional: 1,
    createdAt: -1,
});

reviewSchema.index({
    user: 1,
    createdAt: -1,
});


const Review = mongoose.model(
    "Review",
    reviewSchema
);

export default Review;