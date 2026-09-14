import mongoose from "mongoose";

const professionalApplicationSchema = new mongoose.Schema(
    {
        // User who submitted the application
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // Professional category / profession
        profession: {
            type: String,
            required: true,
            trim: true,
        },

        // Years of experience
        experience: {
            type: Number,
            required: true,
            min: 0,
        },

        // About professional
        description: {
            type: String,
            default: "",
            trim: true,
        },

        // Skills
        skills: {
            type: [String],
            default: [],
        },

        // Areas where professional provides services
        serviceAreas: {
            type: [String],
            default: [],
        },

        // Expected starting charges
        startingCharges: {
            type: Number,
            required: true,
            min: 0,
        },

        // Profile photo
        profileImage: {
            type: String,
            default: "",
        },

        // Certificate / verification document
        certificate: {
            type: String,
            default: "",
        },

        // Application status
        status: {
            type: String,
            enum: [
                "pending",
                "approved",
                "rejected",
            ],
            default: "pending",
        },

        // Admin's reason / remarks
        adminRemarks: {
            type: String,
            default: "",
            trim: true,
        },

        // Date when admin reviewed the application
        reviewedAt: {
            type: Date,
            default: null,
        },

        // Admin who reviewed the application
        reviewedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

const ProfessionalApplication = mongoose.model(
    "ProfessionalApplication",
    professionalApplicationSchema
);

export default ProfessionalApplication;