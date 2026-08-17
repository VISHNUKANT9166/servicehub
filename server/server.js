import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import wishlistRoutes from "./routes/wishlistRoutes.js";
import notificationRoutes from "./routes/NotificationRoutes.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());



app.get("/", (req, res) => {
    res.send("🚀 ServiceHub Backend is Running...");
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/notifications", notificationRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});