import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            required: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        role: {
            type: String,
            enum: ["user", "professional", "admin"],
            default: "user",
        },

        address: {
            type: String,
            default: "",
            trim: true,
        },

        city: {
            type: String,
            default: "",
            trim: true,
        },

        state: {
            type: String,
            default: "",
            trim: true,
        },

        pincode: {
            type: String,
            default: "",
            trim: true,
        },

        profileImage: {
            type: String,
            default: "",
        },
        wishlist: {
            type: [Number],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);

export default User;