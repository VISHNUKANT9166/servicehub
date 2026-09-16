import express from "express";

import {
    createReview,
    getServiceReviews,
    getProfessionalReviews,
    getMyBookingReview,
} from "../controllers/reviewController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();


// =====================================================
// CREATE REVIEW
// =====================================================

router.post(
    "/",
    protect,
    createReview
);


// =====================================================
// GET SERVICE REVIEWS
// =====================================================

router.get(
    "/service/:serviceId",
    getServiceReviews
);


// =====================================================
// GET PROFESSIONAL REVIEWS
// =====================================================

router.get(
    "/professional/:professionalId",
    getProfessionalReviews
);


// =====================================================
// GET MY REVIEW FOR A BOOKING
// =====================================================

router.get(
    "/booking/:bookingId",
    protect,
    getMyBookingReview
);


export default router;