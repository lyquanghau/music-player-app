const mongoose = require('mongoose');

// Đảm bảo dotenv được cấu hình trước khi dùng process.env
require('dotenv').config();

// Lấy URI từ file .env
const MONGODB_URI = process.env.MONGODB_URI;

// Kiểm tra xem MONGODB_URI có được định nghĩa không
if (!MONGODB_URI) {
    console.error('MONGODB_URI không được định nghĩa trong file .env. Vui lòng kiểm tra lại!');
    process.exit(1);
}

async function connectToMongoDB() {
    try {
        await mongoose.connect(MONGODB_URI, {
            ssl: true, // Bật SSL để kết nối với Atlas
            tlsCAFile: undefined // Tùy chọn, có thể bỏ qua nếu Atlas tự xử lý
        });
        console.log('Kết nối MongoDB Atlas thành công!');
    } catch (error) {
        console.error('Lỗi kết nối MongoDB:', error);
    } finally {
        mongoose.connection.close();
    }
}

connectToMongoDB();