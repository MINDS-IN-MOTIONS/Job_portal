import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
});

// Provide a safe uploader wrapper so upload failures (invalid API key, network issues)
// don't throw unhandled errors and crash or spam logs. It returns an object with
// secure_url set to empty string on failure so existing controllers can continue.
const safeUploader = {
    upload: async (content, options) => {
        try {
            return await cloudinary.uploader.upload(content, options);
        } catch (err) {
            console.error('Cloudinary upload failed:', err && err.message ? err.message : err);
            // Return a benign object so existing code that reads `.secure_url` won't throw
            return { secure_url: '' };
        }
    }
};

const safeCloudinary = {
    ...cloudinary,
    uploader: safeUploader
};

export default safeCloudinary;