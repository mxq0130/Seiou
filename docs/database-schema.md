# 数据库表结构

## ER 关系概览

```
users ──1:N──→ posts
users ──1:N──→ comments
users ──1:N──→ images
posts ──1:N──→ comments
posts ──N:N──→ tags
albums ──1:N──→ images
```

---

## users - 用户表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT PK AUTO_INCREMENT | 主键 |
| username | VARCHAR(50) UNIQUE NOT NULL | 用户名 |
| email | VARCHAR(100) UNIQUE NOT NULL | 邮箱 |
| password | VARCHAR(255) NOT NULL | 密码 (bcrypt) |
| avatar | VARCHAR(500) | 头像URL |
| role | ENUM('admin','user') DEFAULT 'user' | 角色 |
| status | ENUM('active','disabled') DEFAULT 'active' | 状态 |
| created_at | DATETIME DEFAULT NOW() | 注册时间 |
| updated_at | DATETIME ON UPDATE NOW() | 更新时间 |

## posts - 文章表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT PK AUTO_INCREMENT | 主键 |
| title | VARCHAR(200) NOT NULL | 标题 |
| slug | VARCHAR(200) UNIQUE NOT NULL | URL标识 |
| content | LONGTEXT NOT NULL | 正文 (Markdown) |
| excerpt | VARCHAR(500) | 摘要 |
| cover | VARCHAR(500) | 封面图URL |
| status | ENUM('draft','published') DEFAULT 'draft' | 状态 |
| author_id | INT FK → users.id | 作者 |
| category_id | INT FK → categories.id | 分类 |
| view_count | INT DEFAULT 0 | 阅读量 |
| created_at | DATETIME DEFAULT NOW() | 创建时间 |
| updated_at | DATETIME ON UPDATE NOW() | 更新时间 |

## docs - 文档表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT PK AUTO_INCREMENT | 主键 |
| title | VARCHAR(200) NOT NULL | 标题 |
| slug | VARCHAR(200) UNIQUE NOT NULL | URL标识 |
| content | LONGTEXT NOT NULL | 正文 |
| parent_id | INT FK → docs.id NULL | 父文档 |
| sort_order | INT DEFAULT 0 | 排序 |
| created_at | DATETIME DEFAULT NOW() | 创建时间 |
| updated_at | DATETIME ON UPDATE NOW() | 更新时间 |

## categories - 分类表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT PK AUTO_INCREMENT | 主键 |
| name | VARCHAR(50) NOT NULL | 分类名 |
| slug | VARCHAR(50) UNIQUE NOT NULL | URL标识 |
| type | ENUM('post','doc') NOT NULL | 分类类型 |

## tags - 标签表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT PK AUTO_INCREMENT | 主键 |
| name | VARCHAR(50) NOT NULL | 标签名 |
| slug | VARCHAR(50) UNIQUE NOT NULL | URL标识 |

## post_tags - 文章标签关联

| 字段 | 类型 | 说明 |
|------|------|------|
| post_id | INT FK → posts.id | 文章ID |
| tag_id | INT FK → tags.id | 标签ID |
| PK | (post_id, tag_id) | 联合主键 |

## albums - 相册表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT PK AUTO_INCREMENT | 主键 |
| name | VARCHAR(100) NOT NULL | 相册名 |
| cover_url | VARCHAR(500) | 封面图 |
| description | VARCHAR(500) | 描述 |
| sort_order | INT DEFAULT 0 | 排序 |
| created_at | DATETIME DEFAULT NOW() | 创建时间 |

## images - 图片表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT PK AUTO_INCREMENT | 主键 |
| url | VARCHAR(500) NOT NULL | 图片URL |
| album_id | INT FK → albums.id | 所属相册 |
| uploader_id | INT FK → users.id | 上传者 |
| created_at | DATETIME DEFAULT NOW() | 上传时间 |

## anime_list - 追番表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT PK AUTO_INCREMENT | 主键 |
| title | VARCHAR(200) NOT NULL | 番剧名 |
| cover | VARCHAR(500) | 封面图 |
| bilibili_id | VARCHAR(50) | B站番剧ID |
| progress | INT DEFAULT 0 | 已看集数 |
| total | INT | 总集数 |
| rating | TINYINT | 评分 1-10 |
| status | ENUM('watching','completed','planning','dropped') | 观看状态 |
| synced_at | DATETIME | B站同步时间 |
| created_at | DATETIME DEFAULT NOW() | 添加时间 |

## links - 友链表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT PK AUTO_INCREMENT | 主键 |
| name | VARCHAR(100) NOT NULL | 站点名 |
| url | VARCHAR(500) NOT NULL | 链接 |
| avatar | VARCHAR(500) | 头像 |
| description | VARCHAR(300) | 描述 |
| approved | BOOLEAN DEFAULT FALSE | 是否审核通过 |
| created_at | DATETIME DEFAULT NOW() | 申请时间 |

## comments - 评论表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT PK AUTO_INCREMENT | 主键 |
| content | TEXT NOT NULL | 评论内容 |
| user_id | INT FK → users.id | 评论者 |
| target_type | ENUM('post','doc','image') NOT NULL | 评论目标类型 |
| target_id | INT NOT NULL | 评论目标ID |
| parent_id | INT FK → comments.id NULL | 父评论 (回复) |
| approved | BOOLEAN DEFAULT TRUE | 是否审核通过 |
| created_at | DATETIME DEFAULT NOW() | 评论时间 |

## site_settings - 站点设置

| 字段 | 类型 | 说明 |
|------|------|------|
| id | INT PK AUTO_INCREMENT | 主键 |
| key | VARCHAR(100) UNIQUE NOT NULL | 设置键 |
| value | TEXT | 设置值 |
| updated_at | DATETIME ON UPDATE NOW() | 更新时间 |
