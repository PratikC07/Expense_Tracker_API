import express from "express";
import { AuthController } from "../controllers/index.js";
import { validationMiddleware } from "../middlewares/index.js";
const router = express.Router();

router.post("/signup", validationMiddleware.validateSignup, AuthController.signup);
router.post("/login", validationMiddleware.validateLogin, AuthController.login);

export default router;