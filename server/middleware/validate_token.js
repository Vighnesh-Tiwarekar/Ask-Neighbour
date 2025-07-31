import jwt from 'jsonwebtoken'

export const validate_token = (req,res,next) => {

    try{
        const token = req.cookies.token;

        const decoded = jwt.verify(token,process.env.SECRET_KEY);

        console.log('Token Validated')

        req.id=decoded.user

        next();
    }
    catch(err)
    {
        console.log('Error: ',err);
        res.status(500).clearCookie('token').clearCookie('profile_status').json({message: 'Invalid Token'})
    }
}