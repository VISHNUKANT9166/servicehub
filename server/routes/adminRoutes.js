import express from "express";

import {
    getProfessionalApplications,
    getProfessionalApplicationById,
    approveProfessionalApplication,
    rejectProfessionalApplication,
    getAdminDashboardStats,
} from "../controllers/adminController.js";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";


const router = express.Router();


// =====================================================
// ADMIN DASHBOARD
// =====================================================

// Get admin dashboard statistics
// GET /api/admin/dashboard/stats

router.get(
    "/dashboard/stats",
    protect,
    authorize("admin"),
    getAdminDashboardStats
);


// =====================================================
// PROFESSIONAL APPLICATIONS
// =====================================================

// Get professional applications
// GET /api/admin/professionals

router.get(
    "/professionals",
    protect,
    authorize("admin"),
    getProfessionalApplications
);


// Get single professional application
// GET /api/admin/professionals/:id

router.get(
    "/professionals/:id",
    protect,
    authorize("admin"),
    getProfessionalApplicationById
);


// Approve professional application
// PATCH /api/admin/professionals/:id/approve

router.patch(
    "/professionals/:id/approve",
    protect,
    authorize("admin"),
    approveProfessionalApplication
);


// Reject professional application
// PATCH /api/admin/professionals/:id/reject

router.patch(
    "/professionals/:id/reject",
    protect,
    authorize("admin"),
    rejectProfessionalApplication
);


export default router;