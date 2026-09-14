import mongoose from "mongoose";

import Professional from "../models/Professional.js";
import User from "../models/User.js";


// =====================================================
// HELPERS
// =====================================================

const isValidUserId = (userId) => {
    return (
        userId &&
        mongoose.Types.ObjectId.isValid(userId)
    );
};


const normalizeStringArray = (value) => {

    if (Array.isArray(value)) {
        return value
            .filter(
                (item) =>
                    typeof item === "string" &&
                    item.trim()
            )
            .map((item) => item.trim());
    }


    // Handle FormData values if needed
    if (typeof value === "string") {

        try {

            const parsedValue = JSON.parse(value);

            if (Array.isArray(parsedValue)) {
                return parsedValue
                    .filter(
                        (item) =>
                            typeof item === "string" &&
                            item.trim()
                    )
                    .map((item) => item.trim());
            }

        } catch {

            return value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean);
        }
    }


    return [];
};



// =====================================================
// CREATE PROFESSIONAL APPLICATION
// =====================================================

export const createProfessionalProfile = async (
    req,
    res
) => {

    try {

        const {
            profession,
            category,
            experience,
            description,
            skills,
            serviceAreas,
            startingCharges,
            termsAccepted,
        } = req.body;


        // =================================================
        // GET CLOUDINARY FILE URLS
        // =================================================

        const profileImageUrl =
            req.files?.profileImage?.[0]?.path || "";

        const certificateUrl =
            req.files?.certificate?.[0]?.path || "";



        // =================================================
        // AUTHENTICATION
        // =================================================

        if (!isValidUserId(req.userId)) {

            return res.status(401).json({
                success: false,
                message: "Invalid user authentication",
            });

        }



        // =================================================
        // FIND LOGGED-IN USER
        // =================================================

        const user = await User.findById(
            req.userId
        );


        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found",
            });

        }



        // =================================================
        // VALIDATE PROFESSION
        // =================================================

        if (
            typeof profession !== "string" ||
            !profession.trim()
        ) {

            return res.status(400).json({
                success: false,
                message: "Profession is required",
            });

        }



        // =================================================
        // VALIDATE CATEGORY
        // =================================================

        if (
            typeof category !== "string" ||
            !category.trim()
        ) {

            return res.status(400).json({
                success: false,
                message: "Service category is required",
            });

        }



        // =================================================
        // VALIDATE EXPERIENCE
        // =================================================

        if (
            experience === undefined ||
            experience === null ||
            experience === ""
        ) {

            return res.status(400).json({
                success: false,
                message: "Experience is required",
            });

        }


        const numericExperience =
            Number(experience);


        if (
            !Number.isFinite(numericExperience) ||
            numericExperience < 0
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Experience must be a valid non-negative number",
            });

        }



        // =================================================
        // VALIDATE STARTING CHARGES
        // =================================================

        if (
            startingCharges === undefined ||
            startingCharges === null ||
            startingCharges === ""
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Starting charges are required",
            });

        }


        const numericStartingCharges =
            Number(startingCharges);


        if (
            !Number.isFinite(
                numericStartingCharges
            ) ||
            numericStartingCharges < 0
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "Starting charges must be a valid non-negative number",
            });

        }



        // =================================================
        // VALIDATE TERMS
        // =================================================

        if (
            termsAccepted !== true &&
            termsAccepted !== "true"
        ) {

            return res.status(400).json({
                success: false,
                message:
                    "You must accept the Terms & Conditions",
            });

        }



        // =================================================
        // PREVENT DUPLICATE APPLICATION
        // =================================================

        const existingProfile =
            await Professional.findOne({
                user: req.userId,
            });


        if (existingProfile) {

            if (
                existingProfile.applicationStatus ===
                "pending"
            ) {

                return res.status(409).json({
                    success: false,
                    message:
                        "Your professional application is already pending",
                });

            }


            if (
                existingProfile.applicationStatus ===
                "approved"
            ) {

                return res.status(409).json({
                    success: false,
                    message:
                        "You are already an approved professional",
                });

            }


            if (
                existingProfile.applicationStatus ===
                "rejected"
            ) {

                return res.status(409).json({
                    success: false,
                    message:
                        "A previous professional application exists. Please contact support or update your application.",
                });

            }

        }



        // =================================================
        // NORMALIZE ARRAYS
        // =================================================

        const normalizedSkills =
            normalizeStringArray(skills);


        const normalizedServiceAreas =
            normalizeStringArray(
                serviceAreas
            );



        // =================================================
        // NORMALIZE DESCRIPTION
        // =================================================

        const normalizedDescription =
            typeof description === "string"
                ? description.trim()
                : "";



        // =================================================
        // CREATE PROFESSIONAL APPLICATION
        // =================================================

        const professional =
            await Professional.create({

                user: req.userId,


                profession:
                    profession.trim(),


                category:
                    category.trim(),


                experience:
                    numericExperience,


                description:
                    normalizedDescription,


                skills:
                    normalizedSkills,


                serviceAreas:
                    normalizedServiceAreas,


                startingCharges:
                    numericStartingCharges,


                // Cloudinary URLs
                profileImage:
                    profileImageUrl,


                certificate:
                    certificateUrl,


                termsAccepted:
                    true,


                termsAcceptedAt:
                    new Date(),


                applicationStatus:
                    "pending",


                isVerified:
                    false,

            });



        // =================================================
        // POPULATE USER
        // =================================================

        await professional.populate({
            path: "user",
            select: "-password",
        });



        // =================================================
        // RESPONSE
        // =================================================

        return res.status(201).json({

            success: true,

            message:
                "Professional application submitted successfully",

            professional,

        });


    } catch (error) {

        console.error(
            "Create Professional Application Error:",
            error
        );



        // =================================================
        // DUPLICATE KEY ERROR
        // =================================================

        if (error.code === 11000) {

            return res.status(409).json({

                success: false,

                message:
                    "A professional application already exists for this account",

            });

        }



        // =================================================
        // MONGOOSE VALIDATION ERROR
        // =================================================

        if (
            error.name ===
            "ValidationError"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid professional application data",

                errors:
                    Object.values(
                        error.errors
                    ).map(
                        (item) =>
                            item.message
                    ),

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
// GET MY PROFESSIONAL PROFILE / APPLICATION
// =====================================================

export const getMyProfessionalProfile = async (
    req,
    res
) => {

    try {


        // =================================================
        // AUTHENTICATION
        // =================================================

        if (!isValidUserId(req.userId)) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid user authentication",

            });

        }



        // =================================================
        // FIND PROFESSIONAL PROFILE
        // =================================================

        const professional =
            await Professional.findOne({

                user: req.userId,

            }).populate({

                path: "user",

                select: "-password",

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
            "Get Professional Profile Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Server error",

        });

    }

};



