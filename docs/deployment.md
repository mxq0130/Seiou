# 部署指南 — 雨云香港服务器 + 1Panel

> 服务器配置：2核2G / 香港 / Linux

---

## 一、服务器初始化

### 1.1 购买后立即操作

登录雨云控制台 → 找到刚购买的服务器 → 记录以下信息：

| 信息 | 值 | 用途 |
|------|-----|------|
| 公网 IP | `xxx.xxx.xxx.xxx` | SSH 连接 + 域名解析 |
| root 密码 | 控制台设置 | SSH 登录 |
| SSH 端口 | 默认 22 | 远程连接 |

### 1.2 选择操作系统

推荐：**Ubuntu 22.04 LTS** 或 **Debian 12**

> 不要选 CentOS（已停止维护），不要选 Windows（浪费资源）

---

## 二、安装 1Panel 面板

### 2.1 SSH 连接服务器

```bash
ssh root@你的服务器IP
```

### 2.2 一键安装 1Panel

```bash
curl -sSL https://resource.fit2cloud.com/1panel/package/quick_start.sh -o quick_start.sh && bash quick_start.sh
```

安装过程约 3-5 分钟，完成后会显示：

```
[1Panel Log]: 面板地址: http://你的IP:端口/
[1Panel Log]: 面板用户: admin
[1Panel Log]: 面板密码: xxxxxxxx
```

**立即修改面板端口和密码！**

### 2.3 通过 1Panel 安装运行环境

登录 1Panel 面板 → 应用商店 → 安装：

| 应用 | 版本 | 说明 |
|------|------|------|
| MySQL | 8.0 | 数据库 |
| OpenResty (Nginx) | 最新 | Web 服务器 |
| Node.js | 22.x LTS | 运行 Astro/Express |
| Git | 最新 | 代码管理 |
| PM2 | 最新 | 进程守护 |

---

## 三、数据库配置

### 3.1 创建数据库

1Panel → 数据库 → MySQL → 创建数据库：

```
数据库名: boke
用户名:   boke
密码:     生成一个强密码（记录下来！）
```

### 3.2 获取内网连接地址

1Panel → 数据库 → MySQL → 连接信息：

```
主机: 127.0.0.1 或 localhost
端口: 3306
```

---

## 四、项目部署

### 4.1 上传代码到服务器

**方式一：Git 克隆（推荐）**

先在本机把项目推送到 GitHub，然后在服务器上：

```bash
cd /opt
git clone https://github.com/你的用户名/boke.git
cd boke
```

**方式二：直接上传**

用 1Panel 的文件管理器或 SFTP 上传整个 `E:\boke` 目录到 `/opt/boke`。

### 4.2 配置生产环境变量

```bash
cd /opt/boke/apps/server
cp .env.example .env
nano .env
```

写入：

```env
DATABASE_URL=mysql://boke:你的密码@127.0.0.1:3306/boke
JWT_SECRET=生成一个随机字符串至少32位
PORT=3000
CORS_ORIGIN=https://你的域名.com
USE_MOCK=false
```

同样配置前端：

```bash
cd /opt/boke/apps/blog
nano .env
```

```env
ASTRO_MODE=server
API_BASE_URL=http://127.0.0.1:3000/api/v1
```

### 4.3 安装依赖 + 构建

```bash
# API 服务
cd /opt/boke/apps/server
npm install
npx prisma generate
npx prisma migrate dev --name init   # 创建数据库表

# 管理后台（构建静态文件）
cd /opt/boke/apps/admin
npm install
npm run build                         # 输出到 dist/

# 博客前端
cd /opt/boke/apps/blog
npm install
npm run build                         # SSR 模式构建
```

### 4.4 使用 PM2 启动服务

```bash
# 安装 PM2（如果 1Panel 没有装）
npm install -g pm2

# 启动 API
cd /opt/boke/apps/server
pm2 start npm --name "boke-api" -- run start

# 启动博客前端
cd /opt/boke/apps/blog
pm2 start npm --name "boke-blog" -- run start

# 保存 PM2 进程列表
pm2 save
pm2 startup    # 设置开机自启
```

---

## 五、Nginx 反向代理

1Panel → 网站 → 创建网站 → 反向代理：

```
域名: 你的域名.com

# 博客前端（Astro SSR）
代理路径: /
目标URL:  http://127.0.0.1:4321

# API 服务
代理路径: /api
目标URL:  http://127.0.0.1:3000

# 管理后台（静态文件）
代理路径: /admin
目标URL:  http://127.0.0.1:3001
或直接指向: /opt/boke/apps/admin/dist
```

