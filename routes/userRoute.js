import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from 'nodemailer';
import { checkHandle, register, uploadImage } from "../controllers/userController.js";
import uploadFile from "../middlewares/multer.js";
import { checkIsUserAuthenticated } from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/checkhandle", checkHandle);

// Register Route
router.post('/register', async (req, res) => {
    const email = req.body.email.toLowerCase(); // Convert email to lowercase
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email is already registered" });
        }
        // Continue with user registration
        const user = new User({ ...req.body, email });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

// Login Route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email.toLowerCase() });
        console.log(user); // Check if user object is retrieved
        
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch); // Check if password matches
        console.log(password); // Plain-text password from the request
        console.log(user.password); // Hashed password from the database
        
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                name: user.name,
                handle: user.handle,
                email: user.email,
                image: user.image ? user.image.url : null,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Upload Image Route
router.post("/upload-image", checkIsUserAuthenticated, uploadFile, uploadImage);

// Reset Password Request Route
router.post('/reset-password', async (req, res) => {
    const email = req.body.email.toLowerCase(); // Ensure email is lowercase
    console.log(`Reset password request for email: ${email}`); // Debug statement
    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'No account with that email' });
        }

        const resetToken = jwt.sign({ id: user._id }, process.env.RESET_PASSWORD_SECRET, { expiresIn: '15m' });

        // Setup Nodemailer transport and send email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const resetUrl = `http://yourfrontend.com/reset-password/${resetToken}`;
        //const resetUrl = `http://localhost:5173/reset-password/resetpasswordnow`;
        const message = `You requested a password reset. Please go to this link to reset your password: ${resetUrl}`;

        await transporter.sendMail({
            to: user.email,
            subject: "Password Reset Request",
            text: message,
        });

        res.status(200).json({ message: 'Password reset link sent to email' });
} catch (error) {
    console.error("Error sending email: ", error); // Log the full error
    res.status(500).json({ message: 'Unable to send reset link' });
}
});

// Reset Password Confirm Route
router.post('/reset-password/:token', async (req, res) => {
    const { password } = req.body;
    const resetToken = req.params.token;

    try {
        const decoded = jwt.verify(resetToken, process.env.RESET_PASSWORD_SECRET);
        const user = await User.findById(decoded.id);

        user.password = await bcrypt.hash(password, 10);
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Invalid or expired token' });
    }
});

export default router;