import authModel from "../models/authModel.js"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import getDataUrl from "../utils/urlGenerator.js";
import cloudinary from "cloudinary"
import crypto from "crypto";  // Import crypto for generating reset tokens
import sendEmail from "../utils/sendEmail.js"; // Import your email sending utility

const checkHandle = async (req, res) => {
    const {handle} = req.body;

    try {
        if(!handle){
            return res.status(400).json({message: "All fields are required!"})
        }
    
        const resHandle = await authModel.findOne({handle});
        if(!resHandle){
            return res.status(201).json({message: "Handle Available"})
        } else {
            return res.status(200).json({message: "Handle Already Taken!"})
        }
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

const register = async (req, res) => {
    const {name, email, password, handle} = req.body;

    try {
        if(!name && !email && !password && !handle){
            return res.status(400).json({message: "All fields are required!"})
        }
    
        const checkAlreadyRegister = await authModel.findOne({email});
        const checkHandle = await authModel.findOne({handle})
        if(checkAlreadyRegister){
            return res.status(400).json({message: "Email already registered!"})
        }
        if(checkHandle){
            return res.status(400).json({message: "Handle already exist!"})
        }
    
        const genSalt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, genSalt)
    
        const newUser = await authModel({
            name,
            email,
            password: hashedPassword,
            handle
        })
    
        const resUser = await newUser.save()
    
        if(res){
            const token = jwt.sign({
                id: resUser._id,
                name: resUser.name,
                email: resUser.email,
                handle: resUser.handle
            }, "abcdefgh", {expiresIn: "90d"})

            return res.status(201).json({message: "Register Successfully", token, user: resUser})
        }
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        if(email && password){
            const isUser = await authModel.findOne({email});
        
            if(!isUser){
                return res.status(401).json({message: "User not found!"})
            }
        
            const comparePassword = await bcryptjs.compare(password, isUser.password)
            console.log("PASSWORD", comparePassword)
           if(comparePassword){

            const token = jwt.sign({
                id: isUser._id,
                name: isUser.name,
                email: isUser.email,
                handle: isUser.handle
            }, "abcdefgh", {expiresIn: "90d"})

            return res.status(201).json({message: "Login Successful", token, user: {
                name: isUser.name, 
                email: isUser.email, 
                handle: isUser.handle, 
                image: isUser.image
            }})
           } else {
            return res.status(401).json({message: "Invalid Credentials!"})
           }
        } else {
            return res.status(400).json({message: "All fields are required!"})
        }
    
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
   
}

const uploadImage = async (req, res) => {
    const {id, email} =  req.user;
    try {
        if(!req.file){
            return res.status(400).json({message: "Please upload an image!"})
        }
    
        const file = req.file
        const fileUrl = getDataUrl(file)
        const cloud = await cloudinary.v2.uploader.upload(fileUrl.content)
        console.log(cloud)
    
        const addImage = await authModel.findByIdAndUpdate(id, {image: {id: cloud.public_id, url: cloud.secure_url}}, {new: true})
        return res.status(200).json({message: "Image Upload Successful", user:  addImage}) 
    } catch (error) {
        console.log(error)
        return res.status(400).json({message: error.message})
    }
}

const requestResetPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await authModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const token = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
        await user.save();

        const resetLink = `http://yourfrontend.com/reset-password/${token}`;
        await sendEmail(user.email, 'Password Reset Request', `Please click on the following link to reset your password: ${resetLink}`);

        res.json({ message: "Password reset link sent to your email." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const user = await authModel.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        const genSalt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(newPassword, genSalt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: "Password successfully reset." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export { register, checkHandle, login, uploadImage, requestResetPassword, resetPassword };