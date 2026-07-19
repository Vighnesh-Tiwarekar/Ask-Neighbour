import express from 'express';
import { delete_post, fetchposts, post_status, update_post, fetchyourposts, create_post, mark_post, unmark_post } from '../controllers/servicecontroller.js';

const router = express.Router();

// multer upload middleware removed
router.post('/sendpost', create_post); 
router.patch('/updatepost', update_post);
router.patch('/post_status', post_status);
router.get('/fetchposts', fetchposts);
router.get('/fetchyourposts', fetchyourposts);
router.patch('/mark_post', mark_post);
router.patch('/unmark_post', unmark_post);
router.delete('/delete_post/:post_id', delete_post);

export default router;