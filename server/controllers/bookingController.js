import mongoose from "mongoose";

import Booking from "../models/Booking.js";
import Service from "../models/Service.js";
import Professional from "../models/Professional.js";
import Notification from "../models/Notification.js";


// =====================================================
// NORMALIZE BOOKING TIME
// Converts 12-hour and 24-hour input to HH:mm
// =====================================================

const normalizeBookingTime = (value) => {
    if (typeof value !== "string") {
        return "";
    }

    const time = value.trim();

    // 24-hour format: HH:mm
    const twentyFourHourMatch =
        time.match(/^([01]\d|2[0-3]):([0-5]\d)$/);

    if (twentyFourHourMatch) {
        return time;
    }

    // 12-hour format: h:mm AM/PM
    const twelveHourMatch =
        time.match(
            /^(0?[1-9]|1[0-2]):([0-5]\d)\s?(AM|PM)$/i
        );

    if (!twelveHourMatch) {
        return "";
    }

    let hours =
        Number(twelveHourMatch[1]);

    const minutes =
        twelveHourMatch[2];

    const period =
        twelveHourMatch[3].toUpperCase();

    if (
        period === "AM" &&
        hours === 12
    ) {
        hours = 0;
    }

    if (
        period === "PM" &&
        hours !== 12
    ) {
        hours += 12;
    }

    return `${String(hours).padStart(2, "0")}:${minutes}`;
};


// =====================================================
// VALIDATE BOOKING DATE + TIME
// Prevents past dates and past times
// =====================================================

const validateBookingDateTime = (
    bookingDate,
    bookingTime
) => {
    const parsedBookingDate =
        new Date(bookingDate);

    if (
        Number.isNaN(
            parsedBookingDate.getTime()
        )
    ) {
        return {
            valid: false,
            message:
                "Invalid booking date",
        };
    }

    const normalizedBookingTime =
        normalizeBookingTime(bookingTime);

    if (!normalizedBookingTime) {
        return {
            valid: false,
            message:
                "Invalid booking time. Use HH:mm or h:mm AM/PM format.",
        };
    }

    const [
        hours,
        minutes,
    ] = normalizedBookingTime
        .split(":")
        .map(Number);

    parsedBookingDate.setHours(
        hours,
        minutes,
        0,
        0
    );

    const now =
        new Date();

    if (
        parsedBookingDate <= now
    ) {
        return {
            valid: false,
            message:
                "Booking date and time must be in the future",
        };
    }

    return {
        valid: true,
        parsedBookingDate,
        normalizedBookingTime,
    };
};


// =====================================================
// GENERATE ACTIVE BOOKING SLOT KEY
// One professional cannot have two active bookings
// for the same date and time.
// =====================================================

const generateActiveSlotKey = (
    professionalId,
    bookingDate,
    bookingTime
) => {
    const datePart =
        bookingDate
            .toISOString()
            .split("T")[0];

    return `${professionalId}_${datePart}_${bookingTime}`;
};


// =====================================================
// CREATE BOOKING
// POST /api/bookings
// Protected - User
// =====================================================