### Nginx 手动配置（如需精细控制）

```nginx
server {
    listen 80;
    server_name 你的域名.com;

    # 管理后台静态文件
    location /admin {
        alias /opt/boke/apps/admin/dist;
        try_files $uri $uri/ /admin/index.html;
    }

    # API 服务
    location /api/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 博客前端 (SSR)
    location / {
        proxy_pass http://127.0.0.1:4321;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 配置 SSL（HTTPS）

1Panel → 网站 → 你的域名 → SSL → 申请 Let's Encrypt 证书 → 一键开启 HTTPS。

---

## 六、数据库种子数据

部署完成后，首次登录后台是空的。需要填充初始数据：

```bash
cd /opt/boke/apps/server
npx prisma db seed    # 如果有 seed 脚本
```

或者手动通过后台管理面板添加：
1. 访问 `https://你的域名.com/admin` → 用 root/123456 登录
2. 在「文章管理」中添加初始文章
3. 在「站点设置」中配置站点信息

---

## 七、AstrBot 部署（同服务器）

### 7.1 安装 AstrBot

```bash
# 安装到 /opt/astrbot
cd /opt
git clone https://github.com/Soulter/AstrBot.git
cd AstrBot
pip install -r requirements.txt
```

### 7.2 配置

编辑 `config.yaml`，填入你的 QQ 机器人账号信息。

### 7.3 使用 PM2 守护

```bash
pm2 start "python main.py" --name "astrbot"
pm2 save
```

> 注意：2核2G 同时跑 AstrBot + Node.js + MySQL 可能会吃紧。建议监控内存使用：`htop`，必要时给服务器加配置或使用轻量级 QQ 协议（如 Lagrange）。

---

## 八、上传 GitHub

### 8.1 初始化 Git 仓库

```bash
cd /opt/boke  # 或在本地 E:\boke
git remote add origin https://github.com/你的用户名/boke.git
git branch -M main
git push -u origin main
```

### 8.2 .gitignore 检查

确保以下文件不会被上传：

```
node_modules/
dist/
.env
.env.production
.astro/
```

---

## 九、纯静态打包（作业提交）

### 9.1 构建静态站点

```bash
cd apps/blog
ASTRO_MODE=static npm run build
```

输出到 `apps/blog/dist/`，这是纯 HTML+CSS+JS，可以直接打开。

### 9.2 注意事项

| 功能 | 静态模式 | 说明 |
|------|----------|------|
| 首页 | ✅ | Mock 数据驱动 |
| 文章列表 | ✅ | 瀑布流正常 |
| 文章详情 | ✅ | MDX 渲染 |
| 追番/图集/日记 | ✅ | Mock 数据 |
| 搜索 | ✅ | 客户端搜索 |
| 管理后台 | ❌ | 需要 Node.js 后端 |
| 用户登录 | ❌ | 需要 API |
| 评论 | ❌ | 需要 API |

### 9.3 提交方式

把 `apps/blog/dist/` 整个文件夹压缩为 `blog-static.zip`，这就是可以提交的作业包。解压后双击 `index.html` 即可浏览。

或者部署到 GitHub Pages：
```bash
# 安装 gh-pages
npm install -g gh-pages
cd apps/blog
gh-pages -d dist
```

---

## 十、日常维护

### 更新代码

```bash
cd /opt/boke
git pull
cd apps/server && npm install && pm2 restart boke-api
cd apps/blog && npm install && npm run build && pm2 restart boke-blog
cd apps/admin && npm install && npm run build
```

### 查看日志

```bash
pm2 logs boke-api     # API 日志
pm2 logs boke-blog    # 前端日志
pm2 monit             # 实时监控
```

### 数据库备份

1Panel → 数据库 → MySQL → 备份 → 设置每日自动备份。

### 监控资源

```bash
htop      # CPU/内存
df -h     # 磁盘
pm2 list  # 进程状态
```

---

## 十一、资源估算

| 进程 | 预估内存 | 说明 |
|------|----------|------|
| MySQL 8.0 | ~400MB | 数据库 |
| Node.js (API) | ~100MB | Express |
| Node.js (Astro) | ~150MB | 博客 SSR |
| Nginx | ~50MB | Web 服务器 |
| AstrBot | ~200MB | QQ 机器人 |
| 系统 | ~300MB | Ubuntu |
| **合计** | **~1.2GB** | 2GB 勉强够用 |

> 建议：如果内存不够，优先考虑给服务器加到 4GB，或将 AstrBot 部署到另一台便宜服务器。
