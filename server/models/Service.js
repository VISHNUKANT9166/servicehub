import mongoose from "mongoose";


// =====================================================
// SERVICE SCHEMA
// =====================================================

const serviceSchema = new mongoose.Schema(
    {
        // =====================================================
        // PROFESSIONAL
        // =====================================================

        professional: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Professional",
            required: [true, "Professional is required"],
        },


        // =====================================================
        // SERVICE INFORMATION
        // =====================================================

        title: {
            type: String,
            required: [true, "Service title is required"],
            trim: true,
            minlength: [2, "Service title must be at least 2 characters"],
            maxlength: [150, "Service title cannot exceed 150 characters"],
        },

        description: {
            type: String,
            default: "",
            trim: true,
            maxlength: [2000, "Service description cannot exceed 2000 characters"],
        },

        category: {
            type: String,
            required: [true, "Service category is required"],
            trim: true,
            minlength: [2, "Service category must be at least 2 characters"],
            maxlength: [100, "Service category cannot exceed 100 characters"],
        },

        price: {
            type: Number,
            required: [true, "Service price is required"],
            min: [0, "Service price cannot be negative"],
            validate: {
                validator: Number.isFinite,
                message: "Service price must be a valid number",
            },
        },

        duration: {
            type: Number,
            default: 60,
            min: [1, "Service duration must be at least 1 minute"],
            validate: {
                validator: Number.isInteger,
                message: "Service duration must be a whole number of minutes",
            },
        },


        // =====================================================
        // SKILLS
        // =====================================================

        skills: {
            type: [
                {
                    type: String,
                    trim: true,
                    maxlength: [100, "Each skill cannot exceed 100 characters"],
                },
            ],
            default: [],
        },


        // =====================================================
        // SERVICE AREAS
        // =====================================================

        serviceAreas: {
            type: [
                {
                    type: String,
                    trim: true,
                    maxlength: [
                        150,
                        "Each service area cannot exceed 150 characters",
                    ],
                },
            ],
            default: [],
        },


        // =====================================================
        // SERVICE IMAGE
        // =====================================================

        image: {
            type: String,
            default: "",
            trim: true,
            maxlength: [2048, "Service image URL is too long"],
        },


        // =====================================================
        // SERVICE STATUS
        // =====================================================

        isActive: {
            type: Boolean,
            default: true,
        },


        // =====================================================
        // RATING
        // =====================================================

        rating: {
            type: Number,
            default: 0,
            min: [0, "Rating cannot be less than 0"],
            max: [5, "Rating cannot be greater than 5"],
            validate: {
                validator: Number.isFinite,
                message: "Rating must be a valid number",
            },
        },

        totalReviews: {
            type: Number,
            default: 0,
            min: [0, "Total reviews cannot be negative"],
            validate: {
                validator: Number.isInteger,
                message: "Total reviews must be a whole number",
            },
        },
    },

    {
        timestamps: true,

        // Reject fields that are not defined in the schema
        strict: true,
    }
);


// =====================================================
// INDEXES
// =====================================================

// Professional's services ordered by newest first
serviceSchema.index({
    professional: 1,
    createdAt: -1,
});


// Active services ordered by newest first
serviceSchema.index({
    isActive: 1,
    createdAt: -1,
});


// Category + active services
serviceSchema.index({
    category: 1,
    isActive: 1,
    createdAt: -1,
});


// =====================================================
// MODEL
// =====================================================

const Service = mongoose.model(
    "Service",
    serviceSchema
);

export default Service;