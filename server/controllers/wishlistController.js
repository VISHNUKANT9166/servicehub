import User from "../models/User.js";

// Get current user's wishlist
export const getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("wishlist");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            wishlist: user.wishlist,
        });

    } catch (error) {
        console.error("Get Wishlist Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


// Add service to wishlist
export const addToWishlist = async (req, res) => {
    try {
        const serviceId = Number(req.params.serviceId);

        if (!serviceId) {
            return res.status(400).json({
                success: false,
                message: "Invalid service ID",
            });
        }

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (!user.wishlist.includes(serviceId)) {
            user.wishlist.push(serviceId);
            await user.save();
        }

        res.status(200).json({
            success: true,
            message: "Service added to wishlist",
            wishlist: user.wishlist,
        });

    } catch (error) {
        console.error("Add Wishlist Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


// Remove service from wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const serviceId = Number(req.params.serviceId);

        if (!serviceId) {
            return res.status(400).json({
                success: false,
                message: "Invalid service ID",
            });
        }

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        user.wishlist = user.wishlist.filter(
            (id) => id !== serviceId
        );

        await user.save();

        res.status(200).json({
            success: true,
            message: "Service removed from wishlist",
            wishlist: user.wishlist,
        });

    } catch (error) {
        console.error("Remove Wishlist Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};