export const validateProduct = (req, res, next) => {
    const { name, categoryId, basePrice, brand, images, description } = req.body;
    
    if (!name || !categoryId || !basePrice || !brand || !images || !description) {
        return res.status(400).json({
            message: "All required fields must be provided"
        });
    }

    if (basePrice < 0) {
        return res.status(400).json({
            message: "Base price must be greater than 0"
        });
    }

    if (!Array.isArray(images)) {
        return res.status(400).json({
            message: "Images must be an array"
        });
    }

    if (images.length === 0) {
        return res.status(400).json({
            message: "At least one image is required"
        });
    }

    next();
};

export const validateVariant = (req, res, next) => {
    const { sku, color, size, price, stock } = req.body;

    if (!sku || !color || !size || !price) {
        return res.status(400).json({
            message: "All variant fields are required"
        });
    }

    if (price < 0) {
        return res.status(400).json({
            message: "Price must be greater than 0"
        });
    }

    if (stock < 0) {
        return res.status(400).json({
            message: "Stock must be greater than or equal to 0"
        });
    }

    next();
};