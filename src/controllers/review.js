/**
 * Controllers xử lý các thao tác liên quan đến đánh giá sản phẩm
 * Bao gồm: xem đánh giá, thêm đánh giá mới, sửa và xóa đánh giá
 */

import Review from "../models/review";

/**
 * Lấy tất cả đánh giá của một sản phẩm
 * @param {string} req.params.productId ID của sản phẩm
 * Sắp xếp theo thời gian mới nhất và hiển thị tên người đánh giá
 */
export const getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ product_id: req.params.productId })
            .populate('user_id', 'username')
            .sort({ createdAt: -1 });
        return res.status(200).json(reviews);
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi khi lấy danh sách đánh giá",
            error: error.message
        });
    }
};

/**
 * Tạo đánh giá mới cho sản phẩm
 * @param {Object} req.body Thông tin đánh giá
 * - rating: Số sao đánh giá (1-5)
 * - comment: Nội dung đánh giá
 * - product_id: ID sản phẩm được đánh giá
 */
export const createReview = async (req, res) => {
    try {
        const { rating, comment, product_id } = req.body;
        const review = await Review.create({
            user_id: req.user._id,
            product_id,
            rating,
            comment
        });

        return res.status(201).json(review);
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi khi tạo đánh giá",
            error: error.message
        });
    }
};

/**
 * Cập nhật đánh giá
 * @param {string} req.params.id ID của đánh giá
 * @param {Object} req.body Thông tin cập nhật
 * Chỉ người tạo đánh giá mới được phép cập nhật
 */
export const updateReview = async (req, res) => {
    try {
        const review = await Review.findOneAndUpdate(
            {
                _id: req.params.id,
                user_id: req.user._id  // Đảm bảo chỉ người tạo mới được sửa
            },
            req.body,
            { new: true }
        );

        if (!review) {
            return res.status(404).json({
                message: "Không tìm thấy đánh giá hoặc không có quyền sửa"
            });
        }

        return res.status(200).json(review);
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi khi cập nhật đánh giá",
            error: error.message
        });
    }
};

/**
 * Xóa đánh giá
 * @param {string} req.params.id ID của đánh giá cần xóa
 * Chỉ người tạo đánh giá mới được phép xóa
 */
export const deleteReview = async (req, res) => {
    try {
        const review = await Review.findOneAndDelete({
            _id: req.params.id,
            user_id: req.user._id  // Đảm bảo chỉ người tạo mới được xóa
        });

        if (!review) {
            return res.status(404).json({
                message: "Không tìm thấy đánh giá hoặc không có quyền xóa"
            });
        }

        return res.status(200).json({
            message: "Xóa đánh giá thành công"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Lỗi khi xóa đánh giá",
            error: error.message
        });
    }
};
