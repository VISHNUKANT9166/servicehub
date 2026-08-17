import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
    getWishlist,
    addToWishlist,
    removeFromWishlist,
} from "../controllers/wishlistController.js";

const router = express.Router();

router.get("/", protect, getWishlist);

router.post("/:serviceId", protect, addToWishlist);

router.delete("/:serviceId", protect, removeFromWishlist);

export default router;