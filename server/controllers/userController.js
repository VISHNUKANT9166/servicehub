import User from "../models/User.js";

// Get currently logged-in user
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {
        console.error("Get User Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


// Update user profile
export const updateProfile = async (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            address,
            city,
            state,
            pincode,
            profileImage,
        } = req.body;

        // Required fields
        if (!fullName || !email || !phone) {
            return res.status(400).json({
                success: false,
                message: "Full name, email and phone are required",
            });
        }

        // Check if email is already used by another user
        const existingUser = await User.findOne({
            email,
            _id: { $ne: req.userId },
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email is already used by another account",
            });
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            req.userId,
            {
                fullName,
                email,
                phone,
                address,
                city,
                state,
                pincode,
                profileImage,
            },
            {
                new: true,
                runValidators: true,
            }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser,
        });

    } catch (error) {
        console.error("Update Profile Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};