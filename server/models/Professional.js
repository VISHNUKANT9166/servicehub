import mongoose from "mongoose";

const professionalSchema = new mongoose.Schema(
    {
        // =====================================================
        // USER LINK
        // =====================================================

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
            index: true,
        },


        // =====================================================
        // PROFESSIONAL INFORMATION
        // =====================================================

        profession: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },

        experience: {
            type: Number,
            required: true,
            min: 0,
        },

        description: {
            type: String,
            default: "",
            trim: true,
            maxlength: 2000,
        },

        skills: {
            type: [String],
            default: [],
        },

        // Cities / areas where professional provides services
        serviceAreas: {
            type: [String],
            default: [],
        },

        // Starting price / charges requested by professional
        startingCharges: {
            type: Number,
            required: true,
            min: 0,
        },


        // =====================================================
        // DOCUMENTS / PROFILE MEDIA
        // =====================================================

        profileImage: {
            type: String,
            default: "",
        },

        certificate: {
            type: String,
            default: "",
        },


        // =====================================================
        // APPLICATION STATUS
        // =====================================================

        applicationStatus: {
            type: String,
            enum: [
                "pending",
                "approved",
                "rejected",
            ],
            default: "pending",
            index: true,
        },

        rejectionReason: {
            type: String,
            default: "",
            trim: true,
            maxlength: 1000,
        },


        // =====================================================
        // TERMS & CONDITIONS
        // =====================================================

        termsAccepted: {
            type: Boolean,
            required: true,
            default: false,
        },

        termsAcceptedAt: {
            type: Date,
            default: null,
        },


        // =====================================================
        // ADMIN REVIEW
        // =====================================================

        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        reviewedAt: {
            type: Date,
            default: null,
        },


        // =====================================================
        // PROFESSIONAL AVAILABILITY
        // =====================================================

        availability: {
            type: String,
            enum: [
                "available",
                "busy",
                "unavailable",
            ],
            default: "available",
        },


        // =====================================================
        // RATING INFORMATION
        // =====================================================

        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },

        totalReviews: {
            type: Number,
            default: 0,
            min: 0,
        },

        totalJobs: {
            type: Number,
            default: 0,
            min: 0,
        },


        // =====================================================
        // VERIFICATION
        // =====================================================

        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);


// =====================================================
// INDEXES
// =====================================================

professionalSchema.index({
    category: 1,
    applicationStatus: 1,
});

professionalSchema.index({
    serviceAreas: 1,
});

professionalSchema.index({
    isVerified: 1,
    applicationStatus: 1,
});


const Professional = mongoose.model(
    "Professional",
    professionalSchema
);

export default Professional;