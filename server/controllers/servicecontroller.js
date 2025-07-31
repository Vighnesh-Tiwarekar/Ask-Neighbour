import { posts, savedposts } from "../schema/serviceschema.js";
import { profile } from "../schema/setupschema.js";
import path from "path";
import fs from 'fs'

export const create_post = async (req, res) => {

    try {
        const details = req.body;

        const postimg = req.file ? req.file.filename : null;

        await posts.create({
            user_id: req.id,
            title: details.title,
            description: details.description,
            post_type: details.post_type,
            tags: [details.paid == 'true', details.urgency == 'true'],
            post_img: postimg,
            posted: true
        })

        console.log('Post Added');

        res.status(200).json({ message: 'Post has been saved' })

    }
    catch (err) {
        console.log(`Error: ${err}`);
        res.status(500).json({ message: "Incorrect Information. Please Try Again" })
    }

}

export const update_post = async (req, res) => {

    try {

        const details = req.body;

        const postimg = req.file ? req.file.filename : null;

        if (postimg || details.post_img == 'null') {

            const oldImage = await posts.findOne({ _id: details.post_id }, { post_img: 1, _id: 0 });

            if (oldImage?.post_img) {
                const filepath = path.join(process.cwd(), 'uploads', oldImage.post_img);

                if (fs.existsSync(filepath)) {
                    fs.unlinkSync(filepath); // Deletes only the image file
                }
            }
        }

        await posts.updateOne(
            {
                _id: details.post_id
            },
            {
                $set: {
                    title: details.title,
                    description: details.description,
                    tags: [details.paid == 'true', details.urgency == 'true'],
                    post_img: postimg ? postimg : details.post_img == 'null' ? null : details.post_img
                }
            }
        )

        res.status(200).json({ message: 'Post has been saved' })

    }
    catch (err) {
        console.log(`Error: ${err}`);
        res.status(500).json({ message: "Incorrect Information. Please Try Again" })
    }

}

export const fetchposts = async (req, res) => {

    try {

        const location = await profile.findOne({ _id: req.id }, { location: 1, _id: 0 })

        const [longitude, latitude] = location.location.coordinates;

        const nearbyuser = await profile.find({
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: 5000
                }
            }
        })

        const userIds = nearbyuser.map(u => u._id);

        if (userIds.length == 0) {
            return res.status(200).json([]);
        }

        const result = await posts.aggregate([
            {
                $match: {
                    user_id: { $in: userIds },
                    posted: true
                }
            },
            {
                $lookup: {
                    from: 'profile',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user_info'
                }
            },
            {
                $unwind: {
                    path: '$user_info',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    posted: 1,
                    post_type: 1,
                    tags: 1,
                    post_img: 1,
                    updatedAt: 1,
                    'user_info.name': 1,
                    'user_info.contact': 1,
                    'user_info.email': 1,
                    'user_info.address': 1,
                    'user_info.profile_img': 1
                }
            },
            {
                $sort: {
                    updatedAt: -1
                }
            }
        ])

        const post_ids = await savedposts.findOne({ user_id: req.id }, { post_ids: 1, _id: 0 })

        const userposts = result.map((post) => {
            if (post.post_img) {
                post.post_img_url = `http://localhost:8000/uploads/${post.post_img}`
            }
            else {
                post.post_img_url = null;
            }

            if (post.user_info.profile_img) {
                post.profile_img_url = `http://localhost:8000/uploads/${post.user_info.profile_img}`
            }
            else {
                post.profile_img_url = null;
            }

            if (post_ids?.post_ids?.includes(post._id.toString())) {
                post.bookmarked = true;
            }
            else {
                post.bookmarked = false;
            }
            return post;
        })

        res.status(200).json(userposts);

    }
    catch (err) {
        console.log('Error: ', err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const fetchyourposts = async (req, res) => {

    try {



        const result = await posts.find({ user_id: req.id }).sort({ updatedAt: -1 }).lean()

        const yourposts = result.map((post) => {

            if (post.post_img) {
                post.post_img_url = `http://localhost:8000/uploads/${post.post_img}`
            }
            else {
                post.post_img_url = null;
            }
            return post;
        })

        res.status(200).json(yourposts);

    }
    catch (err) {
        console.log('Error: ', err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const post_status = async (req, res) => {

    try {

        const details = req.body;

        await posts.updateOne({ _id: details.post_id },
            {
                $set: { posted: details.posted ? true : false }
            }
        )

        res.status(200).json({ message: 'Post status has been updated' })
    }
    catch (err) {
        console.log('Error: ', err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const delete_post = async (req, res) => {

    try {
        const post_id = req.params.post_id;

        await posts.deleteOne({ _id: post_id })

        res.status(200).json({ message: 'Post has been deleted' });
    }
    catch (err) {
        console.log('Error: ', err)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

export const mark_post = async (req, res) => {

    try {

        const details = req.body;

        await savedposts.updateOne({ user_id: req.id }, {
            $addToSet: { post_ids: details.post_id }
        })

        res.status(200).json({ message: 'Post Bookmarked' })

    }
    catch (err) {
        console.log(`Error: ${err}`)
        res.status(500).json({ message: 'Internal Server Error' })
    }

}

export const unmark_post = async (req, res) => {

    try {

        const details = req.body;

        await savedposts.updateOne({ user_id: req.id }, {
            $pull: { post_ids: details.post_id }
        })

        res.status(200).json({ message: 'Post Unmarked' })

    }
    catch (err) {
        console.log(`Error: ${err}`)
        res.status(500).json({ message: 'Internal Server Error' })
    }

}

