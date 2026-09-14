import mongoose from "mongoose";

import Service from "../models/Service.js";
import Professional from "../models/Professional.js";
import User from "../models/User.js";


// =====================================================
// CONSTANTS
// =====================================================

const MAX_TITLE_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 2000;
const MAX_CATEGORY_LENGTH = 100;

const MAX_ARRAY_ITEMS = 30;
const MAX_ARRAY_ITEM_LENGTH = 100;

const MAX_IMAGE_URL_LENGTH = 2048;

const DEFAULT_DURATION = 60;
const MIN_DURATION = 1;
const MAX_DURATION = 1440;

const MIN_PRICE = 0;
const MAX_PRICE = 10000000;


// =====================================================
// HELPERS
// =====================================================

const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};


// -----------------------------------------------------
// Normalize string
// -----------------------------------------------------

const normalizeString = (value) => {

    if (typeof value !== "string") {
        return "";
    }

    return value.trim();
};


// -----------------------------------------------------
// Normalize string array
// -----------------------------------------------------

const normalizeStringArray = (value) => {

    if (!Array.isArray(value)) {
        return [];
    }

    const normalized = [];

    for (const item of value) {

        if (typeof item !== "string") {
            continue;
        }

        const trimmed = item.trim();

        if (!trimmed) {
            continue;
        }

        if (trimmed.length > MAX_ARRAY_ITEM_LENGTH) {
            continue;
        }

        if (!normalized.includes(trimmed)) {
            normalized.push(trimmed);
        }

        if (normalized.length >= MAX_ARRAY_ITEMS) {
            break;
        }
    }

    return normalized;
};


// -----------------------------------------------------
// Parse finite number
// -----------------------------------------------------

const parseNumber = (value) => {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return null;
    }

    const number = Number(value);

    if (!Number.isFinite(number)) {
        return null;
    }

    return number;
};


// -----------------------------------------------------
// Parse integer
// -----------------------------------------------------

const parseInteger = (value) => {

    const number = parseNumber(value);

    if (number === null || !Number.isInteger(number)) {
        return null;
    }

    return number;
};


// -----------------------------------------------------
// Validate HTTP/HTTPS image URL
// -----------------------------------------------------

const isValidImageUrl = (value) => {

    if (!value) {
        return true;
    }

    try {

        const url = new URL(value);

        return (
            url.protocol === "http:" ||
            url.protocol === "https:"
        );

    } catch {

        return false;
    }
};


// -----------------------------------------------------
// Safe professional population
// -----------------------------------------------------
//
// IMPORTANT:
// Never expose the complete Professional document
// through a public service API.
//
// Sensitive fields such as:
// certificate
// rejectionReason
// reviewedBy
// reviewedAt
// termsAcceptedAt
// etc. are intentionally excluded.
// -----------------------------------------------------

const populateService = (query) => {

    return query.populate({
        path: "professional",

        select: [
            "profession",
            "category",
            "experience",
            "description",
            "skills",
            "serviceAreas",
            "startingCharges",
            "profileImage",
            "availability",
            "rating",
            "totalReviews",
            "totalJobs",
            "isVerified",
        ].join(" "),

        populate: {
            path: "user",

            select: [
                "fullName",
                "city",
                "state",
                "profileImage",
            ].join(" "),
        },
    });
};


// =====================================================
// FIND APPROVED PROFESSIONAL
// =====================================================

const findApprovedProfessional = async (userId) => {

    return Professional.findOne({
        user: userId,
        applicationStatus: "approved",
        isVerified: true,
    });
};


// =====================================================
// CREATE SERVICE
// POST /api/services
// Protected - Professional
// =====================================================

