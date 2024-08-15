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
        id: String,
        url: String,
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