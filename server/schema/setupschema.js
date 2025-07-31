import mongoose from "mongoose";

const profileschema = new mongoose.Schema({

    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        required: true
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    profile_img: {
        type: String,
        default: null
    },
},
    {
        timestamps: true,
        collection: 'profile'
    }
)

profileschema.index({ location: '2dsphere' });

export const profile = mongoose.model('profile', profileschema);