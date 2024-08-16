import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        type: String,
        enum : ['individual','business', 'misc'],
        default: 'individual'
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
        unqiue: true
    },
    category: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category"
        }
    ],
    owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "auth",
            required: true
    }
}, {timestamps: true})

const collectionModel = mongoose.model("collectiondb", collectionSchema);

export default collectionModel;