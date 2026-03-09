# Hướng dẫn Chi tiết - Project Fullstack

## 📋 Mục lục
1. [Cấu trúc Project](#cấu-trúc-project)
2. [Cài đặt trên Server](#cài-đặt-trên-server)
3. [Cấu hình CI/CD](#cấu-hình-cicd)
4. [Kiểm tra và Test](#kiểm-tra-và-test)

## 📁 Cấu trúc Project

```
HN_KS25[Tên Lớp]_[Tên Sinh Viên]_[Mã Đề]/
├── frontend/                    # ReactJS Application
│   ├── Dockerfile              # Multi-stage build (Node + Nginx)
│   ├── nginx.conf              # Nginx config cho frontend container
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js
│       ├── App.css
│       ├── index.js
│       └── index.css
│
├── backend/                     # Spring Boot Application
│   ├── Dockerfile              # Multi-stage build (Maven + OpenJDK 17)
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/rikkei/
│           │   ├── RikkeiApplication.java
│           │   └── controller/
│           │       └── HealthController.java
│           └── resources/
│               ├── application.properties
│               └── application.yml
│
├── nginx/                       # Nginx Reverse Proxy
│   ├── Dockerfile
│   └── nginx.conf              # Cấu hình reverse proxy
│
├── docker-compose.yml          # Development/Production
├── docker-compose.prod.yml      # Production với images từ Docker Hub
├── .github/
│   └── workflows/
│       └── ci-cd.yml           # GitHub Actions CI/CD
├── deploy.sh                   # Script deploy trên server
├── README.md
├── SETUP.md
└── INSTRUCTIONS.md
```

## 🚀 Cài đặt trên Server

### Bước 1: SSH vào Server

```bash
ssh -i your-private-key.pem ubuntu@YOUR_SERVER_IP
```

### Bước 2: Cài đặt Docker và Docker Compose

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Cài đặt Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Thêm user vào docker group
sudo usermod -aG docker $USER
newgrp docker

# Cài đặt Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify
docker --version
docker-compose --version
```

### Bước 3: Clone Project và Cấu hình

```bash
# Tạo thư mục
sudo mkdir -p /opt/rikkei-app
sudo chown $USER:$USER /opt/rikkei-app
cd /opt/rikkei-app

# Clone repository (sau khi push lên GitHub)
git clone <your-repo-url> .

# Hoặc copy files từ máy local
# scp -r -i your-key.pem ./project/* ubuntu@YOUR_SERVER_IP:/opt/rikkei-app/
```

### Bước 4: Cập nhật Domain trong Nginx Config

```bash
# Sửa file nginx/nginx.conf
nano nginx/nginx.conf

# Thay domain.rikkei.edu.vn bằng domain thực tế của bạn
# Ví dụ: yourname.rikkei.edu.vn
```

### Bước 5: Cập nhật docker-compose.prod.yml

```bash
nano docker-compose.prod.yml

# Thay YOUR_DOCKERHUB_USERNAME bằng username Docker Hub của bạn
# Ví dụ: myusername/rikkei-frontend:latest
```

### Bước 6: Chạy ứng dụng

```bash
# Lần đầu tiên (build từ source)
docker-compose up -d --build

# Hoặc sử dụng file production (pull từ Docker Hub)
docker-compose -f docker-compose.prod.yml up -d

# Kiểm tra status
docker-compose ps

# Xem logs
docker-compose logs -f
```

## 🔄 Cấu hình CI/CD

### Bước 1: Tạo Docker Hub Account

1. Đăng ký tại https://hub.docker.com
2. Tạo 2 repositories:
   - `rikkei-frontend`
   - `rikkei-backend`

### Bước 2: Tạo Docker Hub Access Token

1. Vào Account Settings > Security
2. Tạo Access Token mới
3. Copy và lưu token (chỉ hiển thị 1 lần)

### Bước 3: Cấu hình GitHub Secrets

Vào repository GitHub > **Settings** > **Secrets and variables** > **Actions**

Thêm các secrets sau:

| Secret Name | Giá trị | Mô tả |
|------------|---------|-------|
| `DOCKER_HUB_USERNAME` | `your-dockerhub-username` | Username Docker Hub |
| `DOCKER_HUB_TOKEN` | `your-access-token` | Access token từ Docker Hub |
| `SERVER_HOST` | `YOUR_SERVER_IP` | IP server của bạn |
| `SERVER_USER` | `ubuntu` hoặc `root` | User SSH |
| `SSH_PRIVATE_KEY` | Nội dung file `.pem` | Private key để SSH |

**Lưu ý:** Copy toàn bộ nội dung file `.pem` (bao gồm `-----BEGIN RSA PRIVATE KEY-----` và `-----END RSA PRIVATE KEY-----`)

### Bước 4: Cập nhật CI/CD Workflow (nếu cần)

File `.github/workflows/ci-cd.yml` đã được cấu hình sẵn. Chỉ cần đảm bảo:
- Đường dẫn deploy trên server đúng: `/opt/rikkei-app`
- File `docker-compose.prod.yml` đã được cập nhật với Docker Hub username

### Bước 5: Test CI/CD

```bash
# Commit và push code
git add .
git commit -m "Setup CI/CD"
git push origin main

# Kiểm tra GitHub Actions
# Vào repository > Actions tab
# Xem workflow đang chạy
```

## ✅ Kiểm tra và Test

### 1. Kiểm tra Containers

```bash
# Xem tất cả containers
docker-compose ps

# Xem logs của từng service
docker-compose logs postgres
docker-compose logs backend
docker-compose logs frontend
docker-compose logs nginx
```

### 2. Test Database Connection

```bash
# Vào container postgres
docker exec -it rikkei_postgres psql -U postgres -d rikkei_prod

# Test query
SELECT version();
\q
```

### 3. Test Backend API

```bash
# Từ server
curl http://localhost:8080/api/health

# Từ máy local (nếu mở port)
curl http://YOUR_SERVER_IP:8080/api/health

# Qua domain
curl http://domain.rikkei.edu.vn/api/health
```

### 4. Test Frontend

- Mở trình duyệt: `http://domain.rikkei.edu.vn`
- Kiểm tra console không có lỗi
- Kiểm tra kết nối với backend

### 5. Kiểm tra Nginx

```bash
# Test cấu hình Nginx
docker exec -it rikkei_nginx nginx -t

# Xem access logs
docker exec -it rikkei_nginx tail -f /var/log/nginx/access.log
```

## 🔧 Troubleshooting

### Database không kết nối được

```bash
# Kiểm tra container postgres đang chạy
docker-compose ps postgres

# Kiểm tra logs
docker-compose logs postgres

# Test kết nối từ backend container
docker exec -it rikkei_backend ping postgres
```

### Backend không start

```bash
# Kiểm tra logs
docker-compose logs backend

# Kiểm tra application.properties
docker exec -it rikkei_backend cat /app/application.properties

# Restart backend
docker-compose restart backend
```

### Frontend không build được

```bash
# Kiểm tra logs
docker-compose logs frontend

# Rebuild frontend
docker-compose build --no-cache frontend
docker-compose up -d frontend
```

### Nginx không route đúng

```bash
# Kiểm tra cấu hình
docker exec -it rikkei_nginx cat /etc/nginx/nginx.conf

# Test cấu hình
docker exec -it rikkei_nginx nginx -t

# Reload Nginx
docker-compose restart nginx
```

### CI/CD không deploy

1. Kiểm tra GitHub Secrets đã đúng chưa
2. Kiểm tra SSH key có quyền truy cập server
3. Kiểm tra đường dẫn `/opt/rikkei-app` trên server
4. Xem logs trong GitHub Actions workflow

## 📝 Checklist Hoàn thành

- [ ] Docker và Docker Compose đã cài đặt trên server
- [ ] PostgreSQL container chạy và tạo database `rikkei_prod`
- [ ] Volume được cấu hình để lưu dữ liệu
- [ ] Port 5432 không expose ra ngoài
- [ ] Frontend Dockerfile sử dụng multi-stage build
- [ ] Backend Dockerfile sử dụng OpenJDK 17
- [ ] application.properties kết nối đúng PostgreSQL container
- [ ] docker-compose.yml quản lý 3 services (FE, BE, DB)
- [ ] Nginx reverse proxy cấu hình đúng
- [ ] Gzip compression đã bật
- [ ] client_max_body_size đã set
- [ ] GitHub Actions workflow đã cấu hình
- [ ] Docker Hub repositories đã tạo
- [ ] GitHub Secrets đã set đầy đủ
- [ ] CI/CD pipeline chạy thành công
- [ ] Domain truy cập được từ trình duyệt
- [ ] Frontend load được tại `http://domain.rikkei.edu.vn`
- [ ] Backend API truy cập được tại `http://domain.rikkei.edu.vn/api`

## 🎯 Điểm số

- **Phần 1: Cấu hình Server & Database (30đ)**
  - Docker và Docker Compose: 10đ
  - PostgreSQL container: 10đ
  - Volume và network: 10đ

- **Phần 2: Đóng gói và Triển khai (30đ)**
  - Frontend Dockerfile: 10đ
  - Backend Dockerfile: 10đ
  - docker-compose.yml: 10đ

- **Phần 3: Web Server & Reverse Proxy (20đ)**
  - Nginx reverse proxy: 10đ
  - Gzip và client_max_body_size: 10đ

- **Phần 4: CI/CD Pipeline (20đ)**
  - GitHub Actions workflow: 10đ
  - Auto deploy: 10đ

**Tổng: 100 điểm**
