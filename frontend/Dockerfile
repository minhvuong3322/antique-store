FROM node:18-alpine

WORKDIR /app

# Copy package.json và cài thư viện
COPY package*.json ./
RUN npm install

# Copy toàn bộ source code
COPY . .

# Mở port của Vite
EXPOSE 5173

# Chạy Vite ở chế độ dev
CMD ["npm", "run", "dev"]