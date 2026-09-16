import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

// =====================================================
// ROUTES
// =====================================================

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import notificationRoutes from "./routes/NotificationRoutes.js";
import professionalRoutes from "./routes/professionalRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";

// =====================================================
// MIDDLEWARE
// =====================================================

import uploadErrorMiddleware from "./middleware/uploadErrorMiddleware.js";

// =====================================================
// CONFIGURATION
// =====================================================

dotenv.config();

// =====================================================
// APP INITIALIZATION
// =====================================================

const app = express();

// =====================================================
// GLOBAL MIDDLEWARE
// =====================================================

app.use(
    cors({
        origin:
            process.env.CLIENT_URL ||
            "http://localhost:5173",

        credentials: true,
    })
);

// Parse JSON requests
app.use(
    express.json({
        limit: "10mb",
    })
);

// Parse URL encoded requests
app.use(
    express.urlencoded({
        extended: true,
        limit: "10mb",
    })
);

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message:
            "ServiceHub Backend is Running",
    });
});

// =====================================================
// API ROUTES
// =====================================================

// Authentication
app.use(
    "/api/auth",
    authRoutes
);

// Users
app.use(
    "/api/users",
    userRoutes
);

// Bookings
app.use(
    "/api/bookings",
    bookingRoutes
);

// Wishlist
app.use(
    "/api/wishlist",
    wishlistRoutes
);

// Notifications
app.use(
    "/api/notifications",
    notificationRoutes
);

// Professionals
app.use(
    "/api/professionals",
    professionalRoutes
);

// Services
app.use(
    "/api/services",
    serviceRoutes
);

// Admin
app.use(
    "/api/admin",
    adminRoutes
);

// Reviews
app.use(
    "/api/reviews",
    reviewRoutes
);

// =====================================================
// UPLOAD ERROR HANDLER
// =====================================================

// Handles Multer / Cloudinary upload errors
// Must come AFTER routes

app.use(
    uploadErrorMiddleware
);

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
    res.status(404).json({
        success: false,

        message:
            `Route not found: ${req.method} ${req.originalUrl}`,
    });
});

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
    console.error(
        "Global Error:",
        err
    );

    const statusCode =
        err.statusCode ||
        err.status ||
        500;

    res.status(statusCode).json({
        success: false,

        message:
            process.env.NODE_ENV === "production"
                ? "Internal server error"
                : (
                    err.message ||
                    "Internal server error"
                ),
    });
});

// =====================================================
// DATABASE + SERVER START
// =====================================================

const PORT =
    process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Connect Database
        await connectDB();

        // Start Server
        app.listen(PORT, () => {
            console.log(
                `🚀 ServiceHub Server running on port ${PORT}`
            );
        });
    } catch (error) {
        console.error(
            "❌ Failed to start server:",
            error
        );

        process.exit(1);
    }
};

startServer();