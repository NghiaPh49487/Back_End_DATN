import Joi from 'joi';

const variantSchema = Joi.object({
    product_id: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Invalid product ID format',
            'string.empty': 'Product ID is required'
        }),
    
    sku: Joi.string()
        .required()
        .trim()
        .messages({
            'string.empty': 'SKU is required'
        }),
    
    color: Joi.string()
        .allow('')
        .optional()
        .messages({
            'string.base': 'Color must be a string'
        }),
    
    size: Joi.string()
        .allow('')
        .optional()
        .messages({
            'string.base': 'Size must be a string'
        }),
    
    image_url: Joi.string()
        .uri()
        .allow('')
        .optional()
        .messages({
            'string.uri': 'Invalid image URL format'
        }),
    
    price: Joi.number()
        .min(0)
        .allow(null)
        .optional()
        .messages({
            'number.base': 'Price must be a number',
            'number.min': 'Price cannot be negative'
        }),
    
    import_price: Joi.number()
        .min(0)
        .max(Joi.ref('price'))
        .allow(null)
        .optional()
        .messages({
            'number.base': 'Import price must be a number',
            'number.min': 'Import price cannot be negative',
            'number.max': 'Import price cannot be greater than selling price'
        })
});

export const validateVariant = (req, res, next) => {
    const { error } = variantSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.context.key,
            message: detail.message
        }));
        return res.status(400).json({ errors });
    }
    
    next();
};