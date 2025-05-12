import Joi from 'joi';

const productSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Product name is required',
            'string.min': 'Product name must be at least 2 characters',
            'string.max': 'Product name cannot exceed 100 characters'
        }),
    
    description: Joi.string()
        .max(1000)
        .messages({
            'string.max': 'Description cannot exceed 1000 characters'
        }),
    
    brand: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Invalid brand ID format',
            'string.empty': 'Brand ID is required'
        }),
    
    category: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Invalid category ID format',
            'string.empty': 'Category ID is required'
        }),
    
    gender: Joi.string()
        .valid('unisex', 'male', 'female')
        .required()
        .messages({
            'any.only': 'Gender must be either unisex, male, or female',
            'string.empty': 'Gender is required'
        }),
    
    variants: Joi.array()
        .items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/))
        .min(1)
        .messages({
            'array.min': 'At least one variant is required',
            'string.pattern.base': 'Invalid variant ID format'
        })
});

export const validateProduct = (req, res, next) => {
    const { error } = productSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.context.key,
            message: detail.message
        }));
        return res.status(400).json({ errors });
    }
    
    next();
};