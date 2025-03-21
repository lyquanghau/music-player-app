# Music Player Backend

Đây là backend cho ứng dụng nghe nhạc, cho phép người dùng tìm kiếm video trên YouTube, lưu lịch sử tìm kiếm, tạo playlist cá nhân và nhận gợi ý video. Backend sử dụng Node.js, Express, MongoDB và YouTube Data API v3.

## Yêu cầu cài đặt
- Node.js (v14 trở lên)
- Tài khoản MongoDB Atlas hoặc MongoDB cài trên máy
- API Key từ YouTube Data API v3

## Cài đặt

1. Clone repository:
```bash
git clone <repository-url>
cd music-player-app/backend
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Tạo file `.env` trong thư mục backend với nội dung:
```text
MONGO_URI=<your-mongodb-uri>
YOUTUBE_API_KEY=<your-youtube-api-key>
PORT=8404
```

### Hướng dẫn lấy YouTube API Key:
- Truy cập [Google Cloud Console](https://console.cloud.google.com/).
- Tạo project mới.
- Bật API "YouTube Data API v3" trong mục APIs & Services.
- Vào Credentials → Create Credentials → API Key và copy key vào file `.env`.

## Chạy server

```bash
npm start
```

Server chạy mặc định tại: `http://localhost:8404`

*Nếu dùng nodemon (tự khởi động lại khi file thay đổi):*
```bash
npm install -g nodemon
nodemon index.js
```

## Các API endpoint

**Lưu ý**: tất cả endpoints bắt đầu bằng `/api`

1. **Tìm kiếm video**
   - **GET** `/api/search?q=<từ khóa>`

2. **Lấy lịch sử tìm kiếm**
   - **GET** `/api/history`

3. **Xóa lịch sử tìm kiếm**
   - **DELETE** `/api/history`

4. **Tạo playlist cá nhân**
   - **POST** `/api/custom-playlists`
   ```json
   {
     "name": "Nhạc chill",
     "videos": ["dQw4w9WgXcQ"]
   }
   ```

5. **Lấy danh sách playlist**
   - **GET** `/api/custom-playlists`

6. **Thêm video vào playlist**
   - **POST** `/api/custom-playlists/:id/add-video`
   ```json
   {
     "videoId": "abc123"
   }
   ```

7. **Gợi ý video liên quan**
   - **GET** `/api/recommend?videoId=<videoId>`

## Ghi chú
- YouTube API giới hạn 10,000 đơn vị/ngày.
- Mỗi lần gọi API `/search` hoặc `/recommend` tiêu tốn 100 đơn vị.

