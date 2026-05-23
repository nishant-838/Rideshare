import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

// 1. Configure Cloudinary Credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Safety check: Log out if env variables are failing to load
if (!process.env.CLOUDINARY_CLOUD_NAME) {
  console.error("❌ CLOUDINARY ERROR: Environment variables are missing!");
}

// 2. Define the Cloudinary Storage Engine for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: "rideshare_uploads",
      // 🔥 FIX: Tells Cloudinary to automatically detect if it's an image, pdf, or raw file
      resource_type: "auto", 
      public_id: `${file.fieldname}-${Date.now()}`,
    };
  },
});

// 3. Initialize Multer instance with Cloudinary storage
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB Limit per file
});

export default upload;