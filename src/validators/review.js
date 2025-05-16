/**
 * Module xử lý kiểm tra và làm sạch đánh giá sản phẩm
 * @module validators/review
 * 
 * Chức năng chính:
 * 1. Kiểm tra tính hợp lệ của dữ liệu đánh giá
 * 2. Lọc và thay thế các từ ngữ không phù hợp
 * 3. Đảm bảo định dạng chuẩn trước khi lưu vào DB
 */
import Joi from 'joi';
import Filter from 'leo-profanity';

// Khởi tạo bộ lọc từ ngữ không phù hợp
Filter.loadDictionary(); // Tải bộ từ điển mặc định
// Thêm danh sách từ cấm tiếng Việt
Filter.add(['địt', 'lồn', 'cặc', 'đụ', 'bú', 'dcm', 'dm', 'đm']); 

/**
 * Schema kiểm tra dữ liệu đánh giá
 * @constant {Object} reviewSchema
 * 
 * Các trường dữ liệu:
 * - product_id: ID sản phẩm (định dạng ObjectId MongoDB)
 * - user_id: ID người dùng (định dạng ObjectId MongoDB)
 * - rating: Số sao đánh giá (1-5)
 * - comment: Nội dung đánh giá (1-1000 ký tự)
 * - images: Danh sách URL ảnh (tối đa 5 ảnh)
 */
const reviewSchema = Joi.object({
    product_id: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Định dạng ID sản phẩm không hợp lệ',
            'string.empty': 'ID sản phẩm không được để trống'
        }),

    user_id: Joi.string()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .required()
        .messages({
            'string.pattern.base': 'Định dạng ID người dùng không hợp lệ',
            'string.empty': 'ID người dùng không được để trống'
        }),

    rating: Joi.number()
        .integer()
        .min(1)
        .max(5)
        .required()
        .messages({
            'number.base': 'Đánh giá phải là số',
            'number.integer': 'Đánh giá phải là số nguyên',
            'number.min': 'Đánh giá phải từ 1 sao trở lên',
            'number.max': 'Đánh giá không được quá 5 sao',
            'number.empty': 'Vui lòng cho điểm đánh giá'
        }),

    comment: Joi.string()
        .min(1)
        .max(1000)
        .required()
        .messages({
            'string.empty': 'Nội dung đánh giá không được để trống',
            'string.min': 'Nội dung đánh giá phải có ít nhất 1 ký tự',
            'string.max': 'Nội dung đánh giá không được vượt quá 1000 ký tự'
        }),

    images: Joi.array()
        .items(
            Joi.string()
                .uri()
                .messages({
                    'string.uri': 'Định dạng URL ảnh không hợp lệ'
                })
        )
        .max(5)
        .messages({
            'array.max': 'Không được tải lên quá 5 ảnh'
        })
});

/**
 * Middleware kiểm tra và làm sạch dữ liệu đánh giá
 * @function validateReview
 * 
 * Quy trình xử lý:
 * 1. Kiểm tra cấu trúc dữ liệu theo schema
 * 2. Kiểm tra nội dung comment có từ cấm
 * 3. Làm sạch comment nếu cần
 * 4. Chuyển tiếp hoặc trả về lỗi
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 * @returns {void}
 */
export const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body, { abortEarly: false });
    const errors = [];

    // Get comment from request body
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
    if (comment && Filter.isProfane(comment)) {
        errors.push({
            field: 'comment',
            message: 'Nội dung chứa từ ngữ không phù hợp'
        });
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    // Clean the comment
    req.body.comment = Filter.clean(comment);
    next();
};
