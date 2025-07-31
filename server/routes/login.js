import express from 'express'
import  {otp_verification, resend_otp, sign_in, sign_up, validate, signout}  from '../controllers/logincontroller.js';

const router = express.Router();

router.post('/signin', sign_in)

router.post('/signup',sign_up)

router.post('/otp_verification',otp_verification)

router.post('/resend_otp', resend_otp)

router.get('/validate',validate)

router.post('/signout',signout)

export default router;  