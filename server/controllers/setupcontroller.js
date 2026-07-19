import { profile } from "../schema/setupschema.js";
import { userlogin } from '../schema/loginschema.js';
import { savedposts } from "../schema/serviceschema.js";

export const create_profile = async (req, res) => {
    try {
        const details = req.body;
        const lat = parseFloat(details.lat);
        const lon = parseFloat(details.lon);
        const contact = BigInt(details.contact);
        const profImg = details.profile_image || null; 

        await profile.create({
            _id: req.id,
            name: details.name,
            contact: contact,
            email: details.email,
            address: details.address,
            location: { type: "Point", coordinates: [lon, lat] },
            profile_img: profImg
        });

        await userlogin.updateOne({ _id: req.id }, { $set: { profile: true } });
        await savedposts.create({ user_id: req.id });

        return res.status(200).cookie('profile_status', true, {
            httpOnly: true, secure: true, sameSite: 'None', maxAge: 1 * 24 * 60 * 60 * 1000
        }).json({ message: 'Profile Created' });
    }
    catch (err) {
        console.log('Error: ', err);
        res.status(500).json({ message: "Incorrect Information. Please Try Again" });
    }
}

export const update_profile = async (req, res) => {
    try {
        const details = req.body;
        const lat = parseFloat(details.lat);
        const lon = parseFloat(details.lon);
        const contact = BigInt(details.contact);
        const profImg = details.profile_image || null;

        await profile.updateOne(
            { _id: req.id },
            {
                $set: {
                    name: details.name,
                    contact: contact,
                    email: details.email,
                    address: details.address,
                    location: { type: "Point", coordinates: [lon, lat] }
                }
            }
        );

        if (details.img_update) {
            await profile.updateOne(
                { _id: req.id },
                { $set: { profile_img: profImg } }
            );
        }

        return res.status(200).cookie('profile_status', true, {
            httpOnly: true, secure: true, sameSite: 'None', maxAge: 1 * 24 * 60 * 60 * 1000
        }).json({ message: 'Profile Updated' });
    }
    catch (err) {
        console.log('Error: ', err);
        res.status(500).json({ message: "Incorrect Information. Please Try Again" });
    }
}

export const fetch_profile = async (req, res) => {
    try {
        const user_profile = await profile.findOne({ _id: req.id }).lean();
        // Uses the full URL stored in DB directly
        user_profile.profimg_url = user_profile.profile_img ? user_profile.profile_img : null; 

        res.status(200).json({ user_profile });
    }
    catch (err) {
        console.log('Error: ', err);
        res.status(500).json({ message: "Some Error Occured" });
    }
}