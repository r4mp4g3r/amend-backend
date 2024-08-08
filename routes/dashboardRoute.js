import express from "express";
const router = express.Router();
import uploadFile from "../middlewares/multer.js";
import { checkCollectionHandle, createCollection, getAllCollections, getCollection, createCategory, createLink, getLink} from "../controllers/dashboardController.js";
import { checkIsUserAuthenticated } from "../middlewares/isAuth.js";

router.get("/collections", checkIsUserAuthenticated, getAllCollections)
router.post("/create-collection", checkIsUserAuthenticated, uploadFile, createCollection)
router.post("/collections/check-handle", checkIsUserAuthenticated, checkCollectionHandle)
router.get("/collections/:handle", checkIsUserAuthenticated, getCollection)

router.post("/collections/:id/add-category", checkIsUserAuthenticated, createCategory)
// router.get("/collections/:id/", checkIsUserAuthenticated, getAllCategory)
router.post("/collections/:id/:categoryId", checkIsUserAuthenticated, createLink)
router.get("/collections/:id/:categoryId/:name", checkIsUserAuthenticated, getLink)

export default router;