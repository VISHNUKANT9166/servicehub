import mongoose from "mongoose";

import Professional from "../models/Professional.js";
import User from "../models/User.js";
import Service from "../models/Service.js";
import Booking from "../models/Booking.js";

// =====================================================
// GET ALL PROFESSIONAL APPLICATIONS
// =====================================================

export const getProfessionalApplications = async (
    req,
    res
) => {
    try {
        const {
            status,
            page = 1,
            limit = 10,
        } = req.query;

        const currentPage = Math.max(
            Number(page) || 1,
            1
        );

        const currentLimit = Math.min(
            Math.max(Number(limit) || 10, 1),
            50
        );

        const filter = {};

        if (status) {
            const allowedStatuses = [
                "pending",
                "approved",
                "rejected",
            ];

            if (!allowedStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid application status",
                });
            }

            filter.applicationStatus = status;
        }

        const skip =
            (currentPage - 1) * currentLimit;

        const [
            applications,
            totalApplications,
        ] = await Promise.all([
            Professional.find(filter)
                .populate({
                    path: "user",
                    select: "-password",
                })
                .populate({
                    path: "reviewedBy",
                    select: "fullName email role",
                })
                .sort({
                    createdAt: -1,
                })
                .skip(skip)
                .limit(currentLimit),

            Professional.countDocuments(filter),
        ]);

        const totalPages = Math.ceil(
            totalApplications / currentLimit
        );

        return res
            .status(200)
            .set("Cache-Control", "no-store")
            .json({
                success: true,
                applications,
                pagination: {
                    page: currentPage,
                    limit: currentLimit,
                    totalApplications,
                    totalPages,
                    hasNextPage:
                        currentPage < totalPages,
                    hasPreviousPage:
                        currentPage > 1,
                },
            });

    } catch (error) {
        console.error(
            "Get Professional Applications Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


// =====================================================
// GET SINGLE PROFESSIONAL APPLICATION
// =====================================================

export const getProfessionalApplicationById = async (
    req,
    res
) => {
    try {
        const { id } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid professional application ID",
            });
        }

        const professional =
            await Professional.findById(id)
                .populate({
                    path: "user",
                    select: "-password",
                })
                .populate({
                    path: "reviewedBy",
                    select: "fullName email role",
                });

        if (!professional) {
            return res.status(404).json({
                success: false,
                message:
                    "Professional application not found",
            });
        }

        return res.status(200).json({
            success: true,
            professional,
        });

    } catch (error) {
        console.error(
            "Get Professional Application Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};


// =====================================================
// APPROVE PROFESSIONAL APPLICATION
// =====================================================

export const approveProfessionalApplication = async (
    req,
    res
) => {
    const session =
        await mongoose.startSession();

    try {
        const { id } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid professional application ID",
            });
        }

        let approvedProfessional = null;

        await session.withTransaction(
            async () => {

                const professional =
                    await Professional.findById(id)
                        .session(session);

                if (!professional) {
                    const error =
                        new Error(
                            "Professional application not found"
                        );

                    error.statusCode = 404;

                    throw error;
                }

                if (
                    professional.applicationStatus ===
                    "approved"
                ) {
                    const error =
                        new Error(
                            "Professional application is already approved"
                        );

                    error.statusCode = 409;

                    throw error;
                }

                if (
                    professional.applicationStatus ===
                    "rejected"
                ) {
                    const error =
                        new Error(
                            "Rejected application cannot be approved directly"
                        );

                    error.statusCode = 409;

                    throw error;
                }

                const user =
                    await User.findById(
                        professional.user
                    ).session(session);

                if (!user) {
                    const error =
                        new Error(
                            "Associated user not found"
                        );

                    error.statusCode = 404;

                    throw error;
                }

                // -----------------------------------------
                // Update User role
                // -----------------------------------------

                user.role = "professional";

                await user.save({
                    session,
                });

                // -----------------------------------------
                // Update Professional application
                // -----------------------------------------

                professional.applicationStatus =
                    "approved";

                professional.isVerified =
                    true;

                professional.rejectionReason =
                    "";

                professional.reviewedBy =
                    req.userId;

                professional.reviewedAt =
                    new Date();

                await professional.save({
                    session,
                });

                approvedProfessional =
                    professional;
            }
        );

        await approvedProfessional.populate([
            {
                path: "user",
                select: "-password",
            },
            {
                path: "reviewedBy",
                select: "fullName email role",
            },
        ]);

        return res.status(200).json({
            success: true,
            message:
                "Professional application approved successfully",
            professional:
                approvedProfessional,
        });

    } catch (error) {
        console.error(
            "Approve Professional Application Error:",
            error
        );

        if (error.statusCode) {
            return res.status(
                error.statusCode
            ).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Server error",
        });

    } finally {
        await session.endSession();
    }
};