export const createService = async (req, res) => {

    try {

        const {
            title,
            description,
            category,
            price,
            duration,
            skills,
            serviceAreas,
            image,
        } = req.body;


        // -------------------------------------------------
        // VALIDATE TITLE
        // -------------------------------------------------

        const normalizedTitle =
            normalizeString(title);

        if (!normalizedTitle) {

            return res.status(400).json({
                success: false,
                message: "Service title is required",
            });
        }

        if (
            normalizedTitle.length >
            MAX_TITLE_LENGTH
        ) {

            return res.status(400).json({
                success: false,
                message:
                    `Service title cannot exceed ${MAX_TITLE_LENGTH} characters`,
            });
        }


        // -------------------------------------------------
        // VALIDATE CATEGORY
        // -------------------------------------------------

        const normalizedCategory =
            normalizeString(category);

        if (!normalizedCategory) {

            return res.status(400).json({
                success: false,
                message: "Service category is required",
            });
        }

        if (
            normalizedCategory.length >
            MAX_CATEGORY_LENGTH
        ) {

            return res.status(400).json({
                success: false,
                message:
                    `Service category cannot exceed ${MAX_CATEGORY_LENGTH} characters`,
            });
        }


        // -------------------------------------------------
        // VALIDATE DESCRIPTION
        // -------------------------------------------------

        const normalizedDescription =
            normalizeString(description);

        if (
            normalizedDescription.length >
            MAX_DESCRIPTION_LENGTH
        ) {

            return res.status(400).json({
                success: false,
                message:
                    `Service description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters`,
            });
        }


        // -------------------------------------------------
        // VALIDATE PRICE
        // -------------------------------------------------

        const normalizedPrice =
            parseNumber(price);

        if (normalizedPrice === null) {

            return res.status(400).json({
                success: false,
                message: "Valid service price is required",
            });
        }

        if (
            normalizedPrice < MIN_PRICE ||
            normalizedPrice > MAX_PRICE
        ) {

            return res.status(400).json({
                success: false,
                message:
                    `Service price must be between ₹${MIN_PRICE} and ₹${MAX_PRICE}`,
            });
        }


        // -------------------------------------------------
        // VALIDATE DURATION
        // -------------------------------------------------

        let normalizedDuration =
            DEFAULT_DURATION;

        if (
            duration !== undefined &&
            duration !== null &&
            duration !== ""
        ) {

            normalizedDuration =
                parseInteger(duration);

            if (
                normalizedDuration === null ||
                normalizedDuration < MIN_DURATION ||
                normalizedDuration > MAX_DURATION
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        `Service duration must be a whole number between ${MIN_DURATION} and ${MAX_DURATION} minutes`,
                });
            }
        }


        // -------------------------------------------------
        // FIND APPROVED PROFESSIONAL
        // -------------------------------------------------

        const professional =
            await findApprovedProfessional(
                req.userId
            );

        if (!professional) {

            return res.status(403).json({
                success: false,
                message:
                    "Only approved and verified professionals can create services",
            });
        }


        // -------------------------------------------------
        // NORMALIZE ARRAYS
        // -------------------------------------------------

        const normalizedSkills =
            normalizeStringArray(skills);

        const normalizedServiceAreas =
            normalizeStringArray(serviceAreas);


        // -------------------------------------------------
        // VALIDATE IMAGE
        // -------------------------------------------------

        const normalizedImage =
            normalizeString(image);

        if (
            normalizedImage.length >
            MAX_IMAGE_URL_LENGTH
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Service image URL is too long",
            });
        }

        if (
            normalizedImage &&
            !isValidImageUrl(normalizedImage)
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Service image must be a valid HTTP or HTTPS URL",
            });
        }


        // -------------------------------------------------
        // CREATE SERVICE
        // -------------------------------------------------

        const service =
            await Service.create({

                professional:
                    professional._id,

                title:
                    normalizedTitle,

                description:
                    normalizedDescription,

                category:
                    normalizedCategory,

                price:
                    normalizedPrice,

                duration:
                    normalizedDuration,

                skills:
                    normalizedSkills,

                serviceAreas:
                    normalizedServiceAreas,

                image:
                    normalizedImage,

                isActive:
                    true,

                // rating and totalReviews are intentionally
                // controlled by the review system.
            });


        // -------------------------------------------------
        // POPULATE RESPONSE
        // -------------------------------------------------

        const populatedService =
            await populateService(
                Service.findById(
                    service._id
                )
            );


        return res.status(201).json({

            success: true,

            message:
                "Service created successfully",

            service:
                populatedService,

        });

    } catch (error) {

        console.error(
            "Create Service Error:",
            error
        );


        if (
            error?.name ===
            "ValidationError"
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid service data",
            });
        }


        return res.status(500).json({
            success: false,
            message:
                "Unable to create service",
        });
    }
};


