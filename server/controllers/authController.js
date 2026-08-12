import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const signup = async (req, res) => {
    try {
        const {
            fullName,
            email,
            phone,
            password,
            address,
            city,
            state,
            pincode,
        } = req.body;

        // Check required fields
        if (!fullName || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            fullName,
            email,
            phone,
            password: hashedPassword,
            address,
            city,
            state,
            pincode,
        });

        // Create JWT
        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d",
            }
        );

        res.status(201).json({
            success: true,
            message: "Account created successfully",
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        });

    } catch (error) {
        console.error("Signup Error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};