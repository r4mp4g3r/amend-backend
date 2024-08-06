import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const res = await mongoose.connect("mongodb+srv://ankan:ankan123456@cluster0.l6o3wer.mongodb.net/amend-id");
        console.log("DB Connected Successfully...")
    } catch (error) {
        console.log("ERROR DB: ", error)
    }
    
}

export default connectDB;