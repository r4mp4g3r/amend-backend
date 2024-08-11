import express from "express";
const app = express();
import cloudinary from "cloudinary"
import cors from "cors"
const PORT = process.env.PORT || 5001

import userRoutes from "./routes/userRoute.js"
import dashboardRoutes from "./routes/dashboardRoute.js"
import connectDB from "./config/db.js";
import dotenv from 'dotenv';
dotenv.config();

connectDB()

cloudinary.config({ 
    cloud_name: '', 
    api_key: '', 
    api_secret: '' // Click 'View Credentials' below to copy your API secret
});

app.use(cors())

app.get("/", (req, res) => {
    res.send("Hello")
})

app.use(express.json())
app.use(express.static("public"))

app.use("/api/v1", userRoutes)
app.use("/api/v1/user", dashboardRoutes)

app.listen(PORT, () => {
    console.log(`Server started on ${PORT}`)
})
