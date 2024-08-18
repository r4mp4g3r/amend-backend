import express from "express";
import { checkHandle, register, login, uploadImage, requestResetPassword, resetPassword } from "../controllers/userController.js";
import uploadFile from "../middlewares/multer.js";
import { checkIsUserAuthenticated } from "../middlewares/isAuth.js";

const router = express.Router();

// Route to check if a handle is available
router.post("/checkhandle", checkHandle);

// Register Route
router.post('/register', register);

// Login Route
router.post("/login", login);

// Upload Image Route
router.post("/upload-image", checkIsUserAuthenticated, uploadFile, uploadImage);

// Reset Password Request Route
router.post("/request-reset-password", requestResetPassword);

// Reset Password Confirm Route
router.post("/reset-password/:token", resetPassword);

export default router;