export const createBooking = async (
    req,
    res
) => {
    try {

        const {
            service,
            bookingDate,
            bookingTime,
            address,
            city,
            phone,
            notes,
        } = req.body;


        // =================================================
        // VALIDATE REQUIRED FIELDS
        // =================================================

        if (
            !service ||
            !bookingDate ||
            !bookingTime ||
            !address ||
            !phone
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please fill all required booking details",
            });
        }


        // =================================================
        // VALIDATE SERVICE ID
        // =================================================

        if (
            !mongoose.Types.ObjectId.isValid(
                service
            )
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid service ID",
            });
        }


        // =================================================
        // NORMALIZE INPUT
        // =================================================

        const normalizedAddress =
            typeof address === "string"
                ? address.trim()
                : "";

        const normalizedPhone =
            typeof phone === "string"
                ? phone.trim()
                : "";

        const normalizedCity =
            typeof city === "string"
                ? city.trim()
                : "";

        const normalizedNotes =
            typeof notes === "string"
                ? notes.trim()
                : "";


        if (
            !normalizedAddress ||
            !normalizedPhone
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Please fill all required booking details",
            });
        }


        // =================================================
        // VALIDATE DATE + TIME
        // =================================================

        const dateTimeValidation =
            validateBookingDateTime(
                bookingDate,
                bookingTime
            );


        if (
            !dateTimeValidation.valid
        ) {
            return res.status(400).json({
                success: false,
                message:
                    dateTimeValidation.message,
            });
        }


        const parsedBookingDate =
            dateTimeValidation.parsedBookingDate;

        const normalizedBookingTime =
            dateTimeValidation.normalizedBookingTime;


        // =================================================
        // FIND ACTIVE SERVICE
        // =================================================

        const serviceDocument =
            await Service.findOne({
                _id: service,
                isActive: true,
            });


        if (!serviceDocument) {
            return res.status(404).json({
                success: false,
                message:
                    "Service not found or unavailable",
            });
        }


        // =================================================
        // VERIFY PROFESSIONAL
        // =================================================

        const professional =
            await Professional.findOne({
                _id:
                    serviceDocument.professional,

                applicationStatus:
                    "approved",

                isVerified:
                    true,
            });


        if (!professional) {
            return res.status(404).json({
                success: false,
                message:
                    "Professional profile not found or unavailable",
            });
        }


        // =================================================
        // GENERATE ACTIVE SLOT KEY
        // =================================================

        const activeSlotKey =
            generateActiveSlotKey(
                professional._id,
                parsedBookingDate,
                normalizedBookingTime
            );


        // =================================================
        // CHECK EXISTING BOOKING
        // =================================================

        const existingBooking =
            await Booking.findOne({
                professional:
                    professional._id,

                bookingDate:
                    parsedBookingDate,

                bookingTime:
                    normalizedBookingTime,

                status: {
                    $ne: "cancelled",
                },
            }).select("_id");


        if (existingBooking) {
            return res.status(409).json({
                success: false,
                message:
                    "This time slot is already booked. Please choose another time.",
            });
        }


        // =================================================
        // CREATE BOOKING
        // =================================================

        const booking =
            await Booking.create({

                user:
                    req.userId,

                service:
                    serviceDocument._id,

                professional:
                    professional._id,

                serviceTitle:
                    serviceDocument.title,

                bookingDate:
                    parsedBookingDate,

                bookingTime:
                    normalizedBookingTime,

                activeSlotKey:
                    activeSlotKey,

                address:
                    normalizedAddress,

                city:
                    normalizedCity,

                phone:
                    normalizedPhone,

                notes:
                    normalizedNotes,

                price:
                    serviceDocument.price,

                status:
                    "pending",

                paymentStatus:
                    "pending",
            });


        // =================================================
        // POPULATE BOOKING
        // =================================================

        const populatedBooking =
            await Booking.findById(
                booking._id
            )
                .populate({
                    path:
                        "service",
                    select:
                        "title category price duration image",
                })
                .populate({
                    path:
                        "professional",
                    populate: {
                        path:
                            "user",
                        select:
                            "fullName email phone city state profileImage",
                    },
                });


        // =================================================
        // NOTIFICATIONS
        // =================================================

        try {

            await Notification.create({
                user:
                    req.userId,

                title:
                    "Booking Created",

                message:
                    `${serviceDocument.title} booking created successfully.`,

                type:
                    "booking",
            });


            if (
                professional.user
            ) {

                await Notification.create({
                    user:
                        professional.user,

                    title:
                        "New Booking",

                    message:
                        `You received a new booking for ${serviceDocument.title}.`,

                    type:
                        "booking",
                });
            }

        } catch (notificationError) {

            console.error(
                "Booking Notification Error:",
                notificationError
            );
        }


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(201).json({
            success:
                true,

            message:
                "Booking created successfully",

            booking:
                populatedBooking,
        });

    } catch (error) {

        console.error(
            "Create Booking Error:",
            error
        );


        if (
            error?.code === 11000
        ) {
            return res.status(409).json({
                success: false,
                message:
                    "This time slot is already booked. Please choose another time.",
            });
        }


        if (
            error?.name ===
            "ValidationError"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid booking details",
            });
        }


        return res.status(500).json({
            success: false,
            message:
                "Server error",
        });
    }
};


// =====================================================
// GET MY BOOKINGS
// GET /api/bookings
// Protected - User
// =====================================================

