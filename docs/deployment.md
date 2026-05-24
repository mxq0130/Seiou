# 部署指南

> 目标平台：雨云香港服务器 + 1Panel 面板

## 前期准备

1. 雨云服务器已安装 1Panel 面板
2. 域名已解析到服务器 IP
3. 1Panel 中已安装：
   - MySQL 8.0
   - Nginx (OpenResty)

## Docker 服务架构

```
docker-compose.yml
├── blog        - Astro SSR 博客前端 (端口 4321)
├── server      - Express API 服务 (端口 3000)
├── admin       - 管理后台静态文件 (通过 Nginx 提供)
└── mysql       - 由 1Panel 管理，不在 docker-compose 中
```

## 部署步骤

### 1. 构建 Docker 镜像

```bash
# 博客前端
docker build -t boke-blog ./apps/blog

# API 服务
docker build -t boke-server ./apps/server

# 管理后台
docker build -t boke-admin ./apps/admin
```

### 2. 配置环境变量

在 1Panel 或 `.env` 中设置：

```env
# 数据库
DATABASE_URL=mysql://user:password@host:3306/boke

# JWT
JWT_SECRET=your-secret-key

# S3 存储
S3_ENDPOINT=your-s3-endpoint
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
S3_BUCKET=boke-images

# B站 API
BILIBILI_UID=your-bilibili-uid
```

### 3. 导入 1Panel

在 1Panel 容器管理中导入 `docker-compose.yml`，或使用 `docker compose up -d`。

### 4. 配置 Nginx 反向代理

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 博客前端
    location / {
        proxy_pass http://127.0.0.1:4321;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # API 服务
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # 管理后台
    location /admin/ {
        alias /path/to/admin/dist/;
        try_files $uri $uri/ /admin/index.html;
    }
}
```

### 5. 配置 SSL

在 1Panel 中为域名申请/配置 SSL 证书（支持 Let's Encrypt 自动续期）。

## 数据备份

- MySQL：1Panel 设置每日自动备份
- 上传文件：S3 对象存储自带冗余
- 定期 `docker compose down && docker compose up -d` 更新应用

## 更新流程

1. 本地修改代码并测试
2. `docker build` 新镜像
3. 上传镜像或重新构建
4. `docker compose up -d` 滚动更新
