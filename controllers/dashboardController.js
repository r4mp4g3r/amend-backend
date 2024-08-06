import collectionModel from "../models/collectionModel.js"
import getDataUrl from "../utils/urlGenerator.js";
import cloudinary from "cloudinary"

const getAllCollections = async (req, res) => {
    const id = req.user._id;
    console.log("USER", id)
    try {
        const data = await collectionModel.find({owner: id}).sort({ createdAt: -1 })
        return res.status(200).json({data})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

const createCollection = async (req, res) => {
    const {name, type} = req.body;
    console.log(req.body)
    console.log(req.file)
    try {

        if(!req.file){
            return res.status(400).json({message: "Please upload an image!"})
        }

        const file = req.file
        const fileUrl = getDataUrl(file)
        const cloud = await cloudinary.v2.uploader.upload(fileUrl.content)
        console.log(cloud)
    
        const newCollection = await collectionModel({
            name,
            type,
            owner: req.user._id,
            image: {
                id: cloud.public_id,
                url: cloud.secure_url
            }
        })
    
        const resCollection = await newCollection.save()

        res.status(200).json({message: "Collection created successfully!", collection: resCollection})

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}


const uploadImage = async (req, res) => {
    const {id, email} =  req.user;
    try {
    
        
        
        return res.status(200).json({message: "Image Upload Successful", user:  addImage}) 
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

export {getAllCollections, createCollection}