import Joi from 'joi';

const stockSchema = Joi.object({
    variant_id: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Invalid variant ID format',
            'string.empty': 'Variant ID is required'
        }),
    
    quantity: Joi.number()
        .integer()
        .min(1)
        .required()
        .messages({
            'number.base': 'Quantity must be a number',
            'number.integer': 'Quantity must be an integer',
            'number.min': 'Quantity must be at least 1',
            'number.empty': 'Quantity is required'
        }),
    
    type: Joi.string()
        .valid('in', 'out')
        .required()
        .messages({
            'any.only': 'Type must be either "in" or "out"',
            'string.empty': 'Type is required'
        }),
    
    reason: Joi.string()
        .max(200)
        .required()
        .messages({
            'string.empty': 'Reason is required',
            'string.max': 'Reason cannot exceed 200 characters'
        }),
    
    note: Joi.string()
        .max(500)
        .allow('', null)
        .messages({
            'string.max': 'Note cannot exceed 500 characters'
        })
});

export const validateStock = (req, res, next) => {
    const { error } = stockSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.context.key,
            message: detail.message
        }));
        return res.status(400).json({ errors });
    }
    
    next();
};