export const getMyBookings = async (
    req,
    res
) => {
    try {

        const bookings =
            await Booking.find({
                user:
                    req.userId,
            })
                .populate({
                    path:
                        "service",
                    select:
                        "title category price duration image",
                })
                .populate({
                    path:
                        "professional",
                    populate: {
                        path:
                            "user",
                        select:
                            "fullName email phone city state profileImage",
                    },
                })
                .sort({
                    createdAt:
                        -1,
                });


        res.set(
            "Cache-Control",
            "no-store"
        );


        return res.status(200).json({
            success:
                true,

            count:
                bookings.length,

            bookings,
        });

    } catch (error) {

        console.error(
            "Get Bookings Error:",
            error
        );

        return res.status(500).json({
            success:
                false,

            message:
                "Server error",
        });
    }
};


// =====================================================
// GET BOOKING STATS
// GET /api/bookings/stats
// Protected - User
// =====================================================

export const getBookingStats = async (
    req,
    res
) => {
    try {

        const bookings =
            await Booking.find({
                user:
                    req.userId,
            })
                .select("status")
                .lean();


        const total =
            bookings.length;


        const completed =
            bookings.filter(
                (booking) =>
                    booking.status ===
                    "completed"
            ).length;


        const pending =
            bookings.filter(
                (booking) =>
                    booking.status ===
                    "pending" ||
                    booking.status ===
                    "confirmed"
            ).length;


        return res.status(200).json({
            success:
                true,

            stats: {
                total,
                completed,
                pending,
            },
        });

    } catch (error) {

        console.error(
            "Get Booking Stats Error:",
            error
        );

        return res.status(500).json({
            success:
                false,

            message:
                "Server error",
        });
    }
};


// =====================================================
// GET PROFESSIONAL BOOKING STATS
// GET /api/bookings/professional/stats
// Protected - Professional
// =====================================================

export const getProfessionalBookingStats = async (
    req,
    res
) => {
    try {

        const professional =
            await Professional.findOne({
                user:
                    req.userId,

                applicationStatus:
                    "approved",

                isVerified:
                    true,
            }).select("_id");


        if (!professional) {
            return res.status(404).json({
                success:
                    false,

                message:
                    "Professional profile not found",
            });
        }


        const bookings =
            await Booking.find({
                professional:
                    professional._id,
            })
                .select("status")
                .lean();


        const total =
            bookings.length;

        const pending =
            bookings.filter(
                (booking) =>
                    booking.status ===
                    "pending"
            ).length;

        const confirmed =
            bookings.filter(
                (booking) =>
                    booking.status ===
                    "confirmed"
            ).length;

        const completed =
            bookings.filter(
                (booking) =>
                    booking.status ===
                    "completed"
            ).length;

        const cancelled =
            bookings.filter(
                (booking) =>
                    booking.status ===
                    "cancelled"
            ).length;


        return res.status(200).json({
            success:
                true,

            stats: {
                total,
                pending,
                confirmed,
                completed,
                cancelled,
            },
        });

    } catch (error) {

        console.error(
            "Get Professional Booking Stats Error:",
            error
        );

        return res.status(500).json({
            success:
                false,

            message:
                "Server error",
        });
    }
};


// =====================================================
// CANCEL BOOKING
// PUT /api/bookings/:id/cancel
// Protected - User
// =====================================================

