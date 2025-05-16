import express from "express";
import { categoryController } from "../controllers/index.js";
import { authMiddleware } from "../middlewares/index.js";

const router = express.Router();

router.get("/get-categories", authMiddleware.verifyToken, categoryController.getCategories);
router.post("/add-category", authMiddleware.verifyToken, categoryController.addCategory);
router.delete("/delete-category/:id", authMiddleware.verifyToken, categoryController.deleteCategory);
router.put("/update-category/:id", authMiddleware.verifyToken, categoryController.updateCategory);


export default router;