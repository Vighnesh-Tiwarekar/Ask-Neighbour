import express from 'express'
import multer from 'multer';
import path from 'path'
import { delete_post, fetchposts, post_status, update_post, fetchyourposts, create_post, mark_post, unmark_post } from '../controllers/servicecontroller.js';

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,'uploads/')
    },

    filename: (req,file,cb) => {
        const name = Date.now() + req.id;
        cb(null,name + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage });

const router = express.Router();

router.post('/sendpost',upload.single('post_img') , create_post );

router.patch('/updatepost',upload.single('post_img') , update_post );

router.patch('/post_status', post_status)

router.get('/fetchposts',fetchposts)

router.get('/fetchyourposts',fetchyourposts)

router.patch('/mark_post', mark_post)

router.patch('/unmark_post', unmark_post)

router.delete('/delete_post/:post_id',delete_post)

export default router;