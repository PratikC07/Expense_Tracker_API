import User from "./user.js";
import Expense from "./expense.js";
import Category from "./category.js";

export { User, Expense, Category };

const defaultCategories = [
    { name: "Food", type: "expense" },
    { name: "Transport", type: "expense" },
    { name: "Shopping", type: "expense" },
    { name: "Bills", type: "expense" },
    { name: "Other", type: "both" },
    { name: "Salary", type: "income" },
    { name: "Freelance", type: "income" },
    { name: "Investment", type: "income" },
];

const seedCategories = async () => {
    for (const cat of defaultCategories) {
        await Category.findOneAndUpdate(
            { name: cat.name, user: null },
            cat,
            { upsert: true }
        );
    }
};

