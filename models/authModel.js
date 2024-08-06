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
        id: String,
        url: String,
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