export const cancelBooking = async (
    req,
    res
) => {
    try {

        const { id } =
            req.params;


        // =================================================
        // VALIDATE BOOKING ID
        // =================================================

        if (
            !mongoose.Types.ObjectId.isValid(
                id
            )
        ) {
            return res.status(400).json({
                success:
                    false,

                message:
                    "Invalid booking ID",
            });
        }


        // =================================================
        // FIND USER BOOKING
        // =================================================

        const booking =
            await Booking.findOne({
                _id:
                    id,

                user:
                    req.userId,
            });


        if (!booking) {
            return res.status(404).json({
                success:
                    false,

                message:
                    "Booking not found",
            });
        }


        // =================================================
        // STATUS VALIDATION
        // =================================================

        if (
            booking.status ===
            "completed"
        ) {
            return res.status(400).json({
                success:
                    false,

                message:
                    "Completed booking cannot be cancelled",
            });
        }


        if (
            booking.status ===
            "cancelled"
        ) {
            return res.status(400).json({
                success:
                    false,

                message:
                    "Booking is already cancelled",
            });
        }


        // =================================================
        // CANCEL BOOKING
        // =================================================

        booking.status =
            "cancelled";

        // Release the professional's slot.
        booking.activeSlotKey =
            null;


        await booking.save();


        // =================================================
        // NOTIFICATIONS
        // =================================================

        try {

            await Notification.create({
                user:
                    req.userId,

                title:
                    "Booking Cancelled",

                message:
                    `${booking.serviceTitle} booking has been cancelled.`,

                type:
                    "booking",
            });


            if (
                booking.professional
            ) {

                const professional =
                    await Professional.findById(
                        booking.professional
                    ).select("user");


                if (
                    professional?.user
                ) {

                    await Notification.create({
                        user:
                            professional.user,

                        title:
                            "Booking Cancelled",

                        message:
                            `${booking.serviceTitle} booking has been cancelled by the customer.`,

                        type:
                            "booking",
                    });
                }
            }

        } catch (notificationError) {

            console.error(
                "Cancellation Notification Error:",
                notificationError
            );
        }


        return res.status(200).json({
            success:
                true,

            message:
                "Booking cancelled successfully",

            booking,
        });

    } catch (error) {

        console.error(
            "Cancel Booking Error:",
            error
        );


        if (
            error?.code === 11000
        ) {
            return res.status(409).json({
                success: false,
                message:
                    "This time slot is already booked. Please choose another time.",
            });
        }


        return res.status(500).json({
            success:
                false,

            message:
                "Server error",
        });
    }
};


// =====================================================
// RESCHEDULE BOOKING
// PUT /api/bookings/:id/reschedule
// Protected - User
// =====================================================

export const rescheduleBooking = async (
    req,
    res
) => {
    try {

        const {
            bookingDate,
            bookingTime,
        } = req.body;


        // =================================================
        // VALIDATE REQUIRED FIELDS
        // =================================================

        if (
            !bookingDate ||
            !bookingTime
        ) {
            return res.status(400).json({
                success:
                    false,

                message:
                    "Booking date and time are required",
            });
        }


        // =================================================
        // VALIDATE BOOKING ID
        // =================================================

        if (
            !mongoose.Types.ObjectId.isValid(
                req.params.id
            )
        ) {
            return res.status(400).json({
                success:
                    false,

                message:
                    "Invalid booking ID",
            });
        }


        // =================================================
        // FIND BOOKING
        // =================================================

        const booking =
            await Booking.findOne({
                _id:
                    req.params.id,

                user:
                    req.userId,
            });


        if (!booking) {
            return res.status(404).json({
                success:
                    false,

                message:
                    "Booking not found",
            });
        }


        // =================================================
        // STATUS VALIDATION
        // =================================================

        if (
            booking.status ===
            "completed"
        ) {
            return res.status(400).json({
                success:
                    false,

                message:
                    "Completed booking cannot be rescheduled",
            });
        }


        if (
            booking.status ===
            "cancelled"
        ) {
            return res.status(400).json({
                success:
                    false,

                message:
                    "Cancelled booking cannot be rescheduled",
            });
        }


        // =================================================
        // VALIDATE DATE + TIME
        // =================================================

        const dateTimeValidation =
            validateBookingDateTime(
                bookingDate,
                bookingTime
            );


        if (
            !dateTimeValidation.valid
        ) {
            return res.status(400).json({
                success:
                    false,

                message:
                    dateTimeValidation.message,
            });
        }


        const parsedBookingDate =
            dateTimeValidation.parsedBookingDate;

        const normalizedBookingTime =
            dateTimeValidation.normalizedBookingTime;


        // =================================================
        // GENERATE NEW ACTIVE SLOT KEY
        // =================================================

        const newActiveSlotKey =
            generateActiveSlotKey(
                booking.professional,
                parsedBookingDate,
                normalizedBookingTime
            );


        // =================================================
        // CHECK EXISTING BOOKING
        // =================================================

        const existingBooking =
            await Booking.findOne({
                activeSlotKey:
                    newActiveSlotKey,

                _id: {
                    $ne:
                        booking._id,
                },
            }).select("_id");


        if (
            existingBooking
        ) {
            return res.status(409).json({
                success:
                    false,

                message:
                    "This time slot is already booked. Please choose another time.",
            });
        }


        // =================================================
        // UPDATE BOOKING
        // =================================================

        booking.bookingDate =
            parsedBookingDate;

        booking.bookingTime =
            normalizedBookingTime;

        booking.activeSlotKey =
            newActiveSlotKey;

        // Rescheduled booking requires
        // professional confirmation again.
        booking.status =
            "pending";


        await booking.save();


        // =================================================
        // NOTIFICATIONS
        // =================================================

        try {

            await Notification.create({
                user:
                    req.userId,

                title:
                    "Booking Rescheduled",

                message:
                    `${booking.serviceTitle} booking has been rescheduled successfully.`,

                type:
                    "booking",
            });


            if (
                booking.professional
            ) {

                const professional =
                    await Professional.findById(
                        booking.professional
                    ).select("user");


                if (
                    professional?.user
                ) {

                    await Notification.create({
                        user:
                            professional.user,

                        title:
                            "Booking Rescheduled",

                        message:
                            `${booking.serviceTitle} booking has been rescheduled by the customer.`,

                        type:
                            "booking",
                    });
                }
            }

        } catch (notificationError) {

            console.error(
                "Reschedule Notification Error:",
                notificationError
            );
        }


        return res.status(200).json({
            success:
                true,

            message:
                "Booking rescheduled successfully",

            booking,
        });

    } catch (error) {

        console.error(
            "Reschedule Booking Error:",
            error
        );


        if (
            error?.code === 11000
        ) {
            return res.status(409).json({
                success: false,
                message:
                    "This time slot is already booked. Please choose another time.",
            });
        }


        if (
            error?.name ===
            "ValidationError"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid booking details",
            });
        }


        return res.status(500).json({
            success: false,
            message:
                "Server error",
        });
    }
};


