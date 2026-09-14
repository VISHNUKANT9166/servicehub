import express from "express";

import {
    createProfessionalProfile,
    getMyProfessionalProfile,
    updateMyProfessionalProfile,
} from "../controllers/professionalController.js";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

import {
    uploadProfessionalDocuments,
} from "../middleware/uploadMiddleware.js";


const router = express.Router();


// =====================================================
// PROFESSIONAL APPLICATION
// =====================================================

// Submit professional application
// Any authenticated user can apply

router.post(
    "/",
    protect,
    uploadProfessionalDocuments,
    createProfessionalProfile
);


// =====================================================
// PROFESSIONAL PROFILE
// =====================================================

// Get own professional application/profile
// Only approved professionals

router.get(
    "/me",
    protect,
    authorize("professional"),
    getMyProfessionalProfile
);


// =====================================================
// UPDATE PROFESSIONAL PROFILE
// =====================================================

// Only approved professionals

router.put(
    "/me",
    protect,
    authorize("professional"),
    uploadProfessionalDocuments,
    updateMyProfessionalProfile
);


export default router;