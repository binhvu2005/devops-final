# Hướng dẫn Setup Chi tiết

## Bước 1: Cài đặt Docker trên Server

```bash
# SSH vào server
ssh -i your-private-key.pem ubuntu@YOUR_SERVER_IP

# Update system
sudo apt update && sudo apt upgrade -y

# Cài đặt Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Thêm user vào docker group (nếu dùng user ubuntu)
sudo usermod -aG docker ubuntu
newgrp docker

# Cài đặt Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify
docker --version
docker-compose --version
```

## Bước 2: Cấu hình Nginx trên Server

### Option 1: Chạy Nginx trong Container (Khuyến nghị)

Thêm service Nginx vào docker-compose.yml:

```yaml
nginx:
  build:
    context: ./nginx
    dockerfile: Dockerfile
  container_name: rikkei_nginx
  ports:
    - "80:80"
    - "443:443"
  depends_on:
    - frontend
    - backend
  networks:
    - rikkei_network
  restart: unless-stopped
```

### Option 2: Cài đặt Nginx trực tiếp trên OS

```bash
# Cài đặt Nginx
sudo apt install nginx -y

# Tạo file cấu hình
sudo nano /etc/nginx/sites-available/rikkei-app

# Copy nội dung từ nginx/nginx.conf và chỉnh sửa:
# - Thay domain.rikkei.edu.vn bằng domain của bạn
# - Đảm bảo upstream trỏ đúng tên containers

# Enable site
sudo ln -s /etc/nginx/sites-available/rikkei-app /etc/nginx/sites-enabled/

# Test và reload
sudo nginx -t
sudo systemctl reload nginx
```

## Bước 3: Cấu hình GitHub Actions

### 3.1. Tạo Docker Hub Account

1. Đăng ký tại https://hub.docker.com
2. Tạo 2 repositories:
   - `rikkei-frontend`
   - `rikkei-backend`

### 3.2. Tạo Docker Hub Access Token

1. Vào Account Settings > Security
2. Tạo Access Token mới
3. Copy token (chỉ hiển thị 1 lần)

### 3.3. Cấu hình GitHub Secrets

Vào repository GitHub > Settings > Secrets and variables > Actions:

1. **DOCKER_HUB_USERNAME**: Username Docker Hub
2. **DOCKER_HUB_TOKEN**: Access token vừa tạo
3. **SERVER_HOST**: IP server của bạn
4. **SERVER_USER**: `ubuntu` hoặc `root`
5. **SSH_PRIVATE_KEY**: Nội dung file private key (.pem)

### 3.4. Cập nhật CI/CD Workflow

File `.github/workflows/ci-cd.yml` đã được tạo sẵn. Chỉ cần:
- Đảm bảo secrets đã được cấu hình đúng
- Kiểm tra đường dẫn deploy trên server (mặc định: `/opt/rikkei-app`)

## Bước 4: Setup trên Server Production

```bash
# Tạo thư mục project
sudo mkdir -p /opt/rikkei-app
sudo chown $USER:$USER /opt/rikkei-app
cd /opt/rikkei-app

# Clone repository hoặc copy files
git clone <your-repo-url> .

# Cập nhật docker-compose.prod.yml
# Thay YOUR_DOCKERHUB_USERNAME bằng username thực tế
nano docker-compose.prod.yml

# Chạy lần đầu
docker-compose -f docker-compose.prod.yml up -d

# Kiểm tra
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs
```

## Bước 5: Cấu hình Domain

1. Đảm bảo A record đã trỏ về IP server
2. Cập nhật domain trong file `nginx/nginx.conf`
3. Reload Nginx

## Bước 6: Test CI/CD

```bash
# Push code lên branch main hoặc production
git add .
git commit -m "Initial commit"
git push origin main

# Kiểm tra GitHub Actions
# Vào repository > Actions tab
# Xem workflow đang chạy
```

## Troubleshooting

### Database không kết nối được

```bash
# Kiểm tra container postgres
docker-compose ps
docker-compose logs postgres

# Test kết nối từ backend container
docker exec -it rikkei_backend ping postgres
```

### Frontend không load

```bash
# Kiểm tra build
docker-compose logs frontend

# Kiểm tra Nginx
docker-compose logs nginx
# hoặc
sudo nginx -t
```

### CI/CD không deploy

1. Kiểm tra GitHub Secrets đã đúng chưa
2. Kiểm tra SSH key có quyền truy cập server
3. Kiểm tra đường dẫn deploy trên server
4. Xem logs trong GitHub Actions

### Port đã được sử dụng

```bash
# Kiểm tra port đang sử dụng
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443

# Dừng service đang dùng port
sudo systemctl stop apache2  # nếu có
```
