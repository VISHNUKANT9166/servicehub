import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


// =====================================================
// HELPERS
// =====================================================

const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user._id.toString(),
            role: user.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );
};


const normalizeEmail = (email) => {
    return email.trim().toLowerCase();
};


// =====================================================
// SIGNUP
// =====================================================

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


        // =================================================
        // BASIC VALIDATION
        // =================================================

        if (
            typeof fullName !== "string" ||
            !fullName.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Full name is required",
            });
        }


        if (
            typeof email !== "string" ||
            !email.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }


        if (
            typeof phone !== "string" ||
            !phone.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Phone number is required",
            });
        }


        if (
            typeof password !== "string" ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Password is required",
            });
        }


        // =================================================
        // NORMALIZE INPUT
        // =================================================

        const normalizedFullName =
            fullName.trim();

        const normalizedEmail =
            normalizeEmail(email);

        const normalizedPhone =
            phone.trim();


        // =================================================
        // EMAIL VALIDATION
        // =================================================

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address",
            });
        }


        // =================================================
        // PASSWORD VALIDATION
        // =================================================

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message:
                    "Password must be at least 6 characters long",
            });
        }


        // =================================================
        // PHONE VALIDATION
        // =================================================

        const phoneRegex = /^[0-9]{10}$/;

        if (!phoneRegex.test(normalizedPhone)) {
            return res.status(400).json({
                success: false,
                message:
                    "Please enter a valid 10-digit phone number",
            });
        }


        // =================================================
        // CHECK EXISTING USER
        // =================================================

        const existingUser =
            await User.findOne({
                email: normalizedEmail,
            });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message:
                    "User already exists with this email",
            });
        }


        // =================================================
        // HASH PASSWORD
        // =================================================

        const hashedPassword =
            await bcrypt.hash(password, 12);


        // =================================================
        // CREATE USER
        // =================================================

        const user = await User.create({
            fullName:
                normalizedFullName,

            email:
                normalizedEmail,

            phone:
                normalizedPhone,

            password:
                hashedPassword,

            address:
                typeof address === "string"
                    ? address.trim()
                    : "",

            city:
                typeof city === "string"
                    ? city.trim()
                    : "",

            state:
                typeof state === "string"
                    ? state.trim()
                    : "",

            pincode:
                typeof pincode === "string"
                    ? pincode.trim()
                    : "",
        });


        // =================================================
        // GENERATE TOKEN
        // =================================================

        const token =
            generateToken(user);


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(201).json({
            success: true,
            message:
                "Account created successfully",

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

        console.error(
            "Signup Error:",
            error
        );


        // =================================================
        // DUPLICATE KEY
        // =================================================

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message:
                    "An account already exists with this email",
            });
        }


        // =================================================
        // MONGOOSE VALIDATION
        // =================================================

        if (
            error.name ===
            "ValidationError"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid signup data",

                errors:
                    Object.values(
                        error.errors
                    ).map(
                        (item) =>
                            item.message
                    ),
            });
        }


        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


// =====================================================
// LOGIN
// =====================================================

export const login = async (req, res) => {
    try {

        const {
            email,
            password,
        } = req.body;


        // =================================================
        // BASIC VALIDATION
        // =================================================

        if (
            typeof email !== "string" ||
            !email.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }


        if (
            typeof password !== "string" ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Password is required",
            });
        }


        // =================================================
        // NORMALIZE EMAIL
        // =================================================

        const normalizedEmail =
            normalizeEmail(email);


        // =================================================
        // FIND USER
        // =================================================

        const user =
            await User.findOne({
                email: normalizedEmail,
            });


        // =================================================
        // INVALID CREDENTIALS
        // =================================================

        if (!user) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password",
            });
        }


        // =================================================
        // COMPARE PASSWORD
        // =================================================

        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );


        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message:
                    "Invalid email or password",
            });
        }


        // =================================================
        // GENERATE TOKEN
        // =================================================

        const token =
            generateToken(user);


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(200).json({
            success: true,
            message:
                "Login successful",

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

        console.error(
            "Login Error:",
            error
        );


        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};