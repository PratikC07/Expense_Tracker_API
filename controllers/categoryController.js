import { StatusCodes } from "http-status-codes";
import { Category, Expense } from "../models/index.js";
import categoryService from "../services/categoryService.js";
import { logger } from "../utils/logger.js";

const getCategories = async (req, res) => {
    try {
        const categories = await categoryService.getCategories(req.userId, req.query.type);

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Categories fetched successfully",
            categories,
        })

    } catch (error) {
        logger.error('Error in getCategories controller', error);
        const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

        res.status(statusCode).json({
            success: false,
            message: error.message || 'Error fetching categories',
        });
    }
}

const addCategory = async (req, res) => {
    try {
        // const { name, type } = req.body;


        // if (!name || !type) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "All fields are required",
        //     })
        // }


        // const existingCategory = await Category.findOne({
        //     name: { $regex: new RegExp(`^${name}$`, 'i') },
        //     $or: [
        //         { user: req.userId },
        //         { user: null }
        //     ]
        // })

        const category = await categoryService.createCategory(req.body, req.userId);

        return res.status(StatusCodes.CREATED).json({
            success: true,
            message: "Category added successfully",
            category,
        })

        // if (existingCategory) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Category already exists",
        //     })
        // }

        // const category = await Category.create({
        //     name: name,
        //     type,
        //     user: req.userId,
        // })

        // if (category) {
        //     return res.status(201).json({
        //         success: true,
        //         message: "Category added successfully",
        //         category,
        //     })
        // }

    } catch (error) {
        logger.error('Error in addCategory controller', error);
        const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

        return res.status(statusCode).json({
            success: false,
            message: error.message || 'Error adding category',
        })
    }
}

const updateCategory = async (req, res) => {
    try {
        // const { name, type } = req.body;

        // if (!name && !type) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Nothing to update",
        //     });
        // }

        // // First check if category exists and user has rights to modify it
        // const existingCategory = await Category.findOne({
        //     _id: req.params.id,
        //     user: req.userId, // Only allow updating user's own categories, not system ones
        // });

        // if (!existingCategory) {
        //     return res.status(404).json({
        //         success: false,
        //         message: "Category not found or cannot be modified",
        //     });
        // }

        // // Check if new name would conflict with existing category
        // if (name && name !== existingCategory.name) {
        //     const nameConflict = await Category.findOne({
        //         name: { $regex: new RegExp(`^${name}$`, 'i') },
        //         $or: [
        //             { user: req.userId },
        //             { user: null }
        //         ],
        //         _id: { $ne: req.params.id }
        //     });

        //     if (nameConflict) {
        //         return res.status(400).json({
        //             success: false,
        //             message: "Category name already exists",
        //         });
        //     }
        // }

        // const updatedCategory = await Category.findByIdAndUpdate(
        //     req.params.id,
        //     { name, type },
        //     { new: true }
        // );

        // return res.status(200).json({
        //     success: true,
        //     message: "Category updated successfully",
        //     category: updatedCategory,
        // });

        const category = await categoryService.updateCategory(req.params.id, req.body, req.userId);

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Category updated successfully",
            category,
        })

    } catch (error) {
        logger.error('Error in updateCategory controller', error);
        const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

        return res.status(statusCode).json({
            success: false,
            message: error.message || 'Error updating category',
        });
    }
}

const deleteCategory = async (req, res) => {
    try {
        // // Only allow deleting user's own categories, not system ones
        // const category = await Category.findOne({
        //     _id: req.params.id,
        //     user: req.userId,
        // });

        // if (!category) {
        //     return res.status(404).json({
        //         success: false,
        //         message: "Category not found or cannot be deleted",
        //     });
        // }

        // // Check if category is being used in any expenses
        // const expenseCount = await Expense.countDocuments({
        //     category: req.params.id,
        //     user: req.userId,
        // });

        // if (expenseCount > 0) {
        //     return res.status(400).json({
        //         success: false,
        //         message: `Cannot delete category. It is used in ${expenseCount} expense(s).`,
        //         expenseCount,
        //     });
        // }

        // await Category.findByIdAndDelete(req.params.id);

        // return res.status(200).json({
        //     success: true,
        //     message: "Category deleted successfully",
        // });

        const category = await categoryService.deleteCategory(req.params.id, req.userId);

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Category deleted successfully",
            category,
        })

    } catch (error) {
        logger.error('Error in deleteCategory controller', error);
        const statusCode = error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

        return res.status(statusCode).json({
            success: false,
            message: error.message || 'Error deleting category',
        });
    }
}

const categoryController = {
    getCategories,
    addCategory,
    updateCategory,
    deleteCategory,
}

export default categoryController;