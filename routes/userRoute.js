import express from "express";
const router = express.Router();
import { checkHandle, register, login, uploadImage } from "../controllers/userController.js";
import uploadFile from "../middlewares/multer.js";
import { checkIsUserAuthenticated } from "../middlewares/isAuth.js";
import Link from '../models/Link.js';
import Category from '../models/Category.js';
import Collection from '../models/Collection.js';

router.post("/checkhandle", checkHandle)
router.post("/register", register);
router.post("/login", login);

router.post("/upload-image", checkIsUserAuthenticated, uploadFile, uploadImage)
router.put('/links/:id', async (req, res) => {
    const { title, url } = req.body;
    const { id } = req.params;
  
    try {
      const link = await Link.findByIdAndUpdate(id, { title, url }, { new: true });
      res.json({ link });
    } catch (error) {
      res.status(500).json({ message: 'Error updating link' });
    }
  });

  router.put('/categories/:id', async (req, res) => {
    const { title, url, description } = req.body;
    const { id } = req.params;
  
    try {
      const category = await Category.findByIdAndUpdate(id, { title, url, description }, { new: true });
      res.json({ category });
    } catch (error) {
      res.status(500).json({ message: 'Error updating category' });
    }
  });

  router.put('/collections/:id', async (req, res) => {
    const { name, description } = req.body;
    const { id } = req.params;
    const updateData = { name, description };
  
    if (req.file) {
      updateData.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }
  
    try {
      const collection = await Collection.findByIdAndUpdate(id, updateData, { new: true });
      res.json({ collection });
    } catch (error) {
      res.status(500).json({ message: 'Error updating collection' });
    }
  });

export default router;