// =====================================================
// GET ALL ACTIVE SERVICES
// GET /api/services
// Public
// =====================================================

export const getAllServices = async (
    req,
    res
) => {

    try {

        const services =
            await populateService(
                Service.find({
                    isActive: true,
                })
                    .sort({
                        createdAt: -1,
                    })
            );


        return res.status(200).json({

            success: true,

            count:
                services.length,

            services,

        });

    } catch (error) {

        console.error(
            "Get All Services Error:",
            error
        );


        return res.status(500).json({
            success: false,
            message:
                "Unable to fetch services",
        });
    }
};


// =====================================================
// GET SINGLE SERVICE
// GET /api/services/:id
// Public
// =====================================================

export const getServiceById = async (
    req,
    res
) => {

    try {

        const { id } =
            req.params;


        // -------------------------------------------------
        // VALIDATE OBJECT ID
        // -------------------------------------------------

        if (!isValidObjectId(id)) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid service ID",
            });
        }


        // -------------------------------------------------
        // FIND ACTIVE SERVICE
        // -------------------------------------------------

        const service =
            await populateService(
                Service.findOne({
                    _id: id,
                    isActive: true,
                })
            );


        if (!service) {

            return res.status(404).json({
                success: false,
                message:
                    "Service not found or unavailable",
            });
        }


        return res.status(200).json({

            success: true,

            service,

        });

    } catch (error) {

        console.error(
            "Get Service By ID Error:",
            error
        );


        return res.status(500).json({
            success: false,
            message:
                "Unable to fetch service",
        });
    }
};


// =====================================================
// GET LOGGED-IN PROFESSIONAL SERVICES
// GET /api/services/my
// Protected - Professional
// =====================================================

export const getMyServices = async (
    req,
    res
) => {

    try {

        const professional =
            await findApprovedProfessional(
                req.userId
            );


        if (!professional) {

            return res.status(403).json({
                success: false,
                message:
                    "Approved professional profile not found",
            });
        }


        const services =
            await populateService(
                Service.find({
                    professional:
                        professional._id,
                })
                    .sort({
                        createdAt: -1,
                    })
            );


        return res.status(200).json({

            success: true,

            count:
                services.length,

            services,

        });

    } catch (error) {

        console.error(
            "Get My Services Error:",
            error
        );


        return res.status(500).json({
            success: false,
            message:
                "Unable to fetch your services",
        });
    }
};


// =====================================================
// UPDATE SERVICE
// PUT /api/services/:id
// Protected - Professional
// =====================================================