// =====================================================
// REJECT PROFESSIONAL APPLICATION
// =====================================================

export const rejectProfessionalApplication = async (
    req,
    res
) => {
    const session =
        await mongoose.startSession();

    try {
        const { id } = req.params;

        const {
            rejectionReason,
        } = req.body;

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid professional application ID",
            });
        }

        if (
            typeof rejectionReason !== "string" ||
            !rejectionReason.trim()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Rejection reason is required",
            });
        }

        const normalizedReason =
            rejectionReason.trim();

        if (
            normalizedReason.length > 1000
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Rejection reason cannot exceed 1000 characters",
            });
        }

        let rejectedProfessional = null;

        await session.withTransaction(
            async () => {

                const professional =
                    await Professional.findById(id)
                        .session(session);

                if (!professional) {
                    const error =
                        new Error(
                            "Professional application not found"
                        );

                    error.statusCode = 404;

                    throw error;
                }

                if (
                    professional.applicationStatus ===
                    "approved"
                ) {
                    const error =
                        new Error(
                            "Approved professional cannot be rejected through this endpoint"
                        );

                    error.statusCode = 409;

                    throw error;
                }

                if (
                    professional.applicationStatus ===
                    "rejected"
                ) {
                    const error =
                        new Error(
                            "Professional application is already rejected"
                        );

                    error.statusCode = 409;

                    throw error;
                }

                const user =
                    await User.findById(
                        professional.user
                    ).session(session);

                if (!user) {
                    const error =
                        new Error(
                            "Associated user not found"
                        );

                    error.statusCode = 404;

                    throw error;
                }

                // -----------------------------------------
                // Keep user as normal user
                // -----------------------------------------

                user.role = "user";

                await user.save({
                    session,
                });

                // -----------------------------------------
                // Update application
                // -----------------------------------------

                professional.applicationStatus =
                    "rejected";

                professional.isVerified =
                    false;

                professional.rejectionReason =
                    normalizedReason;

                professional.reviewedBy =
                    req.userId;

                professional.reviewedAt =
                    new Date();

                await professional.save({
                    session,
                });

                rejectedProfessional =
                    professional;
            }
        );

        await rejectedProfessional.populate([
            {
                path: "user",
                select: "-password",
            },
            {
                path: "reviewedBy",
                select: "fullName email role",
            },
        ]);

        return res.status(200).json({
            success: true,
            message:
                "Professional application rejected successfully",
            professional:
                rejectedProfessional,
        });

    } catch (error) {
        console.error(
            "Reject Professional Application Error:",
            error
        );

        if (error.statusCode) {
            return res.status(
                error.statusCode
            ).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Server error",
        });

    } finally {
        await session.endSession();
    }
};
// =====================================================
// GET ADMIN DASHBOARD STATISTICS
// =====================================================

export const getAdminDashboardStats = async (
    req,
    res
) => {
    try {

        const [
            totalUsers,
            totalProfessionals,
            pendingApplications,
            approvedApplications,
            rejectedApplications,
            totalServices,
            totalBookings,
        ] = await Promise.all([

            // Total normal users
            User.countDocuments({
                role: "user",
            }),

            // Total professional users
            User.countDocuments({
                role: "professional",
            }),

            // Pending professional applications
            Professional.countDocuments({
                applicationStatus: "pending",
            }),

            // Approved professional applications
            Professional.countDocuments({
                applicationStatus: "approved",
            }),

            // Rejected professional applications
            Professional.countDocuments({
                applicationStatus: "rejected",
            }),

            // Total services
            Service.countDocuments(),

            // Total bookings
            Booking.countDocuments(),
        ]);


        return res.status(200).json({
            success: true,

            stats: {
                totalUsers,
                totalProfessionals,
                pendingApplications,
                approvedApplications,
                rejectedApplications,
                totalServices,
                totalBookings,
            },
        });

    } catch (error) {

        console.error(
            "Get Admin Dashboard Stats Error:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                "Unable to fetch dashboard statistics",
        });
    }
};