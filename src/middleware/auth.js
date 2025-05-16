/**
 * Middleware xác thực người dùng
 * @module middleware/auth
 * 
 * Chức năng:
 * 1. Kiểm tra token trong header
 * 2. Xác thực token và giải mã
 * 3. Kiểm tra user trong database
 * 4. Gắn thông tin user vào request
 */
import userSchema from "../models/auth"
import jwt from "jsonwebtoken";

/**
 * Middleware xác thực JWT
 * 
 * Quy trình xử lý:
 * 1. Lấy token từ header Authorization
 * 2. Kiểm tra tồn tại của token
 * 3. Giải mã token để lấy thông tin user
 * 4. Tìm user trong DB và gắn vào request
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware
 */
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(404).json({ message: "Không tìm thấy token xác thực" });
        }

        const decoded = jwt.verify(token, "nghiant");
        const user = await userSchema.findById(decoded.id).select("-password");
        
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

export default authMiddleware;