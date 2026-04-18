FROM node:18-alpine

WORKDIR /app

# Cài đặt dependencies trước để tận dụng Docker Cache
COPY package*.json ./
RUN npm install

# Copy toàn bộ mã nguồn backend
COPY . .

# Tạo thư mục uploads và logs nếu chưa có
RUN mkdir -p uploads logs

# Mở port 5000 (khớp với PORT trong env.example)
EXPOSE 5000

# Chạy server dựa trên script trong package.json
CMD ["npm", "start"]