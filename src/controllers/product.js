import Product from "../models/product";

export const getAllProduct = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            category, 
            search,
            sku,
            minPrice,
            maxPrice 
        } = req.query;
        
        let query = {};
        
        // Tìm theo category nếu có
        if (category) {
            query.category = category;
        }

        // Tìm theo tên sản phẩm nếu có
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 },
            populate: ['category', 'brand']
        };

        // Thêm điều kiện tìm kiếm theo biến thể (SKU và khoảng giá)
        let variantMatch = {};
        
        if (sku) {
            variantMatch.sku = { $regex: sku, $options: 'i' };
        }
        
        if (minPrice || maxPrice) {
            variantMatch.price = {};
            if (minPrice) variantMatch.price.$gte = parseFloat(minPrice);
            if (maxPrice) variantMatch.price.$lte = parseFloat(maxPrice);
        }

        // Nếu có điều kiện tìm kiếm variant
        if (Object.keys(variantMatch).length > 0) {
            // Tìm tất cả variants thỏa mãn điều kiện
            const matchingVariants = await mongoose.model('Variant').find(variantMatch);
            const productIds = matchingVariants.map(v => v.product_id);
            
            // Thêm điều kiện product_id vào query
            query._id = { $in: productIds };
        }

        const products = await Product.paginate(query, options);

        // Populate variants cho mỗi sản phẩm
        const populatedProducts = await Promise.all(
            products.docs.map(async (product) => {
                const variants = await mongoose.model('Variant')
                    .find({ product_id: product._id })
                    .select('sku color size price image_url');
                return {
                    ...product.toObject(),
                    variants
                };
            })
        );

        return res.status(200).json({
            ...products,
            docs: populatedProducts
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getOneProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category')
            .populate('brand')
            .populate('variants');
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
        const productData = {
            name: req.body.name,
            description: req.body.description,
            brand: req.body.brand,
            category: req.body.category,
            gender: req.body.gender,
            variants: req.body.variants || []
        };

        const product = await Product.create(productData);

        const populatedProduct = await Product.findById(product._id)
            .populate('category')
            .populate('brand')
            .populate('variants');

        return res.status(201).json(populatedProduct);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const productData = {
            name: req.body.name,
            description: req.body.description,
            brand: req.body.brand,
            category: req.body.category,
            gender: req.body.gender,
            variants: req.body.variants || []
        };

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            productData,
            { new: true }
        ).populate('category')
            .populate('brand')
            .populate('variants');

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
        const product = await Product.findById(req.params.id).populate('variants');
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