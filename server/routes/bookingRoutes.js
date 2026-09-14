import express from "express";

import {
    createBooking,
    getMyBookings,
    getBookingStats,
    cancelBooking,
    rescheduleBooking,
    getProfessionalBookingStats,
    getProfessionalBookings,
    updateBookingStatus,
} from "../controllers/bookingController.js";

import protect from "../middleware/authMiddleware.js";

import professionalOnly from "../middleware/professionalMiddleware.js";

const router = express.Router();


// =====================================================
// CREATE BOOKING
// POST /api/bookings
// Protected - User
// =====================================================

router.post(
    "/",
    protect,
    createBooking
);


// =====================================================
// GET PROFESSIONAL BOOKING STATS
// GET /api/bookings/professional/stats
// Protected - Professional
// =====================================================

router.get(
    "/professional/stats",
    protect,
    professionalOnly,
    getProfessionalBookingStats
);


// =====================================================
// GET PROFESSIONAL BOOKINGS
// GET /api/bookings/professional
// Protected - Professional
// =====================================================

router.get(
    "/professional",
    protect,
    professionalOnly,
    getProfessionalBookings
);


// =====================================================
// GET USER BOOKING STATS
// GET /api/bookings/stats
// Protected - User
// =====================================================

router.get(
    "/stats",
    protect,
    getBookingStats
);


// =====================================================
// GET MY BOOKINGS
// GET /api/bookings
// Protected - User
// =====================================================

router.get(
    "/",
    protect,
    getMyBookings
);


// =====================================================
// UPDATE BOOKING STATUS
// PATCH /api/bookings/:id/status
// Protected - Professional
// =====================================================

router.patch(
    "/:id/status",
    protect,
    professionalOnly,
    updateBookingStatus
);


// =====================================================
// CANCEL BOOKING
// PUT /api/bookings/:id/cancel
// Protected - User
// =====================================================

router.put(
    "/:id/cancel",
    protect,
    cancelBooking
);


// =====================================================
// RESCHEDULE BOOKING
// PUT /api/bookings/:id/reschedule
// Protected - User
// =====================================================

router.put(
    "/:id/reschedule",
    protect,
    rescheduleBooking
);


export default router;