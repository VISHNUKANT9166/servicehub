import express from "express";

import {
    createBooking,
    getMyBookings,
    getBookingStats,
    cancelBooking,
    rescheduleBooking,
} from "../controllers/bookingController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/stats", protect, getBookingStats);
router.get("/", protect, getMyBookings);
router.put("/:id/cancel", protect, cancelBooking);
router.put("/:id/reschedule", protect, rescheduleBooking);
export default router;