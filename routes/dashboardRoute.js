import express from "express";
const router = express.Router();
import uploadFile from "../middlewares/multer.js";
import { getPublic, getPublicCategory, getPublicLink, checkCollectionHandle, getCollection, createCollection, updateCollection, getCategories, getAllCollections, createCategory, createLink, getLinks, deleteCollection, deleteCategory, deleteLink} from "../controllers/dashboardController.js";
import { checkIsUserAuthenticated } from "../middlewares/isAuth.js";

router.get("/collections", checkIsUserAuthenticated, getAllCollections)

router.post("/create-collection", checkIsUserAuthenticated, uploadFile, createCollection)
router.put("/update-collection/:id", checkIsUserAuthenticated, uploadFile, updateCollection)

router.post("/check-collections-handle", checkIsUserAuthenticated, checkCollectionHandle)
router.get("/collections/get-collection/:collectionId", checkIsUserAuthenticated, getCollection)

router.post("/collections/:collectionId/add-category", checkIsUserAuthenticated, createCategory)
router.get("/collections/:collectionId", checkIsUserAuthenticated, getCategories)

router.post("/collections/:collectionId/:categoryId", checkIsUserAuthenticated, createLink)
router.get("/collections/:collectionId/:categoryId", checkIsUserAuthenticated, getLinks)

router.delete("/collection/:collectionId", checkIsUserAuthenticated, deleteCollection)
router.delete("/category/:categoryId", checkIsUserAuthenticated, deleteCategory)
router.delete("/link/:linkId", checkIsUserAuthenticated, deleteLink)

router.get("/public/:handle", getPublic)
router.get("/public/category/:collectionId", getPublicCategory)
router.get("/public/link/:categoryId", getPublicLink)

// router.get("/collections/:id/", checkIsUserAuthenticated, getAllCategory)
// router.get("/collections/:handle/:categoryId", checkIsUserAuthenticated, getCollection)
// router.get("/collections/:id/:categoryId/:name", checkIsUserAuthenticated, getLink)

export default router;