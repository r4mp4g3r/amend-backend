import mongoose from "mongoose";

const authModel = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    image: {
        id: {
            type: String,
            default: "user_profile_p8ofmu"
        },
        url: {
            type: String,
            default: "https://res.cloudinary.com/dfflk6oiq/image/upload/v1723648086/user_profile_p8ofmu.jpg"
        }
    },
    handle: {
        type: String,
        required: true,
        unique: true
    },
    // saved:[
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "collection"
    //     }
    // ],
    // collectiondb: [
    //     {
    //         type: mongoose.Schema.Types.ObjectId,
    //         ref: "collectiondb"
    //     }
    // ]
},{timestamps: true})

const auth = mongoose.model("auth", authModel)

export default auth;