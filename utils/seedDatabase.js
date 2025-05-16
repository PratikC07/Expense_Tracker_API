// utils/seedData.js
import { Category } from "../models/index.js";

export const defaultCategories = [
    { name: "Food", type: "expense" },
    { name: "Transport", type: "expense" },
    { name: "Shopping", type: "expense" },
    { name: "Bills", type: "expense" },
    { name: "Other", type: "expense" },
    { name: "Salary", type: "income" },
    { name: "Freelance", type: "income" },
    { name: "Investment", type: "income" },
];

export const seedCategories = async () => {
    try {
        console.log("Seeding default categories...");
        for (const cat of defaultCategories) {
            await Category.findOneAndUpdate(
                { name: cat.name, user: null },
                cat,
                { upsert: true }
            );
        }
        console.log("Default categories seeded successfully");
    } catch (error) {
        console.error("Error seeding categories:", error);
    }
};

