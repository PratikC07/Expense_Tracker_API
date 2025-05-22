import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authRoutes, categoryRoutes, expenseRoutes, analyticsRoutes } from "./routes/index.js";
import { seedCategories, logger, swaggerSetup } from "./utils/index.js";
import { notFound, errorHandler } from "./middlewares/index.js";
import { StatusCodes } from "http-status-codes";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.CORS_ORIGIN || "*",
    credentials: true,
}));
app.use(cookieParser());

connectDB().then(()=>{
    seedCategories();
}).catch(err => {
    logger.error('Failed to connect to database:', err);
    process.exit(1);
});

app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/expense", expenseRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/", (req, res)=>{
    res.status(StatusCodes.OK).json({
        message: "Expense Tracker API is running",
        documentation: "/api-docs",
    });
});

// Swagger API Documentation
swaggerSetup(app);

app.use(notFound);
app.use(errorHandler);

app.listen(port, ()=>{
    logger.info(`Server is running on port ${port}`);
})