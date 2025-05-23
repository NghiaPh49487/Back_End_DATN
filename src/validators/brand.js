import Joi from 'joi';
import Brand from '../models/brand'; // Đảm bảo import model Brand

const brandSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            'string.empty': 'Tên thương hiệu không được để trống',
            'string.min': 'Tên thương hiệu phải có ít nhất 2 ký tự',
            'string.max': 'Tên thương hiệu không được vượt quá 50 ký tự'
        }),
    
    description: Joi.string()
        .max(500)
        .messages({
            'string.max': 'Mô tả không được vượt quá 500 ký tự'
        })
});

export const validateBrand = async (req, res, next) => {
    try {
        // Kiểm tra cấu trúc dữ liệu với Joi
        const { error } = brandSchema.validate(req.body, { abortEarly: false });
        
        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.context.key,
                message: detail.message
            }));
            return res.status(400).json({ errors });
        }
        
        // Kiểm tra tên brand có trùng lặp không
        const existingBrand = await Brand.findOne({ 
            name: { $regex: new RegExp(`^${req.body.name}$`, 'i') } // Case insensitive search
        });
        
        // Nếu đang tạo mới (không có id) và tìm thấy brand trùng tên
        if (!req.params.id && existingBrand) {
            return res.status(400).json({ 
                errors: [{ 
                    field: 'name', 
                    message: 'Tên thương hiệu đã tồn tại' 
                }] 
            });
        }
        
        // Nếu đang cập nhật (có id) và tìm thấy brand trùng tên nhưng không phải brand hiện tại
        if (req.params.id && existingBrand && existingBrand._id.toString() !== req.params.id) {
            return res.status(400).json({ 
                errors: [{ 
                    field: 'name', 
                    message: 'Brand name already exists' 
                }] 
            });
        }
        
        next();
    } catch (error) {
        console.error('Brand validation error:', error);
        return res.status(500).json({ 
            message: 'Error validating brand data',
            error: error.message 
        });
    }
};