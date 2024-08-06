import express from "express";
const router = express.Router();
import uploadFile from "../middlewares/multer.js";
import { createCollection, getAllCollections } from "../controllers/dashboardController.js";
import { checkIsUserAuthenticated } from "../middlewares/isAuth.js";

router.get("/collections", checkIsUserAuthenticated, getAllCollections)
router.post("/create-collection", checkIsUserAuthenticated, uploadFile, createCollection)

export default router;