import mongoose from 'mongoose';

const userloginSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true,
    },
    user_password: {
        type: String,
        required: true
    },
    profile: {
        type: Boolean,
        default: false
    },
},
    {
        timestamps: true,
        collection: 'userlogin'
    }
)

const temp_otpSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true,
        unique: true,
    },
    user_password: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        default: false
    },
},
    {
        timestamps: true,
        collection: 'temp_otp'
    }
)



export const userlogin = mongoose.model('userlogin', userloginSchema);

export const temp_otp = mongoose.model('temp_otp', temp_otpSchema)

