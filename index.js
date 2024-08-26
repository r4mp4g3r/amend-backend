import express from "express";
const app = express();
import cloudinary from "cloudinary";
import cors from "cors";
const PORT = process.env.PORT || 5000;

import userRoutes from "./routes/userRoute.js";
import dashboardRoutes from "./routes/dashboardRoute.js";
//import authRoutes from './routes/auth.js';
const authRoutes = require('./routes/auth.js');
import connectDB from "./config/db.js";
import dotenv from 'dotenv';
dotenv.config();

connectDB();

cloudinary.config({ 
    cloud_name: 'dfflk6oiq', 
    api_key: '924287212334238', 
    api_secret: 'I4JTW32UZGDX8o-JdRkp3yDmzeU'
});

app.use(cors());

app.get("/", (req, res) => {
    res.send("Hello");
});

app.use(express.json());
app.use(express.static("public"));

app.use("/api/v1", userRoutes);
app.use("/api/v1/user", dashboardRoutes);
app.use("/api/v1/auth", authRoutes);  // Updated this line

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`);
});