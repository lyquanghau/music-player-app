# Nhật ký tiến độ — Music Streaming Website

## 2026-11-20 — Khôi phục dự án và sửa luồng nghe nhạc

**Trạng thái bàn giao:** Stage 1 đang chờ nghiệm thu. Một số thay đổi thuộc Stage 2–4 đã có trong working tree và chưa commit.

| Hạng mục | Thay đổi đã có trong mã nguồn |
|---|---|
| Khởi động backend | Chờ MongoDB trước khi mở cổng, thêm `GET /ready`, tách job trending khỏi startup, thêm fixture cho DB thử nghiệm và cập nhật hướng dẫn Docker/Node 22. |
| Player | Sửa callback thời lượng, queue khi phát bài đơn, shuffle và hành vi cuối queue. Tách engine nghe nhạc khi mở MV. |
| Phiên và tìm kiếm | Đồng bộ logout với auth state và player, xử lý 401, bổ sung username vào JWT mới. Kết nối lịch sử tìm kiếm, hỗ trợ xóa từng mục và bỏ qua kết quả tìm kiếm đến muộn. |
| Playlist và bảo mật | Bổ sung đổi tên, xóa playlist, bỏ bài và bật/tắt chia sẻ trên Home. Cập nhật danh sách bài nguyên tử, mặc định playlist riêng tư, bỏ mật khẩu seed cố định và giới hạn tần suất auth/search. |

### Kết quả kiểm tra

- Đã kiểm tra cú pháp 21 file backend và 48 file frontend. `git diff --check` đạt.
- Unit test giới hạn tần suất đạt khi chạy trong thư mục `backend` bằng `node --test --experimental-test-isolation=none tests/rateLimit.test.js`. Lần chạy với tiến trình test riêng gặp `spawn EPERM`.
- Cài dependency còn bị chặn. `npm ci --offline` thiếu gói trong cache và npm registry trả `ECONNREFUSED`. Chưa xác minh production build, kết nối MongoDB, phát YouTube thật hay luồng đầu cuối. Chưa chạy migration hoặc ghi fixture vào DB.

### Điểm bắt đầu cho buổi tiếp theo

1. Chạy `npm ci` ở cả `backend` và `frontend` trong môi trường truy cập được registry. Dùng MongoDB thử nghiệm theo [hướng dẫn backend](backend/README.md).
2. Kiểm tra `GET /ready`, tải Home với snapshot mẫu, rồi chạy test và production build frontend.
3. Trên trình duyệt, kiểm tra đăng ký → tìm bài → phát/tạm dừng/tua → lưu playlist → tải lại → đăng xuất. Dùng tài khoản thứ hai để kiểm tra quyền truy cập playlist riêng. Ghi kết quả thực tế vào nhật ký.

Các hạng mục còn mở gồm hồ sơ, thư viện đồng bộ, lịch sử nghe, catalog nghệ sĩ/album, admin, upload audio và triển khai staging.

## Mẫu cập nhật cho các buổi sau

Thêm một mục mới theo ngày và giữ lại các mục trước đó.

- **Ngày và mục tiêu:**
- **Thay đổi đã thực hiện:**
- **Đã kiểm tra:** lệnh hoặc luồng sử dụng, kết quả quan sát được.
- **Còn vướng hoặc chưa xác minh:**
- **Bước tiếp theo:**
