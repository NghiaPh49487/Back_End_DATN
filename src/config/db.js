/**
 * Module kết nối MongoDB
 * Sử dụng Mongoose để quản lý kết nối và tương tác với database
 * 
 * @param {string} dbUrl - URL kết nối đến MongoDB server
 * Ví dụ: mongodb://localhost:27017/database_name
 */
import mongoose from "mongoose";

export default async function connectDB(dbUrl) {
    try {
        // Thiết lập kết nối với MongoDB
        await mongoose.connect(dbUrl);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log("MongoDB connection failed", error);
        // Trong môi trường production nên xử lý lỗi kỹ hơn
        // Ví dụ: ghi log, thông báo cho admin, retry connection
    }
}