import Joi from 'joi';
import { isProfane, loadDictionary, add } from 'leo-profanity';

loadDictionary(); // Load mặc định

add(['địt', 'lồn', 'cặc', 'đụ', 'bú', 'dcm', 'dm', 'đm']); // tuỳ ý mở rộng danh sách từ cấm

const reviewSchema = Joi.object({
    product_id: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Invalid product ID format',
            'string.empty': 'Product ID is required'
        }),

    user_id: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Invalid user ID format',
            'string.empty': 'User ID is required'
        }),

    rating: Joi.number()
        .integer()
        .min(1)
        .max(5)
        .required()
        .messages({
            'number.base': 'Rating must be a number',
            'number.integer': 'Rating must be an integer',
            'number.min': 'Rating must be at least 1',
            'number.max': 'Rating cannot exceed 5',
            'number.empty': 'Rating is required'
        }),

    comment: Joi.string()
        .min(1)
        .max(1000)
        .required()
        .messages({
            'string.empty': 'Comment is required',
            'string.min': 'Comment must be at least 1 character',
            'string.max': 'Comment cannot exceed 1000 characters'
        }),

    images: Joi.array()
        .items(
            Joi.string()
                .uri()
                .messages({
                    'string.uri': 'Invalid image URL format'
                })
        )
        .max(5)
        .messages({
            'array.max': 'Cannot upload more than 5 images'
        })
});

export const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body, { abortEarly: false });
    const cleanComment = leoProfanity.clean(comment); // tự động gắn dấu ***

    const errors = [];

    // Lấy comment để kiểm tra từ ngữ không phù hợp
    const { comment } = req.body;

    // Joi validation errors
    if (error) {
        errors.push(
            ...error.details.map(detail => ({
                field: detail.context.key,
                message: detail.message
            }))
        );
    }

    // Check profanity
    if (comment && isProfane(comment)) {
        errors.push({
            field: 'comment',
            message: 'Comment contains inappropriate language'
        });
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    req.body.comment = cleanComment; // Gán lại comment đã được làm sạch
    next();
};
