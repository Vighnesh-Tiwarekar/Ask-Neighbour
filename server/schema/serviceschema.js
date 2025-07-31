import mongoose from "mongoose";
import { type } from "os";

const postsschema = new mongoose.Schema({

    user_id: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    post_type: {
        type: String,
        required: true
    },
    tags: {
        type: [Boolean],
        required: true
    },
    post_img: {
        type: String,
        default: null
    },
    posted: {
        type: Boolean,
        required: true
    }
},
    {
        timestamps: true,
        collection: 'posts'
    }
)

const savedpostsSchema = new mongoose.Schema({

    user_id: {
        type: String,
        required: true
    },
    post_ids: {
        type: [String]
    }
},
    {
        collection: 'savedposts'
    }
)



export const posts = mongoose.model('posts', postsschema);
export const savedposts = mongoose.model('savedposts', savedpostsSchema)