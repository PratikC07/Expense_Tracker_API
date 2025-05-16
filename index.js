import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { authRoutes, categoryRoutes, expenseRoutes } from "./routes/index.js";
import { seedCategories } from "./utils/index.js";
import { notFound, errorHandler } from "./middlewares/index.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "*",
    credentials: true,
}));
app.use(cookieParser());

connectDB().then(()=>{
    seedCategories();
});

app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/expense", expenseRoutes);

app.get("/", (req, res)=>{
    res.send("Expense Tracker API is running...");
})

app.use(notFound);
app.use(errorHandler);

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
})