// =====================================================
// GET PROFESSIONAL BOOKINGS
// GET /api/bookings/professional
// Protected - Professional
// =====================================================

export const getProfessionalBookings = async (
    req,
    res
) => {
    try {

        const professional =
            await Professional.findOne({
                user:
                    req.userId,

                applicationStatus:
                    "approved",

                isVerified:
                    true,
            }).select("_id");


        if (!professional) {
            return res.status(404).json({
                success:
                    false,

                message:
                    "Professional profile not found",
            });
        }


        const bookings =
            await Booking.find({
                professional:
                    professional._id,
            })
                .populate({
                    path:
                        "user",
                    select:
                        "fullName email phone city state profileImage",
                })
                .populate({
                    path:
                        "service",
                    select:
                        "title category price duration image",
                })
                .sort({
                    bookingDate:
                        1,

                    bookingTime:
                        1,
                });


        res.set(
            "Cache-Control",
            "no-store"
        );


        return res.status(200).json({
            success:
                true,

            count:
                bookings.length,

            bookings,
        });

    } catch (error) {

        console.error(
            "Get Professional Bookings Error:",
            error
        );

        return res.status(500).json({
            success:
                false,

            message:
                "Server error",
        });
    }
};


// =====================================================
// UPDATE BOOKING STATUS
// PATCH /api/bookings/:id/status
// Protected - Professional
// =====================================================