// =====================================================
// UPDATE MY PROFESSIONAL PROFILE / APPLICATION
// =====================================================

export const updateMyProfessionalProfile = async (
    req,
    res
) => {

    try {

        const {
            profession,
            category,
            experience,
            description,
            skills,
            serviceAreas,
            startingCharges,
            availability,
        } = req.body;



        // =================================================
        // AUTHENTICATION
        // =================================================

        if (!isValidUserId(req.userId)) {

            return res.status(401).json({

                success: false,

                message:
                    "Invalid user authentication",

            });

        }



        // =================================================
        // FIND PROFILE
        // =================================================

        const professional =
            await Professional.findOne({

                user: req.userId,

            });


        if (!professional) {

            return res.status(404).json({

                success: false,

                message:
                    "Professional application not found",

            });

        }



        // =================================================
        // PROFESSION
        // =================================================

        if (profession !== undefined) {

            if (
                typeof profession !== "string" ||
                !profession.trim()
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Profession must be a valid value",

                });

            }


            professional.profession =
                profession.trim();

        }



        // =================================================
        // CATEGORY
        // =================================================

        if (category !== undefined) {

            if (
                typeof category !== "string" ||
                !category.trim()
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Category must be a valid value",

                });

            }


            professional.category =
                category.trim();

        }



        // =================================================
        // EXPERIENCE
        // =================================================

        if (experience !== undefined) {

            const numericExperience =
                Number(experience);


            if (
                !Number.isFinite(
                    numericExperience
                ) ||
                numericExperience < 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Experience must be a valid non-negative number",

                });

            }


            professional.experience =
                numericExperience;

        }



        // =================================================
        // DESCRIPTION
        // =================================================

        if (description !== undefined) {

            if (
                typeof description !== "string"
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Description must be a string",

                });

            }


            professional.description =
                description.trim();

        }



        // =================================================
        // SKILLS
        // =================================================

        if (skills !== undefined) {

            professional.skills =
                normalizeStringArray(
                    skills
                );

        }



        // =================================================
        // SERVICE AREAS
        // =================================================

        if (serviceAreas !== undefined) {

            professional.serviceAreas =
                normalizeStringArray(
                    serviceAreas
                );

        }



        // =================================================
        // STARTING CHARGES
        // =================================================

        if (
            startingCharges !== undefined
        ) {

            const numericStartingCharges =
                Number(startingCharges);


            if (
                !Number.isFinite(
                    numericStartingCharges
                ) ||
                numericStartingCharges < 0
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Starting charges must be a valid non-negative number",

                });

            }


            professional.startingCharges =
                numericStartingCharges;

        }



        // =================================================
        // PROFILE IMAGE UPDATE
        // =================================================

        if (
            req.files?.profileImage?.[0]?.path
        ) {

            professional.profileImage =
                req.files
                    .profileImage[0]
                    .path;

        }



        // =================================================
        // CERTIFICATE UPDATE
        // =================================================

        if (
            req.files?.certificate?.[0]?.path
        ) {

            professional.certificate =
                req.files
                    .certificate[0]
                    .path;

        }



        // =================================================
        // AVAILABILITY
        // =================================================

        if (availability !== undefined) {

            const allowedAvailability = [

                "available",

                "busy",

                "unavailable",

            ];


            if (
                !allowedAvailability.includes(
                    availability
                )
            ) {

                return res.status(400).json({

                    success: false,

                    message:
                        "Invalid availability value",

                });

            }


            professional.availability =
                availability;

        }



        // =================================================
        // SAVE
        // =================================================

        const updatedProfessional =
            await professional.save();



        // =================================================
        // POPULATE USER
        // =================================================

        await updatedProfessional.populate({

            path: "user",

            select: "-password",

        });



        // =================================================
        // RESPONSE
        // =================================================

        return res.status(200).json({

            success: true,

            message:
                "Professional profile updated successfully",

            professional:
                updatedProfessional,

        });


    } catch (error) {

        console.error(
            "Update Professional Profile Error:",
            error
        );



        if (
            error.name ===
            "ValidationError"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Invalid professional profile data",

                errors:
                    Object.values(
                        error.errors
                    ).map(
                        (item) =>
                            item.message
                    ),

            });

        }



        return res.status(500).json({

            success: false,

            message:
                "Server error",

        });

    }

};