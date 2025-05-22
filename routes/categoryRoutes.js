import express from "express";
import { CategoryController } from "../controllers/index.js";
import { authMiddleware, validationMiddleware } from "../middlewares/index.js";

const router = express.Router();

router.get("/get-categories", authMiddleware.verifyToken,CategoryController.getCategories);
router.post("/add-category", authMiddleware.verifyToken, validationMiddleware.validateCreateCategory, CategoryController.addCategory);
router.delete("/delete-category/:id", authMiddleware.verifyToken, CategoryController.deleteCategory);
router.put("/update-category/:id", authMiddleware.verifyToken, validationMiddleware.validateUpdateCategory, CategoryController.updateCategory);


export default router;