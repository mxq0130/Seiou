# CLAUDE.md - AI 助手指引

## 基本规则

- **永远使用中文交流**，所有回复、文档、注释都使用中文
- 项目根目录：`E:\boke`

## 项目简介

这是一个二次元风格的个人博客网站，基于 Astro 构建。包含博客前台、后台管理面板、用户系统、图集、追番等功能。

## 项目文档索引

所有项目标准文档位于 `docs/` 目录：

| 文件 | 用途 |
|------|------|
| [requirements.md](docs/requirements.md) | 项目需求文档 - 功能列表、用户故事 |
| [tech-stack.md](docs/tech-stack.md) | 技术选型与架构说明 |
| [design-spec.md](docs/design-spec.md) | UI/UX 设计规范 - 配色、字体、间距、动效 |
| [api-design.md](docs/api-design.md) | API 接口设计文档 |
| [database-schema.md](docs/database-schema.md) | 数据库表结构详细说明 |
| [deployment.md](docs/deployment.md) | 部署指南 |

## 开发日志

- 每天开发结束后，在 `dev-log/` 目录创建或更新 `YYYY-MM-DD.md`
- 记录：今日完成、待办事项、遇到的问题、明日计划

## 技术栈

| 层级 | 技术 |
|------|------|
| 博客前端 | Astro 5.x + Tailwind CSS + MDX |
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
│   ├── blog/             # Astro 博客前端
│   ├── admin/            # React 管理后台
│   └── server/           # Express API 服务
└── docker-compose.yml
```

## 开发阶段

当前处于 **第一步：前端开发** 阶段。

三大阶段：
1. 前端开发（纯前端页面 + 模拟数据）
2. 后台开发（API + 数据库 + 管理面板）
3. 服务器部署（Docker + 1Panel + 上线）

## 执行原则

1. 每次只做一个小功能点，确认无误再推进
2. 每完成一个模块立即验证
3. 不跳过任何验证步骤
4. 遇到问题先排查根因，不绕过
5. 文档随代码同步更新
