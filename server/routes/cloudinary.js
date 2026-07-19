
import express from 'express';

const router = express.Router();
import { v2 as cloudinary } from 'cloudinary';

// Configure this in your main server file or here
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

router.get('/sign-upload', (req, res) => {
  try {
    const timestamp = Math.round((new Date).getTime() / 1000);
    
    const signature = cloudinary.utils.api_sign_request(
      { timestamp: timestamp },
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({ timestamp, signature });
  } catch (error) {
    console.error("Signature Error:", error);
    res.status(500).json({ message: "Error generating signature" });
  }
});

export default router