import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    categoryTitle: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "https://res.cloudinary.com/dfflk6oiq/image/upload/v1723742238/icons/jdzzqnphwmd3cs55jky6.png"
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "auth",
        required: true
    },
    collectionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "collectiondb"
    }
    // info: [
    //     {
    //         title: {
    //             type: String,
    //             required: true
    //         },
    //         description: {
    //             type: String
    //         },
    //         url: {
    //             type: String
    //         },
    //         image: {
    //             id: String,
    //             url: String,
    //         }
    //     }
    // ]
},{timestamps: true})

const categoryModel = new mongoose.model("category", categorySchema)

export default categoryModel;