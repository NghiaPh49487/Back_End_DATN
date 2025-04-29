export const validateProduct = (req, res, next) => {
    const { name, categoryId, price, sizes, colors, brand, images, description } = req.body;
    
    if (!name || !categoryId || !price || !sizes || !colors || !brand || !images || !description) {
        return res.status(400).json({
            message: "All required fields must be provided"
        });
    }

    if (price < 0) {
        return res.status(400).json({
            message: "Price must be greater than 0"
        });
    }

    if (!Array.isArray(sizes) || !Array.isArray(colors) || !Array.isArray(images)) {
        return res.status(400).json({
            message: "Sizes, colors and images must be arrays"
        });
    }

    if (images.length === 0) {
        return res.status(400).json({
            message: "At least one image is required"
        });
    }

    next();
};
