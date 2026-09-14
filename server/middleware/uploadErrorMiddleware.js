import multer from "multer";

const uploadErrorMiddleware = (
    error,
    req,
    res,
    next
) => {

    // Print complete error in backend terminal
    console.error(
        "UPLOAD ERROR:",
        error
    );


    // Multer specific errors
    if (error instanceof multer.MulterError) {

        if (error.code === "LIMIT_FILE_SIZE") {

            return res.status(400).json({
                success: false,
                message:
                    "File size must not exceed 5MB",
            });

        }


        return res.status(400).json({
            success: false,
            message:
                error.message ||
                "File upload failed",
        });

    }


    // Other errors (Cloudinary, fileFilter, etc.)
    if (error) {

        return res.status(400).json({

            success: false,

            message:
                error.message ||
                "File upload failed",

        });

    }


    next();

};


export default uploadErrorMiddleware;