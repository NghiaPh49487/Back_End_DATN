import Joi from 'joi';
import Category from '../models/category'; // Đảm bảo import model Category

const categorySchema = Joi.object({
    category_id: Joi.string()
        .required()
        .messages({
            'string.empty': 'Category ID is required'
        }),
    
    name: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.empty': 'Category name is required',
            'string.min': 'Category name must be at least 2 characters',
            'string.max': 'Category name cannot exceed 50 characters'
        }),
    
    description: Joi.string()
        .max(500)
        .messages({
            'string.max': 'Description cannot exceed 500 characters'
        }),
    
    image_logo: Joi.string()
        .uri()
        .messages({
            'string.uri': 'Invalid image URL format'
        })
});

export const validateCategory = async (req, res, next) => {
    try {
        // Kiểm tra cấu trúc dữ liệu với Joi
        const { error } = categorySchema.validate(req.body, { abortEarly: false });
        
        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.context.key,
                message: detail.message
            }));
            return res.status(400).json({ errors });
        }
        
        // Kiểm tra tên category có trùng lặp không
        const existingCategoryByName = await Category.findOne({ 
            name: { $regex: new RegExp(`^${req.body.name}$`, 'i') } // Case insensitive search
        });
        
        // Nếu đang tạo mới (không có id) và tìm thấy category trùng tên
        if (!req.params.id && existingCategoryByName) {
            return res.status(400).json({ 
                errors: [{ 
                    field: 'name', 
                    message: 'Category name already exists' 
                }] 
            });
        }
        
        // Nếu đang cập nhật (có id) và tìm thấy category trùng tên nhưng không phải category hiện tại
        if (req.params.id && existingCategoryByName && existingCategoryByName._id.toString() !== req.params.id) {
            return res.status(400).json({ 
                errors: [{ 
                    field: 'name', 
                    message: 'Category name already exists' 
                }] 
            });
        }
        
        // Kiểm tra category_id có trùng lặp không
        const existingCategoryById = await Category.findOne({ 
            category_id: req.body.category_id 
        });
        
        // Nếu đang tạo mới (không có id) và tìm thấy category trùng category_id
        if (!req.params.id && existingCategoryById) {
            return res.status(400).json({ 
                errors: [{ 
                    field: 'category_id', 
                    message: 'Category ID already exists' 
                }] 
            });
        }
        
        // Nếu đang cập nhật (có id) và tìm thấy category trùng category_id nhưng không phải category hiện tại
        if (req.params.id && existingCategoryById && existingCategoryById._id.toString() !== req.params.id) {
            return res.status(400).json({ 
                errors: [{ 
                    field: 'category_id', 
                    message: 'Category ID already exists' 
                }] 
            });
        }
        
        next();
    } catch (error) {
        console.error('Category validation error:', error);
        return res.status(500).json({ 
            message: 'Error validating category data',
            error: error.message 
        });
    }
};