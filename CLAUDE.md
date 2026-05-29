# CLAUDE.md - AI 助手指引

## 基本规则

- **永远使用中文交流**，所有回复、文档、注释都使用中文
- 项目根目录：`E:\boke`

## 项目简介

这是一个二次元风格的个人博客网站，前端参考 Mizuki 博客主题，使用 Astro SSR 构建。包含博客前台、后台管理面板、用户系统、图集、追番、日记等功能。

**双模式架构：**
- 生产模式：Astro SSR → Express API → MySQL
- 演示/提交模式：Astro Static → 内置 Mock 数据 → 纯前端静态包

## 项目文档索引

所有项目标准文档位于 `docs/` 目录：

| 文件 | 用途 |
|------|------|
| [requirements.md](docs/requirements.md) | 项目需求文档 - 完整功能列表（对标 Mizuki） |
| [tech-stack.md](docs/tech-stack.md) | 技术选型与双模式架构说明 |
| [design-spec.md](docs/design-spec.md) | UI/UX 设计规范 - 樱花星夜动漫配色 |
| [api-design.md](docs/api-design.md) | API 接口设计文档 |
| [database-schema.md](docs/database-schema.md) | 数据库表结构详细说明 |
| [deployment.md](docs/deployment.md) | 部署指南 |

## 开发日志

- 每天开发结束后，在 `dev-log/` 目录创建或更新 `YYYY-MM-DD.md`
- 记录：今日完成、待办事项、遇到的问题、明日计划

## 技术栈

| 层级 | 技术 |
|------|------|
| 博客前端 | Astro 5.x + Tailwind CSS + MDX + Swup + PhotoSwipe + KaTeX |
| 后台管理 | React 18 + Ant Design 5 + Vite |
| API 后端 | Express.js + Prisma ORM + TypeScript |
| 数据库 | MySQL 8.0 |
| 部署 | Docker Compose + 1Panel + 雨云香港 |

## 项目结构

```
E:\boke\
├── docs/                 # 项目文档
├── dev-log/              # 开发日志
├── apps/
│   ├── blog/             # Astro 博客前端（SSR/Static 双模式）
│   ├── admin/            # React 管理后台
│   └── server/           # Express API 服务
└── docker-compose.yml
```

## 开发阶段

当前处于 **第三步：前端重写** 阶段。

三个阶段：
1. ~~前端开发（旧版，已完成但废弃）~~
2. ~~后台开发（API/数据库/管理后台，已完成骨架可复用）~~
3. **前端重写（基于 Mizuki 参考，40 步计划）← 当前**
4. 后台完善（补充 API、前后端联通）
5. 服务器部署（Docker + 1Panel + 上线）

## 执行原则

1. 每次只做一个小功能点，确认无误再推进
2. 每完成一个模块立即验证
3. 不跳过任何验证步骤
4. 遇到问题先排查根因，不绕过
5. 文档随代码同步更新
6. 前端代码风格参考 Mizuki 但不照抄，保持差异化