export const updateService = async (
    req,
    res
) => {

    try {

        const { id } =
            req.params;


        // -------------------------------------------------
        // VALIDATE OBJECT ID
        // -------------------------------------------------

        if (!isValidObjectId(id)) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid service ID",
            });
        }


        // -------------------------------------------------
        // FIND APPROVED PROFESSIONAL
        // -------------------------------------------------

        const professional =
            await findApprovedProfessional(
                req.userId
            );


        if (!professional) {

            return res.status(403).json({
                success: false,
                message:
                    "Approved professional profile not found",
            });
        }


        // -------------------------------------------------
        // FIND OWN SERVICE
        // -------------------------------------------------

        const service =
            await Service.findOne({
                _id: id,
                professional:
                    professional._id,
            });


        if (!service) {

            return res.status(404).json({
                success: false,
                message:
                    "Service not found",
            });
        }


        // -------------------------------------------------
        // PREVENT UPDATING DELETED SERVICE
        // -------------------------------------------------

        if (!service.isActive) {

            return res.status(409).json({
                success: false,
                message:
                    "Inactive service cannot be updated",
            });
        }


        // -------------------------------------------------
        // TITLE
        // -------------------------------------------------

        if (
            req.body.title !== undefined
        ) {

            const title =
                normalizeString(
                    req.body.title
                );


            if (!title) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Service title cannot be empty",
                });
            }


            if (
                title.length >
                MAX_TITLE_LENGTH
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        `Service title cannot exceed ${MAX_TITLE_LENGTH} characters`,
                });
            }


            service.title =
                title;
        }


        // -------------------------------------------------
        // DESCRIPTION
        // -------------------------------------------------

        if (
            req.body.description !==
            undefined
        ) {

            const description =
                normalizeString(
                    req.body.description
                );


            if (
                description.length >
                MAX_DESCRIPTION_LENGTH
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        `Service description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters`,
                });
            }


            service.description =
                description;
        }


        // -------------------------------------------------
        // CATEGORY
        // -------------------------------------------------

        if (
            req.body.category !==
            undefined
        ) {

            const category =
                normalizeString(
                    req.body.category
                );


            if (!category) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Service category cannot be empty",
                });
            }


            if (
                category.length >
                MAX_CATEGORY_LENGTH
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        `Service category cannot exceed ${MAX_CATEGORY_LENGTH} characters`,
                });
            }


            service.category =
                category;
        }


        // -------------------------------------------------
        // PRICE
        // -------------------------------------------------

        if (
            req.body.price !==
            undefined
        ) {

            const price =
                parseNumber(
                    req.body.price
                );


            if (
                price === null ||
                price < MIN_PRICE ||
                price > MAX_PRICE
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        `Service price must be between ₹${MIN_PRICE} and ₹${MAX_PRICE}`,
                });
            }


            service.price =
                price;
        }


        // -------------------------------------------------
        // DURATION
        // -------------------------------------------------

        if (
            req.body.duration !==
            undefined
        ) {

            const duration =
                parseInteger(
                    req.body.duration
                );


            if (
                duration === null ||
                duration < MIN_DURATION ||
                duration > MAX_DURATION
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        `Service duration must be a whole number between ${MIN_DURATION} and ${MAX_DURATION} minutes`,
                });
            }


            service.duration =
                duration;
        }


        // -------------------------------------------------
        // SKILLS
        // -------------------------------------------------

        if (
            req.body.skills !==
            undefined
        ) {

            if (
                !Array.isArray(
                    req.body.skills
                )
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Skills must be an array",
                });
            }


            service.skills =
                normalizeStringArray(
                    req.body.skills
                );
        }


        // -------------------------------------------------
        // SERVICE AREAS
        // -------------------------------------------------

        if (
            req.body.serviceAreas !==
            undefined
        ) {

            if (
                !Array.isArray(
                    req.body.serviceAreas
                )
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Service areas must be an array",
                });
            }


            service.serviceAreas =
                normalizeStringArray(
                    req.body.serviceAreas
                );
        }


        // -------------------------------------------------
        // IMAGE
        // -------------------------------------------------

        if (
            req.body.image !==
            undefined
        ) {

            const image =
                normalizeString(
                    req.body.image
                );


            if (
                image.length >
                MAX_IMAGE_URL_LENGTH
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Service image URL is too long",
                });
            }


            if (
                image &&
                !isValidImageUrl(image)
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Service image must be a valid HTTP or HTTPS URL",
                });
            }


            service.image =
                image;
        }


        // -------------------------------------------------
        // IMPORTANT SECURITY RULE
        // -------------------------------------------------
        //
        // These fields are intentionally NOT updated:
        //
        // professional
        // rating
        // totalReviews
        // isActive
        //
        // Status changes are handled by the dedicated
        // toggleServiceStatus endpoint.
        // -------------------------------------------------


        // -------------------------------------------------
        // SAVE
        // -------------------------------------------------

        await service.save();


        // -------------------------------------------------
        // RETURN UPDATED SERVICE
        // -------------------------------------------------

        const updatedService =
            await populateService(
                Service.findById(
                    service._id
                )
            );


        return res.status(200).json({

            success: true,

            message:
                "Service updated successfully",

            service:
                updatedService,

        });

    } catch (error) {

        console.error(
            "Update Service Error:",
            error
        );


        if (
            error?.name ===
            "ValidationError"
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid service data",
            });
        }


        return res.status(500).json({
            success: false,
            message:
                "Unable to update service",
        });
    }
};


// =====================================================
// TOGGLE SERVICE STATUS
// PATCH /api/services/:id/status
// Protected - Professional
// =====================================================
//
// This endpoint is intentionally separate from the
// generic service update endpoint.
//
// It allows only the service owner to activate/deactivate
// their service.
// =====================================================

