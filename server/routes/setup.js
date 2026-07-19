import express from 'express';
import { fetch_profile, create_profile, update_profile } from '../controllers/setupcontroller.js';

const router = express.Router();

// The upload.single() middleware has been removed from these routes
router.post('/create_profile', create_profile);

router.patch('/update_profile', update_profile);

router.post('/profile/details', fetch_profile);

export default router;