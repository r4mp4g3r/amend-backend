import categoryModel from "../models/categoryModel.js";
import collectionModel from "../models/collectionModel.js"
import linkModel from "../models/linkModel.js";
import getDataUrl from "../utils/urlGenerator.js";
import cloudinary from "cloudinary"

const getPublic = async (req, res) => {
    const {handle} = req.params;
    try {
        const data = await collectionModel.findOne({handle}).populate("category")
        res.status(200).json(data)
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

const getPublicCategory = async (req, res) => {
    const {collectionId} = req.params;
    try {
        const getAllCategory = await categoryModel.find({collectionId});
        res.status(200).json(getAllCategory)
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

const getPublicLink = async (req, res) => {
    const {categoryId} = req.params;
    try {
        if(categoryId === "undefined"){
            console.log("hhhh");
            return;
        }
        const getAllLink = await linkModel.find({categoryId})
        res.json(getAllLink)
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

const checkCollectionHandle = async (req, res) => {
    const {handle} = req.body;
    const lowerCaseHandle = handle.toLowerCase()
    try {
        if(!handle){
            return res.status(400).json({message: "All Fields are Required!"})
        }
        const checkHandle = await collectionModel.findOne({handle: lowerCaseHandle});
        
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
    const lowerCaseHandle = handle.toLowerCase()
    console.log(req.body)
    console.log(req.file)
    try {

        if(req.file){
            const checkHandle = await collectionModel.findOne({handle});
            console.log("CHECK HANDLE", checkHandle)
            if(checkHandle){
                return res.status(400).json({message: "Handle not avaliable"})
            }

            const file = req.file
            const fileUrl = getDataUrl(file)
            const cloud = await cloudinary.v2.uploader.upload(fileUrl.content)

            const newCollection = await collectionModel({
                name,
                type,
                owner: req.user._id,
                handle: lowerCaseHandle,
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
            handle: lowerCaseHandle,
            image: {
                id: "user_profile_p8ofmu",
                url: "https://res.cloudinary.com/dfflk6oiq/image/upload/v1723648086/user_profile_p8ofmu.jpg"
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

    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

const updateCollection = async (req, res) => {
    const {name, type } = req.body;
    const {id} = req.params;
    
    // try {
    //     if(req.file){
    //         const file = req.file
    //         const fileUrl = getDataUrl(file)
    //         const cloud = await cloudinary.v2.uploader.upload(fileUrl.content)

    //         const newCollection = await collectionModel({
    //             name,
    //             type,
    //             image: {
    //                 id: cloud.public_id,
    //                 url: cloud.secure_url
    //             }
    //         })
        
    //         const resCollection = await newCollection.save()

    //         const data = await categoryModel({
    //             categoryTitle: "main",
    //             owner: req.user._id,
    //             collectionId: resCollection._id
    //         })
    //         const resCategory = await data.save()
    //         newCollection.category.push(resCategory._id)
    //         await newCollection.save()

    //         return res.status(200).json({message: "Collection created successfully!", collection: resCollection})
    //     }

    //     const newCollection = await collectionModel({
    //         name,
    //         type,
    //         owner: req.user._id,
    //         handle: lowerCaseHandle,
    //         image: {
    //             id: "user_profile_p8ofmu",
    //             url: "https://res.cloudinary.com/dfflk6oiq/image/upload/v1723648086/user_profile_p8ofmu.jpg"
    //         }
    //     })
    
    //     const resCollection = await newCollection.save()

    //     const data = await categoryModel({
    //         categoryTitle: "main",
    //         owner: req.user._id,
    //         collectionId: resCollection._id
    //     })
    //     const resCategory = await data.save()
    //     newCollection.category.push(resCategory._id)
    //     await newCollection.save()

    //     return res.status(200).json({message: "Collection created successfully!", collection: resCollection})

    // } catch (error) {
    //     return res.status(400).json({message: error.message})
    // }
}

// ------------------------------------------------

const getCollection = async (req, res) => {
    const {collectionId} = req.params
    try {
        // const data = await collectionModel.findOne({handle}).populate("category")
        const data = await collectionModel.findById(collectionId)
        if(!data){
            return res.status(400).json({message: "Collection Not Found!"})
        }
        return res.status(200).json(data)
    } catch (error) {
        console.log("GET COLLECTION DB", error.message)
        return res.status(400).json({message: "Collection Not Found!"})
    }
}

const getCategories = async (req, res) => {
    const {collectionId} = req.params;
    console.log(collectionId)
    try {
        const getAllCategory = await categoryModel.find({collectionId});
        res.status(200).json(getAllCategory)
    } catch (error) {
        return res.status(400).json({message: "Collection Not Found!"})
    }
}

const createCategory = async (req, res) => {
    const {collectionId} = req.params;
    const {title, image} = req.body;

    const userId = req.user._id
    try {
        if(!title){
            return res.status(400).json({message: "All Fields are required"})
        }
        const checkUser = await collectionModel.findById(collectionId);
        if(userId.toString() == checkUser.owner.toString()){
            const data = await categoryModel({
                categoryTitle: title.toLowerCase(),
                owner: userId,
                collectionId,
                image
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
    const {collectionId, categoryId} = req.params;

    console.log(req.user)
    
    try {
        if(!title || !url){
            return res.status(400).json({message: "All Fields are Required!"})
        }

        const data = await linkModel({
            title,
            description,
            url,
            owner: req.user._id,
            categoryId,
            collectionId,  
        })
        console.log("ID")
        const resData = await data.save()
        res.json(resData)
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

const getLinks = async (req, res) => {
    const {collectionId, categoryId} = req.params;
    try {
        const data = await linkModel.find({categoryId}).sort({createdAt: -1})
        
        return res.status(200).json(data)
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

// ---------------------Delete-----------------------------

const deleteCollection = async (req, res) => {
    const {collectionId} = req.params;
    try {
        const data = await collectionModel.findById(collectionId)
        console.log(data.image.id)
        if(data.image.id === "user_profile_p8ofmu"){

            if(req.user._id.toString() === data.owner.toString()){
                const deleteCollect = await collectionModel.deleteOne({_id: collectionId})
                const deleteCategory = await categoryModel.deleteMany({collectionId})
                const deleteLink = await linkModel.deleteMany({collectionId})
    
                return res.status(200).json({message: "Deleted Successfully!"})
            } else {
                return res.status(400).json({message: "Unauthorized User!"})
            }

        } else {
            if(req.user._id.toString() === data.owner.toString()){
                const deleteCollect = await collectionModel.deleteOne({_id: collectionId})
                const deleteCategory = await categoryModel.deleteMany({collectionId})
                const deleteLink = await linkModel.deleteMany({collectionId})
    
                cloudinary.uploader.destroy(data.image.id, function(result) { console.log(result) })
    
                return res.status(200).json({message: "Deleted Successfully!"})
            } else {
                return res.status(400).json({message: "Unauthorized User!"})
            }
        }
        
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

const deleteCategory = async (req, res) => {
    const {categoryId} = req.params;

    try {
        const getCategory = await categoryModel.findById(categoryId)
        if(req.user._id.toString() === getCategory.owner.toString()){
            const deleteCategory = await categoryModel.deleteOne({_id: categoryId})
            const deleteLink = await linkModel.deleteMany({categoryId})
            return res.status(200).json({message: "Deleted Successfully!"})
        } else {
            return res.status(400).json({message: "Unauthorized User!"})
        }
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

const deleteLink = async (req, res) => {
    const {linkId} = req.params;

    try {
        const getLink = await linkModel.findById(linkId)
        if(req.user._id.toString() === getLink.owner.toString()){
            const deleteLink = await linkModel.deleteOne({_id: linkId})
            return res.status(200).json({message: "Deleted Successfully!"})
        } else {
            return res.status(400).json({message: "Unauthorized User!"})
        }
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

export {getPublic, getPublicCategory, getPublicLink, checkCollectionHandle, getAllCollections, getCollection, createCollection, updateCollection, createCategory, createLink, getLinks, getCategories, deleteCollection, deleteCategory, deleteLink }