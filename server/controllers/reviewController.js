import mongoose from "mongoose";

import Review from "../models/Review.js";
import Booking from "../models/Booking.js";
import Service from "../models/Service.js";
import Professional from "../models/Professional.js";


// =====================================================
// HELPERS
// =====================================================

const isValidObjectId = (id) =>
    mongoose.Types.ObjectId.isValid(id);


const normalizeString = (value) =>
    typeof value === "string"
        ? value.trim()
        : "";


const calculateRating = async (
    Model,
    modelId
) => {
    const result =
        await Review.aggregate([
            {
                $match: {
                    [Model === Service
                        ? "service"
                        : "professional"]: new mongoose.Types.ObjectId(
                            modelId
                        ),
                },
            },
            {
                $group: {
                    _id: null,
                    averageRating: {
                        $avg: "$rating",
                    },
                    totalReviews: {
                        $sum: 1,
                    },
                },
            },
        ]);

    if (!result.length) {
        return {
            rating: 0,
            totalReviews: 0,
        };
    }

    return {
        rating: Number(
            result[0].averageRating.toFixed(1)
        ),
        totalReviews:
            result[0].totalReviews,
    };
};


// =====================================================
// CREATE REVIEW
// =====================================================

export const createReview = async (
    req,
    res
) => {
    try {
        const userId = req.user._id;

        const {
            bookingId,
            rating,
            comment,
        } = req.body;

        if (!isValidObjectId(bookingId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid booking ID.",
            });
        }

        const numericRating =
            Number(rating);

        if (
            !Number.isInteger(
                numericRating
            ) ||
            numericRating < 1 ||
            numericRating > 5
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Rating must be a whole number between 1 and 5.",
            });
        }

        const normalizedComment =
            normalizeString(comment);

        if (
            normalizedComment.length < 2
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Review comment must be at least 2 characters.",
            });
        }

        if (
            normalizedComment.length > 1000
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Review comment cannot exceed 1000 characters.",
            });
        }


        // -------------------------------------------------
        // FIND USER'S COMPLETED BOOKING
        // -------------------------------------------------

        const booking =
            await Booking.findOne({
                _id: bookingId,
                user: userId,
                status: "completed",
            });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message:
                    "Only completed bookings can be reviewed.",
            });
        }


        // -------------------------------------------------
        // CHECK EXISTING REVIEW
        // -------------------------------------------------

        const existingReview =
            await Review.findOne({
                booking: booking._id,
            });

        if (existingReview) {
            return res.status(409).json({
                success: false,
                message:
                    "A review already exists for this booking.",
            });
        }


        // -------------------------------------------------
        // VERIFY SERVICE STILL EXISTS
        // -------------------------------------------------

        const service =
            await Service.findById(
                booking.service
            );

        if (!service) {
            return res.status(404).json({
                success: false,
                message:
                    "The service associated with this booking no longer exists.",
            });
        }


        // -------------------------------------------------
        // VERIFY PROFESSIONAL STILL EXISTS
        // -------------------------------------------------

        const professional =
            await Professional.findById(
                booking.professional
            );

        if (!professional) {
            return res.status(404).json({
                success: false,
                message:
                    "The professional associated with this booking no longer exists.",
            });
        }


        // -------------------------------------------------
        // CREATE REVIEW
        // -------------------------------------------------

        const review =
            await Review.create({
                user: userId,
                booking: booking._id,
                service: booking.service,
                professional:
                    booking.professional,
                rating: numericRating,
                comment:
                    normalizedComment,
            });


        // -------------------------------------------------
        // RECALCULATE SERVICE RATING
        // -------------------------------------------------

        const serviceRating =
            await calculateRating(
                Service,
                booking.service
            );


        await Service.findByIdAndUpdate(
            booking.service,
            {
                $set: {
                    rating:
                        serviceRating.rating,
                    totalReviews:
                        serviceRating.totalReviews,
                },
            }
        );


        // -------------------------------------------------
        // RECALCULATE PROFESSIONAL RATING
        // -------------------------------------------------

        const professionalRating =
            await calculateRating(
                Professional,
                booking.professional
            );


        await Professional.findByIdAndUpdate(
            booking.professional,
            {
                $set: {
                    rating:
                        professionalRating.rating,
                    totalReviews:
                        professionalRating.totalReviews,
                },
            }
        );


        const populatedReview =
            await Review.findById(
                review._id
            )
                .populate(
                    "user",
                    "fullName profileImage"
                )
                .populate(
                    "service",
                    "title category"
                )
                .populate(
                    "professional",
                    "profession rating totalReviews"
                );


        return res.status(201).json({
            success: true,
            message:
                "Review submitted successfully.",
            review:
                populatedReview,
        });
    } catch (error) {
        console.error(
            "Create review error:",
            error
        );


        // -------------------------------------------------
        // MONGODB DUPLICATE KEY
        // -------------------------------------------------

        if (
            error.code === 11000
        ) {
            return res.status(409).json({
                success: false,
                message:
                    "A review already exists for this booking.",
            });
        }


        return res.status(500).json({
            success: false,
            message:
                "Failed to submit review.",
        });
    }
};


// =====================================================
// GET SERVICE REVIEWS
// =====================================================

export const getServiceReviews = async (
    req,
    res
) => {
    try {
        const { serviceId } =
            req.params;

        if (
            !isValidObjectId(serviceId)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid service ID.",
            });
        }

        const reviews =
            await Review.find({
                service: serviceId,
            })
                .populate(
                    "user",
                    "fullName profileImage"
                )
                .sort({
                    createdAt: -1,
                });

        return res.status(200).json({
            success: true,
            reviews,
        });
    } catch (error) {
        console.error(
            "Get service reviews error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch service reviews.",
        });
    }
};


// =====================================================
// GET PROFESSIONAL REVIEWS
// =====================================================

export const getProfessionalReviews = async (
    req,
    res
) => {
    try {
        const {
            professionalId,
        } = req.params;

        if (
            !isValidObjectId(
                professionalId
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid professional ID.",
            });
        }

        const reviews =
            await Review.find({
                professional:
                    professionalId,
            })
                .populate(
                    "user",
                    "fullName profileImage"
                )
                .populate(
                    "service",
                    "title category"
                )
                .sort({
                    createdAt: -1,
                });

        return res.status(200).json({
            success: true,
            reviews,
        });
    } catch (error) {
        console.error(
            "Get professional reviews error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch professional reviews.",
        });
    }
};


// =====================================================
// GET MY REVIEW FOR A BOOKING
// =====================================================

export const getMyBookingReview = async (
    req,
    res
) => {
    try {
        const userId = req.user._id;

        const {
            bookingId,
        } = req.params;

        if (
            !isValidObjectId(
                bookingId
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid booking ID.",
            });
        }

        const review =
            await Review.findOne({
                booking: bookingId,
                user: userId,
            })
                .populate(
                    "service",
                    "title category"
                )
                .populate(
                    "professional",
                    "profession rating"
                );

        return res.status(200).json({
            success: true,
            review: review || null,
        });
    } catch (error) {
        console.error(
            "Get booking review error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Failed to fetch booking review.",
        });
    }
};