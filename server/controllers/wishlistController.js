import mongoose from "mongoose";

import User from "../models/User.js";
import Service from "../models/Service.js";


// ======================================================
// GET CURRENT USER WISHLIST
// ======================================================

export const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
            .populate("wishlist");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const wishlist = Array.isArray(user.wishlist)
            ? user.wishlist
            : [];

        return res.status(200).json({
            success: true,
            wishlist,
        });

    } catch (error) {
        console.error(
            "Get Wishlist Error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


// ======================================================
// ADD SERVICE TO WISHLIST
// ======================================================

export const addToWishlist = async (req, res) => {
    try {
        const { serviceId } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(serviceId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid service ID",
            });
        }

        // Check that service actually exists
        const service = await Service.findById(serviceId);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Service not found",
            });
        }

        // Find user
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Make sure wishlist is always an array
        if (!Array.isArray(user.wishlist)) {
            user.wishlist = [];
        }

        // Check if service already exists
        const alreadyExists = user.wishlist.some(
            (id) => String(id) === String(serviceId)
        );

        if (alreadyExists) {
            return res.status(200).json({
                success: true,
                message: "Service already in wishlist",
                wishlist: user.wishlist,
            });
        }

        // Add service
        user.wishlist.push(serviceId);

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Service added to wishlist",
            wishlist: user.wishlist,
        });

    } catch (error) {
        console.error(
            "Add Wishlist Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


// ======================================================
// REMOVE SERVICE FROM WISHLIST
// ======================================================

export const removeFromWishlist = async (req, res) => {
    try {
        const { serviceId } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(serviceId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid service ID",
            });
        }

        // Find user
        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Make sure wishlist is always an array
        if (!Array.isArray(user.wishlist)) {
            user.wishlist = [];
        }

        // Remove service
        user.wishlist = user.wishlist.filter(
            (id) => String(id) !== String(serviceId)
        );

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Service removed from wishlist",
            wishlist: user.wishlist,
        });

    } catch (error) {
        console.error(
            "Remove Wishlist Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};