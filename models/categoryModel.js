import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    categoryTitle: {
        type: String,
        required: true
    },
    info: [
        {
            title: {
                type: String,
                required: true
            },
            description: {
                type: String
            },
            url: {
                type: String
            },
            image: {
                id: String,
                url: String,
            }
        }
    ]
})

const categoryModel = new mongoose.model("category", categorySchema)

export default categoryModel;