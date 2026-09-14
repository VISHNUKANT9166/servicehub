import jwt from "jsonwebtoken";
import User from "../models/User.js";

const protect = async (req, res, next) => {
    try {
        // =====================================================
        // CHECK AUTHORIZATION HEADER
        // =====================================================

        const authHeader = req.headers.authorization;

        if (
            !authHeader ||
            !authHeader.startsWith("Bearer ")
        ) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. Token required.",
            });
        }


        // =====================================================
        // EXTRACT TOKEN
        // =====================================================

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authorized. Token required.",
            });
        }


        // =====================================================
        // VERIFY TOKEN
        // =====================================================

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        // =====================================================
        // VALIDATE TOKEN PAYLOAD
        // =====================================================

        if (!decoded.userId) {
            return res.status(401).json({
                success: false,
                message: "Invalid authentication token.",
            });
        }


        // =====================================================
        // FIND CURRENT USER
        // =====================================================

        const user = await User.findById(
            decoded.userId
        ).select("_id role");


        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User account no longer exists.",
            });
        }


        // =====================================================
        // ATTACH CURRENT USER INFORMATION
        // =====================================================

        req.userId = user._id.toString();
        req.userRole = user.role;

        req.user = user;


        // =====================================================
        // CONTINUE
        // =====================================================

        next();

    } catch (error) {

        console.error(
            "Authentication Error:",
            error.message
        );

        return res.status(401).json({
            success: false,
            message:
                "Not authorized. Invalid or expired token.",
        });
    }
};

export default protect;