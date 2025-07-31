import express from 'express'
import multer from 'multer';
import path from 'path'
import { fetch_profile, create_profile, update_profile } from '../controllers/setupcontroller.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },

    filename: (req, file, cb) => {
        const name = Date.now() + req.id;
        cb(null, name + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage });

const router = express.Router();

router.post('/create_profile', upload.single('profile_image'), create_profile);

router.patch('/update_profile', upload.single('profile_image'), update_profile);

router.post('/profile/details', fetch_profile)

export default router;