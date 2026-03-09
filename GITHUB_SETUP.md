# Hướng dẫn Push Code lên GitHub

## Bước 1: Tạo Repository trên GitHub

1. Đăng nhập vào GitHub: https://github.com
2. Click vào dấu `+` ở góc trên bên phải
3. Chọn "New repository"
4. Điền thông tin:
   - **Repository name**: `HN_KS25[Tên Lớp]_[Tên Sinh Viên]_[Mã Đề]`
   - **Description**: "Fullstack Application - ReactJS + Spring Boot + PostgreSQL"
   - **Visibility**: Public hoặc Private (tùy chọn)
   - **KHÔNG** tích vào "Initialize this repository with a README"
5. Click "Create repository"

## Bước 2: Khởi tạo Git trong Project

Mở terminal/PowerShell trong thư mục project:

```bash
# Khởi tạo git repository
git init

# Thêm tất cả files
git add .

# Commit lần đầu
git commit -m "Initial commit: Setup Fullstack project with Docker and CI/CD"
```

## Bước 3: Kết nối với GitHub Repository

```bash
# Thêm remote repository (thay YOUR_USERNAME và REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Hoặc sử dụng SSH (nếu đã setup SSH key)
# git remote add origin git@github.com:YOUR_USERNAME/REPO_NAME.git

# Verify remote
git remote -v
```

## Bước 4: Push Code lên GitHub

```bash
# Push code lên branch main
git branch -M main
git push -u origin main
```

Nếu gặp lỗi authentication, bạn có thể:

### Option 1: Sử dụng Personal Access Token

1. Vào GitHub > Settings > Developer settings > Personal access tokens > Tokens (classic)
2. Generate new token (classic)
3. Chọn quyền: `repo` (full control)
4. Copy token
5. Khi push, sử dụng token làm password:
   ```
   Username: your-github-username
   Password: your-personal-access-token
   ```

### Option 2: Sử dụng GitHub CLI

```bash
# Cài đặt GitHub CLI (nếu chưa có)
# Windows: winget install GitHub.cli
# Mac: brew install gh
# Linux: sudo apt install gh

# Login
gh auth login

# Push code
git push -u origin main
```

### Option 3: Sử dụng SSH Key

1. Tạo SSH key (nếu chưa có):
   ```bash
   ssh-keygen -t ed25519 -C "your_email@example.com"
   ```

2. Copy public key:
   ```bash
   # Windows
   cat ~/.ssh/id_ed25519.pub
   
   # Hoặc mở file bằng notepad
   notepad ~/.ssh/id_ed25519.pub
   ```

3. Thêm SSH key vào GitHub:
   - Vào Settings > SSH and GPG keys
   - Click "New SSH key"
   - Paste public key
   - Click "Add SSH key"

4. Sử dụng SSH URL:
   ```bash
   git remote set-url origin git@github.com:YOUR_USERNAME/REPO_NAME.git
   git push -u origin main
   ```

## Bước 5: Kiểm tra

1. Vào repository trên GitHub
2. Kiểm tra tất cả files đã được upload
3. Kiểm tra `.github/workflows/ci-cd.yml` đã có trong repository

## Bước 6: Cấu hình GitHub Secrets (cho CI/CD)

Sau khi push code, cấu hình Secrets:

1. Vào repository > **Settings** > **Secrets and variables** > **Actions**
2. Click "New repository secret"
3. Thêm các secrets theo bảng sau:

| Name | Value | Mô tả |
|------|-------|-------|
| `DOCKER_HUB_USERNAME` | `your-dockerhub-username` | Username Docker Hub |
| `DOCKER_HUB_TOKEN` | `your-dockerhub-token` | Access token từ Docker Hub |
| `SERVER_HOST` | `YOUR_SERVER_IP` | IP server (ví dụ: 123.456.789.012) |
| `SERVER_USER` | `ubuntu` | User SSH (ubuntu hoặc root) |
| `SSH_PRIVATE_KEY` | Nội dung file `.pem` | Private key để SSH vào server |

**Lưu ý về SSH_PRIVATE_KEY:**
- Copy toàn bộ nội dung file `.pem` hoặc `.key`
- Bao gồm cả dòng `-----BEGIN RSA PRIVATE KEY-----` và `-----END RSA PRIVATE KEY-----`
- Không có khoảng trắng thừa ở đầu hoặc cuối

## Bước 7: Test CI/CD Pipeline

Sau khi cấu hình Secrets:

1. Tạo một thay đổi nhỏ trong code (ví dụ: sửa README.md)
2. Commit và push:
   ```bash
   git add .
   git commit -m "Test CI/CD pipeline"
   git push origin main
   ```
3. Vào repository > **Actions** tab
4. Xem workflow đang chạy
5. Kiểm tra các bước:
   - ✅ Checkout code
   - ✅ Build Docker images
   - ✅ Push to Docker Hub
   - ✅ Deploy to server

## Troubleshooting

### Lỗi: "Permission denied (publickey)"

- Kiểm tra SSH key đã được thêm vào GitHub
- Test SSH connection: `ssh -T git@github.com`

### Lỗi: "Repository not found"

- Kiểm tra tên repository đúng chưa
- Kiểm tra quyền truy cập repository

### Lỗi: "Authentication failed"

- Sử dụng Personal Access Token thay vì password
- Hoặc setup SSH key

### CI/CD không chạy

- Kiểm tra file `.github/workflows/ci-cd.yml` đã có trong repository
- Kiểm tra branch name (phải là `main` hoặc `production`)
- Kiểm tra GitHub Secrets đã được cấu hình đầy đủ

## Checklist

- [ ] Repository đã được tạo trên GitHub
- [ ] Git đã được khởi tạo trong project
- [ ] Code đã được push lên GitHub
- [ ] GitHub Secrets đã được cấu hình
- [ ] CI/CD pipeline đã chạy thành công
- [ ] Link repository đã được nộp cho người phụ trách
