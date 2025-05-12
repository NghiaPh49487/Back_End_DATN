import Category from '../models/category.js';

export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        return res.status(200).json(categories);
    } catch (error) {
        return res.status(500).json({
            message: "Error getting categories",
            error: error.message
        });
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }
        return res.status(200).json(category);
    } catch (error) {
        return res.status(500).json({
            message: "Error getting category",
            error: error.message
        });
    }
};

export const createCategory = async (req, res) => {
    try {
        const category = await Category.create(req.body);
        return res.status(201).json({
            message: "Category created successfully",
            category
        });
    } catch (error) {
        return res.status(400).json({
            message: "Error creating category",
            error: error.message
        });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }
        return res.status(200).json({
            message: "Category updated successfully",
            category
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error updating category",
            error: error.message
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }
        return res.status(200).json({
            message: "Category deleted successfully",
            category
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error deleting category",
            error: error.message
        });
    }
};