export const updateBookingStatus = async (
    req,
    res
) => {
    try {

        const { id } =
            req.params;

        const { status } =
            req.body;


        // =================================================
        // VALIDATE BOOKING ID
        // =================================================

        if (
            !mongoose.Types.ObjectId.isValid(
                id
            )
        ) {
            return res.status(400).json({
                success:
                    false,

                message:
                    "Invalid booking ID",
            });
        }


        // =================================================
        // VALIDATE STATUS
        // =================================================

        const allowedStatuses = [
            "confirmed",
            "completed",
            "cancelled",
        ];


        if (
            typeof status !== "string" ||
            !allowedStatuses.includes(
                status.trim().toLowerCase()
            )
        ) {
            return res.status(400).json({
                success:
                    false,

                message:
                    "Invalid booking status",
            });
        }


        const normalizedStatus =
            status.trim().toLowerCase();


        // =================================================
        // FIND APPROVED + VERIFIED PROFESSIONAL
        // =================================================

        const professional =
            await Professional.findOne({
                user:
                    req.userId,

                applicationStatus:
                    "approved",

                isVerified:
                    true,
            }).select("_id");


        if (!professional) {
            return res.status(403).json({
                success:
                    false,

                message:
                    "Professional profile not found or unavailable",
            });
        }


        // =================================================
        // FIND PROFESSIONAL'S BOOKING
        // =================================================

        const booking =
            await Booking.findOne({
                _id:
                    id,

                professional:
                    professional._id,
            });


        if (!booking) {
            return res.status(404).json({
                success:
                    false,

                message:
                    "Booking not found",
            });
        }


        // =================================================
        // PREVENT SAME STATUS UPDATE
        // =================================================

        if (
            booking.status ===
            normalizedStatus
        ) {
            return res.status(400).json({
                success:
                    false,

                message:
                    `Booking is already ${normalizedStatus}`,
            });
        }


        // =================================================
        // VALIDATE STATUS TRANSITION
        // =================================================

        const validTransitions = {

            pending: [
                "confirmed",
                "cancelled",
            ],

            confirmed: [
                "completed",
                "cancelled",
            ],

            completed: [],

            cancelled: [],
        };


        const allowedNextStatuses =
            validTransitions[
            booking.status
            ] || [];


        if (
            !allowedNextStatuses.includes(
                normalizedStatus
            )
        ) {
            return res.status(400).json({
                success:
                    false,

                message:
                    `Booking cannot be changed from ${booking.status} to ${normalizedStatus}`,
            });
        }


        // =================================================
        // UPDATE STATUS
        // =================================================

        booking.status =
            normalizedStatus;


        // Release slot when professional cancels.
        if (
            normalizedStatus ===
            "cancelled"
        ) {
            booking.activeSlotKey =
                null;
        }


        await booking.save();


        // =================================================
        // CUSTOMER NOTIFICATION
        // =================================================

        try {

            let notificationTitle =
                "";

            let notificationMessage =
                "";


            if (
                normalizedStatus ===
                "confirmed"
            ) {
                notificationTitle =
                    "Booking Confirmed";

                notificationMessage =
                    `${booking.serviceTitle} booking has been confirmed by the professional.`;
            }


            if (
                normalizedStatus ===
                "completed"
            ) {
                notificationTitle =
                    "Booking Completed";

                notificationMessage =
                    `${booking.serviceTitle} booking has been marked as completed.`;
            }


            if (
                normalizedStatus ===
                "cancelled"
            ) {
                notificationTitle =
                    "Booking Cancelled";

                notificationMessage =
                    `${booking.serviceTitle} booking has been cancelled by the professional.`;
            }


            if (
                notificationTitle &&
                booking.user
            ) {

                await Notification.create({
                    user:
                        booking.user,

                    title:
                        notificationTitle,

                    message:
                        notificationMessage,

                    type:
                        "booking",
                });
            }

        } catch (notificationError) {

            console.error(
                "Booking Status Notification Error:",
                notificationError
            );
        }


        // =================================================
        // POPULATE UPDATED BOOKING
        // =================================================

        const updatedBooking =
            await Booking.findById(
                booking._id
            )
                .populate({
                    path:
                        "user",
                    select:
                        "fullName email phone city state profileImage",
                })
                .populate({
                    path:
                        "service",
                    select:
                        "title category price duration image",
                })
                .populate({
                    path:
                        "professional",
                    populate: {
                        path:
                            "user",
                        select:
                            "fullName email phone city state profileImage",
                    },
                });


        // =================================================
        // RESPONSE
        // =================================================

        return res.status(200).json({
            success:
                true,

            message:
                `Booking ${normalizedStatus} successfully`,

            booking:
                updatedBooking,
        });

    } catch (error) {

        console.error(
            "Update Booking Status Error:",
            error
        );


        if (
            error?.code === 11000
        ) {
            return res.status(409).json({
                success: false,
                message:
                    "This time slot is already booked. Please choose another time.",
            });
        }


        if (
            error?.name ===
            "ValidationError"
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Invalid booking details",
            });
        }


        return res.status(500).json({
            success: false,
            message:
                "Server error",
        });
    }
};