import mongoose, { mongo } from "mongoose";

const linkSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    url: {
        type: String,
        required: true
    },
    image: {
        url: String

    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "auth",
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
        required: true
    },
    collectionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "collectiondb"
    }
}, {timestamps: true})

const linkModel = mongoose.model("link", linkSchema)

export default linkModel;

// /collections/:collectionId/:categoryId