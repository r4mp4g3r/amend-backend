import express from "express";
const router = express.Router();
import { checkHandle, register, login, uploadImage } from "../controllers/userController.js";
import uploadFile from "../middlewares/multer.js";
import { checkIsUserAuthenticated } from "../middlewares/isAuth.js";

router.post("/checkhandle", checkHandle)
router.post("/register", register);
router.post("/login", login);

router.post("/upload-image", checkIsUserAuthenticated, uploadFile, uploadImage)

export default router;