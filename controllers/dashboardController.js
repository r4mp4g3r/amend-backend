import categoryModel from "../models/categoryModel.js";
import collectionModel from "../models/collectionModel.js"
import getDataUrl from "../utils/urlGenerator.js";
import cloudinary from "cloudinary"

const checkCollectionHandle = async (req, res) => {
    const {handle} = req.body;
    console.log(handle)
    try {
        if(!handle){
            return res.status(400).json({message: "All Fields are Required!"})
        }
        const checkHandle = await collectionModel.findOne({handle});
        console.log(checkHandle)
        if(checkHandle){
            return res.status(400).json({message: "Handle Not Available!"})
        } else {
            return res.status(200).json({message: "Handle Available!"})
        }
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

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
    const {name, type, handle } = req.body;
    console.log(req.body)
    console.log(req.file)
    try {

        if(req.file){
            const file = req.file
            const fileUrl = getDataUrl(file)
            const cloud = await cloudinary.v2.uploader.upload(fileUrl.content)

            const checkHandle = await collectionModel.findOne({handle});
            console.log("CHECK HANDLE", checkHandle)

            if(checkHandle){
                return res.status(400).json({message: "Handle not avaliable"})
            }
        
            const newCollection = await collectionModel({
                name,
                type,
                owner: req.user._id,
                handle,
                image: {
                    id: cloud.public_id,
                    url: cloud.secure_url
                }
            })
        
            const resCollection = await newCollection.save()

            const data = await categoryModel({
                categoryTitle: "main",
                owner: req.user._id,
                collectionId: resCollection._id
            })
            const resCategory = await data.save()
            newCollection.category.push(resCategory._id)
            await newCollection.save()

            return res.status(200).json({message: "Collection created successfully!", collection: resCollection})
        }

        const checkHandle = await collectionModel.findOne({handle});

        if(checkHandle){
            return res.status(400).json({message: "Handle not avaliable"})
        }

        const newCollection = await collectionModel({
            name,
            type,
            owner: req.user._id,
            handle,
            image: {
                id: "cpk5zpnxfo2b6svfc6or",
                url: "https://res.cloudinary.com/dfflk6oiq/image/upload/v1722951053/cpk5zpnxfo2b6svfc6or.jpg"
            }
        })
    
        const resCollection = await newCollection.save()

        const data = await categoryModel({
            categoryTitle: "Main",
            owner: req.user._id,
            collectionId: resCollection._id
        })
        const resCategory = await data.save()
        newCollection.category.push(resCategory._id)
        await newCollection.save()

        return res.status(200).json({message: "Collection created successfully!", collection: resCollection})

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

// ------------------------------------------------

const getCollection = async (req, res) => {
    const {handle} = req.params
    try {
        const data = await collectionModel.findOne({handle}).populate("category")
        if(!data){
            return res.status(400).json({message: "Collection Not Found!"})
        }
        return res.status(200).json(data)
    } catch (error) {
        console.log("GET COLLECTION DB", error.message)
        return res.status(400).json({message: "Collection Not Found!"})
    }
}

const createCategory = async (req, res) => {
    const id = req.params.id;
    const {title, imageId, imageUrl} = req.body;

    const userId = req.user._id
    try {
        if(!title){
            return res.status(400).json({message: "All Fields are required"})
        }
        const checkUser = await collectionModel.findById(id);
        if(userId.toString() == checkUser.owner.toString()){
            const data = await categoryModel({
                categoryTitle: title.toLowerCase(),
                owner: userId,
                // image: {
                //     id: imageId,
                //     url: imageUrl
                // }
            })
            const resCategory = await data.save()

            checkUser.category.push(resCategory._id)

            await checkUser.save()

            res.status(200).json({message: "Category created successfully!", resCategory})
        } else {
            return res.status(401).json({message: "Unauthorized User!"})
        } 
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

// ------------------------------------------------

const createLink = async (req, res) => {
    const {title, description, url} = req.body;
    const categoryId = req.params.categoryId;
    console.log(req.body)
    try {
        if(!title || !url){
            return res.status(400).json({message: "All Fields are Required!"})
        }
        const pushLinkToCategory = await categoryModel.findById(categoryId);
        console.log(pushLinkToCategory)
        pushLinkToCategory.info.push({
            title,
            description,
            url,
            image: {
                id: "fdkghdfjkhg",
                url: "dskfjghsdf"
            }
        })

        const linkSaved = await pushLinkToCategory.save()

        res.status(200).json({message: "Link Added Successfully!", linkSaved})
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

const getLink = async (req, res) => {
    const {id, name} = req.params;
    try {
        const data = await collectionModel.findById(id).populate("category")

        console.log(data)

        const selectedData = data.category.find(category => category.categoryTitle === name)
        
        return res.status(200).json(selectedData.info)
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

export {checkCollectionHandle, getAllCollections, createCollection, getCollection, createCategory, createLink, getLink }