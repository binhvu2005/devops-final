# 🚀 Quick Start Guide

## Bước nhanh để bắt đầu

### 1. Đổi tên folder (5 phút)

Đổi tên folder theo format: `HN_KS25[Tên Lớp]_[Tên Sinh Viên]_[Mã Đề]`

Xem chi tiết: [RENAME_FOLDER.md](RENAME_FOLDER.md)

### 2. Push code lên GitHub (10 phút)

1. Tạo repository trên GitHub
2. Khởi tạo git và push code
3. Cấu hình GitHub Secrets

Xem chi tiết: [GITHUB_SETUP.md](GITHUB_SETUP.md)

### 3. Setup trên Server (30 phút)

1. SSH vào server
2. Cài đặt Docker và Docker Compose
3. Clone project và chạy

Xem chi tiết: [SETUP.md](SETUP.md)

### 4. Cấu hình CI/CD (15 phút)

1. Tạo Docker Hub account
2. Tạo repositories trên Docker Hub
3. Cấu hình GitHub Secrets
4. Test pipeline

Xem chi tiết: [INSTRUCTIONS.md](INSTRUCTIONS.md)

## 📋 Checklist nhanh

### Trước khi nộp bài:

- [ ] Folder đã đổi tên đúng format
- [ ] Code đã push lên GitHub
- [ ] Link GitHub đã có sẵn
- [ ] Docker và Docker Compose đã cài trên server
- [ ] PostgreSQL container chạy với database `rikkei_prod`
- [ ] Frontend truy cập được tại `http://domain.rikkei.edu.vn`
- [ ] Backend API truy cập được tại `http://domain.rikkei.edu.vn/api`
- [ ] Nginx reverse proxy hoạt động đúng
- [ ] CI/CD pipeline chạy thành công
- [ ] GitHub Secrets đã được cấu hình

## 🔗 Các file quan trọng

| File | Mô tả |
|------|-------|
| `docker-compose.yml` | File orchestration chính |
| `docker-compose.prod.yml` | File cho production với Docker Hub images |
| `nginx/nginx.conf` | Cấu hình Nginx reverse proxy |
| `.github/workflows/ci-cd.yml` | GitHub Actions CI/CD pipeline |
| `frontend/Dockerfile` | Dockerfile cho ReactJS (multi-stage) |
| `backend/Dockerfile` | Dockerfile cho Spring Boot (OpenJDK 17) |
| `backend/src/main/resources/application.properties` | Cấu hình kết nối database |

## ⚡ Lệnh thường dùng

```bash
# Chạy ứng dụng
docker-compose up -d --build

# Xem logs
docker-compose logs -f

# Dừng ứng dụng
docker-compose down

# Restart service
docker-compose restart [service_name]

# Xem status
docker-compose ps

# Rebuild một service
docker-compose build --no-cache [service_name]
docker-compose up -d [service_name]
```

## 🆘 Cần giúp đỡ?

Xem các file hướng dẫn chi tiết:
- [README.md](README.md) - Tổng quan project
- [SETUP.md](SETUP.md) - Hướng dẫn setup chi tiết
- [INSTRUCTIONS.md](INSTRUCTIONS.md) - Hướng dẫn đầy đủ
- [GITHUB_SETUP.md](GITHUB_SETUP.md) - Setup GitHub và CI/CD
