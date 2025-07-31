import nodemailer from 'nodemailer'

const random_num = () => {
    let randomInt = Math.floor(Math.random() * (9 - 0 + 1)) + 0;
    return randomInt;
}

const otp_generator = () => {

    const otp = `${random_num()}${random_num()}${random_num()}${random_num()}${random_num()}${random_num()}`

    return otp;

}

export const sendmail = async(rec_mail) => {

    

    const transporter = nodemailer.createTransport({

        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.otp_mail,
            pass: process.env.otp_pass,
        }
        
    })

    const otp = otp_generator();

    const mailOption = {

        from: `AskNeighbour <${process.env.otp_mail}>`,
        to: rec_mail,
        subject: 'Your One-Time Password (OTP) Code',
        text: `Hello New User,\n\nYour one-time password (OTP) for AskNeighbour authentication is:\n\n${otp}\n\nThis code will expire in 1 minute. Please use it to complete your action. If you did not request this OTP, please ignore this email.\n\nThank you,\nYour App Name Team`
    }

    try{

        await transporter.sendMail(mailOption)
        return otp;
    }
    catch(err)
    {
        console.log('Error: ',err)
    }
}