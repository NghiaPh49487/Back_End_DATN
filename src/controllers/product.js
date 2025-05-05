import Product from "../models/product";

export const getAllProduct = async (req, res) => {
    try {
        const { page = 1, limit = 10, category } = req.query;
        const query = category ? { categoryId: category } : {};

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 },
            populate: 'categoryId'
        };

        const products = await Product.paginate(query, options);
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getOneProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('categoryId');
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const createProduct = async (req, res) => {
    try {
        const { variants, ...productData } = req.body;

        // Kiểm tra SKU trùng lặp
        if (variants && variants.length > 0) {
            const skus = variants.map(v => v.sku);
            const existingSku = await Product.findOne({
                'variants.sku': { $in: skus }
            });

            if (existingSku) {
                return res.status(400).json({
                    message: "One or more SKUs already exist"
                });
            }
        }

        // Tạo sản phẩm với variants
        const product = await Product.create({
            ...productData,
            variants: variants || []
        });

        return res.status(201).json(product);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const { variants, ...productData } = req.body;

        // Kiểm tra SKU trùng lặp (trừ SKUs của sản phẩm hiện tại)
        if (variants && variants.length > 0) {
            const skus = variants.map(v => v.sku);
            const existingSku = await Product.findOne({
                _id: { $ne: req.params.id },
                'variants.sku': { $in: skus }
            });

            if (existingSku) {
                return res.status(400).json({
                    message: "One or more SKUs already exist"
                });
            }
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                ...productData,
                variants: variants || []
            },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const removeProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
// Lấy tất cả variants của một sản phẩm
export const getProductVariants = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        return res.status(200).json({
            productName: product.name,
            variants: product.variants
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Lấy thông tin một SKU cụ thể
export const getVariantBySku = async (req, res) => {
    try {
        const { sku } = req.params;
        const product = await Product.findOne({ "variants.sku": sku });
        
        if (!product) {
            return res.status(404).json({ message: "SKU not found" });
        }

        const variant = product.variants.find(v => v.sku === sku);
        
        return res.status(200).json({
            productId: product._id,
            productName: product.name,
            variant: variant
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};