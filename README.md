# 🌸 星桜 (Seiou) 主题博客

二次元风格全栈个人博客系统，基于 Astro SSR + React 管理后台 + Express API + MySQL。

**在线预览**：[38.22.90.40](http://38.22.90.40)

## ✨ 特色

- 🎨 **二次元视觉**：樱花粉星夜蓝配色 + 玻璃拟态卡片 + 全屏 Hero 轮播
- 🏠 **10 个前台页面**：首页/文章/归档/搜索/关于/友链/图集/追番/日记/登录注册
- ⚙️ **13 个后台模块**：文章/追番/图集/日记/友链/关于/用户/设置/标签/分类/公告/评论/仪表盘
- 🔄 **Astro SSR/Static 双模式**：一套代码，生产动态 + 静态演示
- 📡 **B站追番同步**：输入 UID + Cookie，自动导入追番列表
- 📝 **评论系统**：支持嵌套回复、审核机制
- 👤 **用户系统**：注册/登录/JWT认证/文章投稿审核
- 🖼️ **图集管理**：相册 + 本地上传图片
- 📱 **响应式设计**：手机/平板/桌面全适配

## 🛠️ 技术栈

| 层级 | 技术 |
|------|------|
| 博客前端 | Astro 6.x + Tailwind CSS + MDX |
| 后台管理 | React 19 + Ant Design 6 + Vite |
| API 后端 | Express.js + TypeScript + Prisma ORM |
| 数据库 | MySQL 8.0 |
| 部署 | 1Panel + PM2 + OpenResty (Nginx) + Docker |

## 🚀 快速开始

### 环境要求

- Node.js 18+
- MySQL 8.0
- pnpm / npm

### 安装

```bash
# 克隆仓库
git clone https://github.com/mxq0130/boke.git
cd boke

# 安装 API 依赖
cd apps/server
cp .env.example .env   # 编辑 .env 配置数据库连接
npm install
npx prisma db push     # 初始化数据库表
npx prisma db seed     # 导入种子数据
npm run dev            # 启动 API → http://localhost:3000

# 安装博客前端
cd ../blog
cp .env.example .env
npm install
npm run dev            # 启动博客 → http://localhost:4321

# 安装管理后台
cd ../admin
npm install
npm run dev            # 启动后台 → http://localhost:5173
```

### 生产部署

```bash
# API
cd apps/server && npm run build && pm2 start dist/index.js --name boke-api

# 博客
cd apps/blog && ASTRO_MODE=server npm run build && pm2 start dist/server/entry.mjs --name boke-blog

# 后台
cd apps/admin && npm run build   # 静态文件部署到 Nginx
```

部署指南详见 [docs/deployment.md](docs/deployment.md)

## 📁 项目结构

```
boke/
├── apps/
│   ├── blog/          # Astro 博客前端
│   │   └── src/
│   │       ├── components/  # 组件
│   │       ├── layouts/      # 布局
│   │       ├── lib/          # 数据层 (SSR/Static 切换)
│   │       └── pages/        # 页面
│   ├── admin/         # React 管理后台
│   │   └── src/pages/
│   └── server/        # Express API
│       ├── prisma/    # 数据库模型
│       └── src/routes/ # API 路由
├── docs/              # 项目文档
└── docker-compose.yml
```

## 📄 License

MIT License © 2025 星桜

## 🙏 致谢

- 设计参考 [Mizuki](https://github.com/imsyy/mizuki) 博客主题
- 图标 [Ant Design Icons](https://ant.design/components/icon)
- 字体 [Google Fonts](https://fonts.google.com)
