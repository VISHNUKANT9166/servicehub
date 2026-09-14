import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import crypto from "crypto";

import cloudinary from "../config/cloudinary.js";

// =====================================================
// CONSTANTS
// =====================================================

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const PROFILE_IMAGE_FIELDS = ["profileImage"];
const CERTIFICATE_FIELDS = ["certificate"];

const PROFILE_IMAGE_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
];

const CERTIFICATE_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "application/pdf",
];

const PROFILE_IMAGE_EXTENSIONS = [
    "jpg",
    "jpeg",
    "png",
    "webp",
];

const CERTIFICATE_EXTENSIONS = [
    "jpg",
    "jpeg",
    "png",
    "pdf",
];


// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Get file extension from original filename.
 */
const getFileExtension = (filename = "") => {

    const lastDotIndex = filename.lastIndexOf(".");

    if (lastDotIndex === -1) {
        return "";
    }

    return filename
        .substring(lastDotIndex + 1)
        .toLowerCase()
        .trim();
};


/**
 * Generate a unique Cloudinary public ID.
 *
 * Important:
 * Raw files such as PDFs should include
 * their extension in the public_id.
 */
const generateCertificatePublicId = (file) => {

    const extension = getFileExtension(file.originalname);

    const uniqueId = crypto.randomUUID();

    return extension
        ? `certificate_${uniqueId}.${extension}`
        : `certificate_${uniqueId}`;
};


// =====================================================
// CLOUDINARY STORAGE CONFIGURATION
// =====================================================

const storage = new CloudinaryStorage({

    cloudinary,

    params: async (req, file) => {

        const isProfileImage =
            PROFILE_IMAGE_FIELDS.includes(file.fieldname);


        // =================================================
        // PROFILE IMAGE
        // =================================================

        if (isProfileImage) {

            return {

                // -----------------------------------------
                // CLOUDINARY FOLDER
                // -----------------------------------------

                folder:
                    "servicehub/professionals/profile-images",


                // -----------------------------------------
                // RESOURCE TYPE
                // -----------------------------------------

                resource_type: "image",


                // -----------------------------------------
                // FILE NAME
                // -----------------------------------------

                use_filename: true,

                unique_filename: true,


                // -----------------------------------------
                // ALLOWED FORMATS
                // -----------------------------------------

                allowed_formats:
                    PROFILE_IMAGE_EXTENSIONS,


                // -----------------------------------------
                // IMAGE OPTIMIZATION
                // -----------------------------------------

                transformation: [
                    {
                        width: 500,
                        height: 500,
                        crop: "fill",
                        gravity: "face",
                    },
                ],
            };
        }


        // =================================================
        // CERTIFICATE / PROFESSIONAL DOCUMENT
        // =================================================

        if (CERTIFICATE_FIELDS.includes(file.fieldname)) {

            return {

                // -----------------------------------------
                // CLOUDINARY FOLDER
                // -----------------------------------------

                folder:
                    "servicehub/professionals/certificates",


                // -----------------------------------------
                // RESOURCE TYPE
                // -----------------------------------------

                // PDF and other documents should be stored
                // as raw resources.
                resource_type: "raw",


                // -----------------------------------------
                // ALLOWED FORMATS
                // -----------------------------------------

                allowed_formats:
                    CERTIFICATE_EXTENSIONS,


                // -----------------------------------------
                // IMPORTANT
                // -----------------------------------------

                // Raw files need the correct extension
                // in their public_id.
                public_id: generateCertificatePublicId(file),
            };
        }


        // =================================================
        // UNEXPECTED FIELD
        // =================================================

        throw new Error("Unexpected file field");
    },
});


// =====================================================
// FILE FILTER
// =====================================================

const fileFilter = (req, file, cb) => {

    // =================================================
    // PROFILE IMAGE
    // =================================================

    if (file.fieldname === "profileImage") {

        if (
            PROFILE_IMAGE_MIME_TYPES.includes(
                file.mimetype
            )
        ) {

            return cb(null, true);
        }


        return cb(
            new Error(
                "Profile image must be JPG, PNG, or WEBP"
            )
        );
    }


    // =================================================
    // CERTIFICATE
    // =================================================

    if (file.fieldname === "certificate") {

        if (
            CERTIFICATE_MIME_TYPES.includes(
                file.mimetype
            )
        ) {

            return cb(null, true);
        }


        return cb(
            new Error(
                "Certificate must be JPG, PNG, or PDF"
            )
        );
    }


    // =================================================
    // UNKNOWN FILE FIELD
    // =================================================

    return cb(
        new Error("Unexpected file field")
    );
};


// =====================================================
// MULTER CONFIGURATION
// =====================================================

const upload = multer({

    storage,

    fileFilter,

    limits: {

        // Maximum size of each uploaded file.
        fileSize: MAX_FILE_SIZE,

        // Only these two fields are expected.
        files: 2,

    },
});


// =====================================================
// PROFESSIONAL DOCUMENT UPLOAD
// =====================================================

export const uploadProfessionalDocuments =
    upload.fields([

        {
            name: "profileImage",
            maxCount: 1,
        },

        {
            name: "certificate",
            maxCount: 1,
        },

    ]);


// =====================================================
// DEFAULT EXPORT
// =====================================================

export default upload;