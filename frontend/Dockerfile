# Stage 1: Build với Node
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build ứng dụng
RUN npm run build

# Stage 2: Serve bằng Nginx
FROM nginx:alpine

# Copy build files từ stage 1
COPY --from=builder /app/build /usr/share/nginx/html

# Copy nginx configuration (nếu có)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
