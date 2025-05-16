import mongoose from 'mongoose';
import Product from "../models/product";

/**
 * Controller xử lý các thao tác liên quan đến sản phẩm
 * Bao gồm các chức năng: lấy danh sách, chi tiết, tạo mới, cập nhật, xóa và lấy variants
 */

/**
 * Lấy danh sách tất cả sản phẩm với các tùy chọn lọc và phân trang
 * @param {Object} req.query Các tham số truy vấn
 * - page: Số trang hiện tại (mặc định: 1)
 * - limit: Số sản phẩm trên mỗi trang (mặc định: 10)
 * - category: Lọc theo danh mục
 * - search: Tìm kiếm theo tên sản phẩm
 * - sku: Lọc theo mã SKU của biến thể
 * - minPrice: Giá tối thiểu
 * - maxPrice: Giá tối đa
 * @returns Danh sách sản phẩm đã được lọc và phân trang
 */
export const getAllProduct = async (req, res) => {
    try {
        // Lấy các tham số từ query string với giá trị mặc định
        const { 
            page = 1, 
            limit = 10, 
            category, 
            search,
            sku,
            minPrice,
            maxPrice 
        } = req.query;
        
        // Khởi tạo object chứa các điều kiện tìm kiếm
        let query = {};
        
        // Thêm điều kiện tìm theo category nếu có
        if (category) {
            query.category = category;
        }

        // Thêm điều kiện tìm theo tên sản phẩm với regex không phân biệt hoa thường
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        // Cấu hình các tùy chọn phân trang và populate
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { createdAt: -1 }, // Sắp xếp mới nhất lên đầu
            populate: ['category', 'brand'] // Lấy thông tin category và brand
        };

        // Xử lý tìm kiếm theo biến thể
        let variantMatch = {};
        
        // Thêm điều kiện tìm theo SKU
        if (sku) {
            variantMatch.sku = { $regex: sku, $options: 'i' };
        }
        
        // Thêm điều kiện tìm theo khoảng giá
        if (minPrice || maxPrice) {
            variantMatch.price = {};
            if (minPrice) variantMatch.price.$gte = parseFloat(minPrice);
            if (maxPrice) variantMatch.price.$lte = parseFloat(maxPrice);
        }

        // Nếu có điều kiện lọc variant
        if (Object.keys(variantMatch).length > 0) {
            // Tìm tất cả variants thỏa mãn điều kiện
            const matchingVariants = await mongoose.model('Variant').find(variantMatch);
            const productIds = matchingVariants.map(v => v.product_id);
            
            // Thêm điều kiện lọc theo ID sản phẩm
            query._id = { $in: productIds };
        }

        // Thực hiện truy vấn với phân trang
        const products = await Product.paginate(query, options);

        // Populate thêm thông tin variants cho mỗi sản phẩm
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

        // Trả về kết quả với variants đã được populate
        return res.status(200).json({
            ...products,
            docs: populatedProducts
        });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm" });
    }
};

/**
 * Lấy thông tin chi tiết của một sản phẩm
 * @param {string} req.params.id ID của sản phẩm
 * @returns Thông tin sản phẩm bao gồm danh mục, thương hiệu và các biến thể
 */
export const getOneProduct = async (req, res) => {
    try {
        // Tìm sản phẩm theo ID và populate các thông tin liên quan
        const product = await Product.findById(req.params.id)
            .populate('category')  // Lấy thông tin danh mục
            .populate('brand')     // Lấy thông tin thương hiệu
            .populate('variants'); // Lấy thông tin các biến thể

        // Kiểm tra nếu không tìm thấy sản phẩm
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }

        // Trả về thông tin sản phẩm đầy đủ
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi lấy thông tin sản phẩm" });
    }
};

/**
 * Tạo sản phẩm mới
 * @param {Object} req.body Dữ liệu sản phẩm
 * - name: Tên sản phẩm
 * - description: Mô tả sản phẩm
 * - brand: ID thương hiệu
 * - category: ID danh mục
 * - gender: Giới tính (nam/nữ/unisex)
 * - variants: Mảng các biến thể của sản phẩm
 * @returns Sản phẩm đã được tạo kèm theo thông tin liên quan
 */
export const createProduct = async (req, res) => {
    try {
        // Tạo object dữ liệu sản phẩm từ request body
        const productData = {
            name: req.body.name,
            description: req.body.description,
            brand: req.body.brand,
            category: req.body.category,
            gender: req.body.gender,
            variants: req.body.variants || [] // Mặc định là mảng rỗng nếu không có variants
        };

        // Tạo sản phẩm mới trong database
        const product = await Product.create(productData);

        // Lấy thông tin sản phẩm vừa tạo với đầy đủ thông tin liên quan
        const populatedProduct = await Product.findById(product._id)
            .populate('category')
            .populate('brand')
            .populate('variants');

        // Trả về sản phẩm đã được tạo
        return res.status(201).json({
            message: "Tạo sản phẩm thành công",
            data: populatedProduct
        });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi tạo sản phẩm mới" });
    }
};

/**
 * Cập nhật thông tin sản phẩm
 * @param {string} req.params.id ID của sản phẩm cần cập nhật
 * @param {Object} req.body Dữ liệu cập nhật
 * - name: Tên sản phẩm
 * - description: Mô tả sản phẩm
 * - brand: ID thương hiệu
 * - category: ID danh mục
 * - gender: Giới tính
 * - variants: Mảng các biến thể cập nhật
 * @returns Sản phẩm sau khi cập nhật
 */
export const updateProduct = async (req, res) => {
    try {
        // Tạo object dữ liệu cập nhật từ request body
        const productData = {
            name: req.body.name,
            description: req.body.description,
            brand: req.body.brand,
            category: req.body.category,
            gender: req.body.gender,
            variants: req.body.variants || []
        };

        // Cập nhật sản phẩm và lấy thông tin mới
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            productData,
            { new: true } // Trả về document sau khi update
        )
        .populate('category')
        .populate('brand')
        .populate('variants');

        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }
        return res.status(200).json({
            message: "Cập nhật sản phẩm thành công",
            data: product
        });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi cập nhật sản phẩm" });
    }
};

/**
 * Lấy danh sách các biến thể của một sản phẩm
 * @param {string} req.params.id ID của sản phẩm
 * @returns Tên sản phẩm và danh sách các biến thể
 */
export const getProductVariants = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('variants');
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }
        return res.status(200).json({
            tenSanPham: product.name,
            bienThe: product.variants
        });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi lấy danh sách biến thể" });
    }
};

/**
 * Xóa một sản phẩm
 * @param {string} req.params.id ID của sản phẩm cần xóa
 * @returns Thông báo xóa thành công
 */
export const removeProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }
        // Xóa các variants liên quan
        await mongoose.model('Variant').deleteMany({ product_id: req.params.id });
        return res.status(200).json({ message: "Xóa sản phẩm thành công" });
    } catch (error) {
        return res.status(500).json({ message: "Lỗi khi xóa sản phẩm" });
    }
};