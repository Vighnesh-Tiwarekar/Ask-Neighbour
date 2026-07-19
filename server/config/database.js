import mongoose from "mongoose";


export const connectdb = async () => {
    try {
        // Connect using the URI from your .env file
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Atlas Connected Successfully');
    }
    catch (err) {
        console.log(`Error connecting to database: ${err}`);
    }
}