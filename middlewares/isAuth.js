import jwt from "jsonwebtoken"
import authModel from "../models/authModel.js"

const checkIsUserAuthenticated = async (req, res, next) => {
    try {
        let token;
        const {authorization} = req.headers;

        if(authorization && authorization.startsWith("Bearer")){
            try {
                token = authorization.split(" ")[1];
                const {id, email} = jwt.verify(token, "abcdefgh");
                console.log(id, email)
                req.user = await authModel.findById(id).select("-password");
                next()
            } catch (error) {
                return res.status(401).json({message: "Unauthorized User!"})
            }
        }
    } catch (error) {
        return res.status(400).json({message: error.message})
    }
}

export {checkIsUserAuthenticated}