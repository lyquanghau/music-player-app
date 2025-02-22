# Sử dụng image Node.js phiên bản 16
FROM node:16

# Thiết lập thư mục làm việc trong container
WORKDIR /app

# Sao chép package.json và package-lock.json vào container
COPY package.json package-lock.json ./

# Cài đặt dependencies
RUN npm install

# Sao chép toàn bộ code từ local vào container
COPY . .

# Mở port 8404 (port mà Express.js đang dùng)
EXPOSE 8404

# Chạy ứng dụng
CMD ["node", "index.js"]