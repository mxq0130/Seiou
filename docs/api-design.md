# API 接口设计文档

## 基础规范

- 基础路径：`/api/v1`
- 请求格式：JSON
- 响应格式：
```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```
- 认证方式：Bearer Token (JWT)，在请求头 `Authorization: Bearer <token>`

## 错误码

| 错误码 | 说明 |
|--------|------|
| 0 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未登录 / Token 过期 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 一、认证模块 `/api/v1/auth`

### POST `/register` - 用户注册
```
请求: { username, email, password }
响应: { user: { id, username, email, avatar, role } }
```

### POST `/login` - 用户登录
```
请求: { username, password }
响应: { token, user: { id, username, email, avatar, role } }
```

### GET `/me` - 获取当前用户信息 (需登录)
### PUT `/me` - 更新个人信息 (需登录)

---

## 二、文章模块 `/api/v1/posts`

### GET `/posts` - 文章列表 (公开)
```
查询参数: page, limit, category, tag, q(搜索), status=published
响应: { posts: [...], total, page, totalPages }
post 对象: { id, title, slug, excerpt, cover, category, tags, author, viewCount, createdAt, readingTime }
```

### GET `/posts/:slug` - 文章详情 (公开)
```
响应: { post: { id, title, slug, content, excerpt, cover, category, tags, author, viewCount, createdAt, updatedAt, readingTime, encrypted, prevPost?, nextPost? } }
```

### POST `/posts/:slug/verify` - 验证加密文章密码 (公开)
```
请求: { password }
响应: { valid: boolean, content?: string }
```

### POST `/posts` - 创建文章 (需管理员)
### PUT `/posts/:id` - 更新文章 (需管理员)
### DELETE `/posts/:id` - 删除文章 (需管理员)

---

## 三、分类标签 `/api/v1/categories` `/api/v1/tags`

### GET `/categories` - 分类列表（含文章数量）
### GET `/tags` - 标签列表（含文章数量）
### POST/PUT/DELETE - 管理操作 (需管理员)

---

## 四、图集模块 `/api/v1/gallery`

### GET `/albums` - 相册列表 (公开)
```
响应: { albums: [{ id, name, coverUrl, description, imageCount, encrypted, sortOrder }] }
```

### GET `/albums/:id` - 相册详情 + 图片列表 (公开)
```
若加密需 header: X-Album-Password
响应: { album: {...}, images: [{ id, url, createdAt }] }
```

### POST `/albums/:id/verify` - 验证加密相册密码 (公开)
```
请求: { password }
响应: { valid: boolean }
```

### POST `/albums` - 创建相册 (需管理员)
### POST `/images/upload` - 上传图片 (需管理员)
### DELETE `/albums/:id` - 删除相册 (需管理员)
### DELETE `/images/:id` - 删除图片 (需管理员)

---

## 五、追番模块 `/api/v1/anime`

### GET `/anime` - 追番列表 (公开)
```
查询参数: status (watching/completed/planning/dropped)
响应: { anime: [{ id, title, cover, bilibiliId, progress, total, rating, status, note, year, studio, genre }] }
```

### POST `/anime` - 添加番剧 (需管理员)
### PUT `/anime/:id` - 更新番剧 (需管理员)
### DELETE `/anime/:id` - 删除番剧 (需管理员)

---

## 六、日记模块 `/api/v1/diary`

### GET `/diary` - 日记列表 (公开)
```
查询参数: page, limit
响应: { entries: [{ id, content, weather, location, createdAt }], total, page }
```

### POST `/diary` - 发表日记 (需管理员)
### DELETE `/diary/:id` - 删除日记 (需管理员)

---

## 七、友链模块 `/api/v1/links`

### GET `/links` - 友链列表 (公开，仅已审核)
```
响应: { links: [{ id, name, url, avatar, description, createdAt }] }
```

### POST `/links/apply` - 申请友链 (公开)
### PUT `/links/:id/approve` - 审核友链 (需管理员)
### DELETE `/links/:id` - 删除友链 (需管理员)

---

## 八、评论模块 `/api/v1/comments`

### GET `/comments` - 获取评论 (公开)
```
查询参数: targetType (post/album), targetId, page
响应: { comments: [{ id, content, user, parentId, replies, createdAt }], total }
```

### POST `/comments` - 发表评论 (需登录)
### DELETE `/comments/:id` - 删除评论 (需管理员/评论者)
### PUT `/comments/:id/approve` - 审核评论 (需管理员)

---

## 九、站点设置 `/api/v1/settings`

### GET `/settings` - 获取公开设置 (公开)
```
响应: { site: { title, subtitle, description, keywords, bannerImages, announcement, footer } }
```

### PUT `/settings` - 更新设置 (需管理员)

---

## 十、统计 `/api/v1/stats`

### GET `/stats` - 获取站点统计 (公开)
```
响应: { posts: N, categories: N, tags: N, totalWords: N, runningDays: N, lastActivity: Date }
```

---

## 十一、用户管理 `/api/v1/users` (需管理员)

### GET `/users` - 用户列表
### PUT `/users/:id` - 更新用户角色/状态
### DELETE `/users/:id` - 删除用户
