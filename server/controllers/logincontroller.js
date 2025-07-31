import { encrypt } from '../functions/encryption.js';
import { validateotp, validatepass } from '../functions/validation.js';
import { generate_token } from '../functions/generatetoken.js';
import { sendmail } from '../functions/sendgmail.js';
import jwt from 'jsonwebtoken'
import { temp_otp, userlogin } from '../schema/loginschema.js';




export const sign_in = async (req, res) => {

    try {

        const details = req.body;

        const result = await userlogin.findOne({ email: details.email })

        if (!result) {
            return res.status(404).json({ message: 'Email not found' });
        }

        const user = result;

        const isValid = await validatepass(details, user.user_password)

        if (isValid) {

            const token = generate_token(user);

            const profileStatus = user.profile;

            return res.status(profileStatus ? 200 : 201)
                .cookie('token', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'None',
                    maxAge: 1 * 24 * 60 * 60 * 1000 // 1 day
                })
                .cookie('profile_status', profileStatus, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'None',
                    maxAge: 1 * 24 * 60 * 60 * 1000 // 1 day
                })
                .json({ message: profileStatus ? 'Profile Done' : 'Profile Not Completed' });
        }

        res.status(401).json({ message: 'Incorrect Password' });

    }
    catch (err) {
        console.log('Error: ', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }

}

export const sign_up = async (req, res) => {

    try {

        const details = req.body;

        const existingUser = await userlogin.findOne({ email: details.email })

        if (existingUser) {
            return res.status(409).json({ message: 'Email already occupied' });
        }

        const otp = await sendmail(details.email)

        const tempUsercheck = await temp_otp.findOne({ email: details.email })

        const hashedpass = await encrypt(details.email, details.password);

        if (tempUsercheck) { //email already exists in otp table


            await temp_otp.updateOne(
                { email: details.email },
                {
                    $set: { 'otp': otp, 'user_password': hashedpass }
                })

            return res.status(202).json({ message: 'OTP Verification Restarted' })
        }

        await temp_otp.create({
            email: details.email,
            user_password: hashedpass,
            otp: otp
        })

        res.status(202).json({ message: 'OTP Verification Started' })

    }
    catch (err) {

        console.log('Error: ', err)
        res.status(500).json({ message: 'Internal Server Error' });
    }

}

export const otp_verification = async (req, res) => {


    try {

        const details = req.body;

        const tempUser = await temp_otp.findOne({ email: details.email })

        const status = await validateotp(details, tempUser);

        if (status.code != 201) {
            return res.status(status.code).json({ message: status.message });
        }

        await temp_otp.deleteOne({ email: details.email })

        const hashedpass = await encrypt(details.email, details.password);

        const newUser = await userlogin.create({
            email: details.email,
            user_password: hashedpass,
        })

        const token = generate_token(newUser)

        return res.status(200).cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 1 * 24 * 60 * 60 * 1000
        }).cookie('profile_status', false, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 1 * 24 * 60 * 60 * 1000
        }).send()
    }
    catch (err) {

        console.log('Error: ', err)
        res.status(500).json({ message: 'Internal Server Error' });
    }

}

export const resend_otp = async (req, res) => {


    try {

        const details = req.body;

        const otp = await sendmail(details.email)

        await temp_otp.updateOne(
            { email: details.email },
            {
                $set: { otp: otp }
            })

        res.status(202).json({ message: 'OTP Resent' })
    }
    catch (err) {

        console.log('Error: ', err)
        res.status(500).json({ message: 'Internal Server Error' });
    }

}


export const validate = async (req, res) => {

    try {

        const token = req.cookies.token;

        const decoded = jwt.verify(token, process.env.SECRET_KEY)

        const profile = req.cookies.profile_status;

        if (profile == 'true') {
            return res.status(200).json({ message: 'Token Verified' })
        }

        res.status(201).json({ message: 'Token Verified but profile incomplete' })
    }
    catch (err) {

        console.log('Error: ', err)
        res.status(403).clearCookie('token').clearCookie('profile_status').json({ message: 'Expired or Incorrect Token' });
    }
}


export const signout = async (req, res) => {

    try {
        res.status(200).clearCookie('token').clearCookie('profile_status').json('Sign Out successful')
    }
    catch (err) {
        console.log('Error: ', err);
        res.status(500).json({ message: 'Internal Server Error!' })
    }
}
