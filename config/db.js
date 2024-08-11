import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const options = {
            serverSelectionTimeoutMS: 5000, // 5 seconds
            socketTimeoutMS: 45000, // 45 seconds
        };

        const res = await mongoose.connect("mongodb+srv://ankan:ankan123456@cluster0.l6o3wer.mongodb.net/amend-id", options);
        console.log("DB Connected Successfully...");
    } catch (error) {
        console.log("ERROR DB: ", error);
    }
};

export default connectDB;