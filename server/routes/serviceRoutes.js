import express from "express";

import {
    createService,
    getAllServices,
    getServiceById,
    getMyServices,
    updateService,
    deleteService,
    toggleServiceStatus,
} from "../controllers/serviceController.js";

import protect from "../middleware/authMiddleware.js";
import authorize from "../middleware/roleMiddleware.js";

const router = express.Router();


// =====================================================
// PUBLIC ROUTES
// =====================================================

router.get(
    "/",
    getAllServices
);


// =====================================================
// PROFESSIONAL ROUTES
// IMPORTANT: /my MUST COME BEFORE /:id
// =====================================================

router.get(
    "/my",
    protect,
    authorize("professional"),
    getMyServices
);

router.post(
    "/",
    protect,
    authorize("professional"),
    createService
);

router.put(
    "/:id",
    protect,
    authorize("professional"),
    updateService
);

router.patch(
    "/:id/status",
    protect,
    authorize("professional"),
    toggleServiceStatus
);

router.delete(
    "/:id",
    protect,
    authorize("professional"),
    deleteService
);


// =====================================================
// SINGLE SERVICE
// IMPORTANT: /:id MUST BE LAST
// =====================================================

router.get(
    "/:id",
    getServiceById
);


export default router;