export const toggleServiceStatus = async (
    req,
    res
) => {

    try {

        const { id } =
            req.params;

        const { isActive } =
            req.body;


        // -------------------------------------------------
        // VALIDATE SERVICE ID
        // -------------------------------------------------

        if (!isValidObjectId(id)) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid service ID",
            });
        }


        // -------------------------------------------------
        // VALIDATE STATUS
        // -------------------------------------------------

        if (
            typeof isActive !==
            "boolean"
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "isActive must be a boolean",
            });
        }


        // -------------------------------------------------
        // FIND APPROVED PROFESSIONAL
        // -------------------------------------------------

        const professional =
            await findApprovedProfessional(
                req.userId
            );


        if (!professional) {

            return res.status(403).json({
                success: false,
                message:
                    "Approved professional profile not found",
            });
        }


        // -------------------------------------------------
        // FIND OWN SERVICE
        // -------------------------------------------------

        const service =
            await Service.findOne({
                _id: id,
                professional:
                    professional._id,
            });


        if (!service) {

            return res.status(404).json({
                success: false,
                message:
                    "Service not found",
            });
        }


        // -------------------------------------------------
        // UPDATE STATUS
        // -------------------------------------------------

        service.isActive =
            isActive;


        await service.save();


        // -------------------------------------------------
        // RETURN UPDATED SERVICE
        // -------------------------------------------------

        const updatedService =
            await populateService(
                Service.findById(
                    service._id
                )
            );


        return res.status(200).json({

            success: true,

            message:
                isActive
                    ? "Service activated successfully"
                    : "Service deactivated successfully",

            service:
                updatedService,

        });

    } catch (error) {

        console.error(
            "Toggle Service Status Error:",
            error
        );


        if (
            error?.name ===
            "ValidationError"
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid service data",
            });
        }


        return res.status(500).json({
            success: false,
            message:
                "Unable to update service status",
        });
    }
};


// =====================================================
// DELETE SERVICE
// DELETE /api/services/:id
// Protected - Professional
// =====================================================
//
// Production decision:
// SOFT DELETE is used.
//
// The Service document remains in MongoDB so historical
// booking references are not broken.
// =====================================================

export const deleteService = async (
    req,
    res
) => {

    try {

        const { id } =
            req.params;


        // -------------------------------------------------
        // VALIDATE OBJECT ID
        // -------------------------------------------------

        if (!isValidObjectId(id)) {

            return res.status(400).json({
                success: false,
                message:
                    "Invalid service ID",
            });
        }


        // -------------------------------------------------
        // FIND APPROVED PROFESSIONAL
        // -------------------------------------------------

        const professional =
            await findApprovedProfessional(
                req.userId
            );


        if (!professional) {

            return res.status(403).json({
                success: false,
                message:
                    "Approved professional profile not found",
            });
        }


        // -------------------------------------------------
        // FIND OWN SERVICE
        // -------------------------------------------------

        const service =
            await Service.findOne({
                _id: id,
                professional:
                    professional._id,
            });


        if (!service) {

            return res.status(404).json({
                success: false,
                message:
                    "Service not found",
            });
        }


        // -------------------------------------------------
        // ALREADY INACTIVE
        // -------------------------------------------------

        if (!service.isActive) {

            return res.status(409).json({
                success: false,
                message:
                    "Service is already inactive",
            });
        }


        // -------------------------------------------------
        // SOFT DELETE
        // -------------------------------------------------

        service.isActive =
            false;


        await service.save();


        // -------------------------------------------------
        // REMOVE SERVICE FROM ALL WISHLISTS
        // -------------------------------------------------

        await User.updateMany(
            {
                wishlist:
                    service._id,
            },
            {
                $pull: {
                    wishlist:
                        service._id,
                },
            }
        );


        return res.status(200).json({

            success: true,

            message:
                "Service deleted successfully",

        });

    } catch (error) {

        console.error(
            "Delete Service Error:",
            error
        );


        return res.status(500).json({
            success: false,
            message:
                "Unable to delete service",
        });
    }
};