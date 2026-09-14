import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";


// Load environment variables
dotenv.config();


// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


// Validate Cloudinary configuration
if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    !process.env.CLOUDINARY_API_KEY ||
    !process.env.CLOUDINARY_API_SECRET
) {
    console.error(
        "❌ Cloudinary environment variables are missing"
    );
} else {
    console.log(
        "✅ Cloudinary configuration loaded"
    );
}


export default cloudinary;