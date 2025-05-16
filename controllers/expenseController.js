import { Category, Expense } from "../models/index.js";

const addExpense = async(req, res)=>{
    try {
        const {title, amount, category, type, date} = req.body;

        if( !title || !amount || !type || !category ){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const existedCategory = await Category.findOne({
            _id: category,
            $or: [
                {user: req.userId},
                {user: null}
            ]
        })

        if(!existedCategory){
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        const expense = await Expense.create({
            user: req.userId,
            title,
            amount,
            category: existedCategory._id,
            type,
            date,
        });

        const populatedExpense = await Expense.findById(expense._id).populate("category", 'name type');

        if(populatedExpense){
            return res.status(201).json({
                success: true,
                message: "Expense added successfully",
                expense: populatedExpense,
            })
        }

        
            
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add expense",
            error: error.message,
        })
    }
}

const getExpenseByUser = async(req, res)=>{
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        // Sorting parameters
        const sortBy = req.query.sortBy || 'date';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder;
        
        // Count total documents for pagination metadata
        const totalExpenses = await Expense.countDocuments({user: req.userId});
        
        // Get expenses with pagination, sorting, and populate category
        const expenses = await Expense.find({user: req.userId})
            .populate('category', 'name type')
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);

        // Calculate pagination metadata
        const totalPages = Math.ceil(totalExpenses / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return res.status(200).json({
            success: true,
            message: "Expenses fetched successfully",
            expenses,
            pagination: {
                totalExpenses,
                totalPages,
                currentPage: page,
                limit,
                hasNextPage,
                hasPrevPage
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to get expenses",
            error: error.message,
        });
    }
}

const getExpenseById = async(req, res)=>{
    try {
        const expense = await Expense.findById(req.params.id);

        if(!expense){
            return res.status(404).json({
                success: false,
                message: "Expense not found",
            })
        }

        if(expense.user.toString() !== req.userId){
            return res.status(403).json({
                success: false,
                message: "You are not authorized to access this expense",
                error: "Unauthorized",
            })
        }

        return res.status(200).json({
            success: true,
            message: "Expense fetched successfully",
            expense,
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to get expense",
            error: error.message,
        })
    }
}

const getUserExpenseByType = async(req, res)=>{
    try {
        const {type} = req.query;

        if(!type){
            return res.status(400).json({
                success: false,
                message: "Type is required",
            });
        }

        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        // Sorting parameters
        const sortBy = req.query.sortBy || 'date';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder;
        
        // Count total documents for pagination metadata
        const totalExpenses = await Expense.countDocuments({user: req.userId, type});
        
        // Get expenses with pagination, sorting, and populate category
        const expenses = await Expense.find({user: req.userId, type})
            .populate('category', 'name type')
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);
            
        // Calculate pagination metadata
        const totalPages = Math.ceil(totalExpenses / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return res.status(200).json({
            success: true,
            message: "Expenses fetched successfully",
            expenses,
            pagination: {
                totalExpenses,
                totalPages,
                currentPage: page,
                limit,
                hasNextPage,
                hasPrevPage
            }
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to get expenses by type",
            error: error.message,
        });
    }
}

const getExpenseByCategory = async(req, res)=>{
    try {
        const {category} = req.query;

        if(!category){
            return res.status(400).json({
                success: false,
                message: "Category is required",
            });
        }
        
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        // Sorting parameters
        const sortBy = req.query.sortBy || 'date';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder;
        
        // Count total documents for pagination metadata
        const totalExpenses = await Expense.countDocuments({user: req.userId, category});
        
        // Get expenses with pagination, sorting, and populate category
        const expenses = await Expense.find({user: req.userId, category})
            .populate('category', 'name type')
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);
            
        // Calculate pagination metadata
        const totalPages = Math.ceil(totalExpenses / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return res.status(200).json({
            success: true,
            message: "Expenses fetched successfully",
            expenses,
            pagination: {
                totalExpenses,
                totalPages,
                currentPage: page,
                limit,
                hasNextPage,
                hasPrevPage
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to get expenses by category",
            error: error.message,
        });
    }
}

const getExpenseByDateRange = async(req, res)=>{
    try {
        const {startDate, endDate} = req.query;

        if(!startDate || !endDate){
            return res.status(400).json({
                success: false,
                message: "Start date and end date are required",
                error: "Invalid date range",
            });
        }
        
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        // Sorting parameters
        const sortBy = req.query.sortBy || 'date';
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
        
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder;
        
        const query = {
            user: req.userId,
            date: {
                $gte: new Date(startDate),
                $lte: new Date(endDate),
            }
        };
        
        // Count total documents for pagination metadata
        const totalExpenses = await Expense.countDocuments(query);
        
        // Get expenses with pagination, sorting, and populate category
        const expenses = await Expense.find(query)
            .populate('category', 'name type')
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);
            
        // Calculate pagination metadata
        const totalPages = Math.ceil(totalExpenses / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        return res.status(200).json({
            success: true,
            message: "Expenses fetched successfully",
            expenses,
            pagination: {
                totalExpenses,
                totalPages,
                currentPage: page,
                limit,
                hasNextPage,
                hasPrevPage
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to get expenses by date",
            error: error.message,
        });
    }
}

const updateExpense = async(req, res)=>{
    try {
        // Defensive check for req.body
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No update data provided",
            });
        }

        const expenseId = req.params.id;

        const expense = await Expense.findById(expenseId);

        if(!expense){
            return res.status(404).json({
                success: false,
                message: "Expense not found",
            });
        }

        if(expense.user.toString() !== req.userId){
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this expense",
                error: "Unauthorized",
            });
        }

        // Check and update each field individually using safe property access
        if(req.body.category){
            const existedCategory = await Category.findOne({
                _id: req.body.category,
                $or: [
                    {user: req.userId},
                    {user: null}
                ]
            });

            if(!existedCategory){
                return res.status(404).json({
                    success: false,
                    message: "Category not found",
                });
            }

            expense.category = existedCategory._id;   
        }

        if(req.body.title !== undefined) expense.title = req.body.title;
        if(req.body.amount !== undefined) expense.amount = req.body.amount;
        if(req.body.type !== undefined) expense.type = req.body.type;
        if(req.body.date !== undefined) expense.date = req.body.date;

        // Only run save if at least one field was changed
        await expense.save();
        
        // Populate the category details for better response
        const updatedExpense = await Expense.findById(expense._id).populate("category", "name type");
        
        return res.status(200).json({
            success: true,
            message: "Expense updated successfully",
            expense: updatedExpense,
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to update expense",
            error: error.message,
        })
    }
}

const deleteExpense = async(req, res)=>{
    try {
        const expenseId = req.params.id;

        const expense = await Expense.findOneAndDelete({_id: expenseId, user: req.userId});

        if(!expense){
            return res.status(404).json({
                success: false,
                message: "Expense not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Expense deleted successfully",
            expense,
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete expense",
            error: error.message,
        })
    }
}

const ExpenseController = {
    addExpense,
    getExpenseByUser,
    getExpenseById,
    getUserExpenseByType,
    getExpenseByCategory,
    getExpenseByDateRange,
    updateExpense,
    deleteExpense,
}

export default ExpenseController;
