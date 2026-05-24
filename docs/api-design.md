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
请求: { email, password }
响应: { token, user: { id, username, email, avatar, role } }
```

### GET `/me` - 获取当前用户信息 (需登录)
```
响应: { user: { id, username, email, avatar, role, created_at } }
```

### PUT `/me` - 更新个人信息 (需登录)
```
请求: { username?, avatar? }
响应: { user }
```

---

## 二、文章模块 `/api/v1/posts`

### GET `/posts` - 文章列表 (公开)
```
查询参数: page, limit, category, tag, q(搜索)
响应: { posts: [...], total, page, totalPages }
```

### GET `/posts/:slug` - 文章详情 (公开)
```
响应: { post: { id, title, slug, content, excerpt, cover, ... } }
```

### POST `/posts` - 创建文章 (需管理员)
### PUT `/posts/:id` - 更新文章 (需管理员)
### DELETE `/posts/:id` - 删除文章 (需管理员)

---

## 三、文档模块 `/api/v1/docs`

### GET `/docs` - 文档列表 (公开)
### GET `/docs/:slug` - 文档详情 (公开)
### POST `/docs` - 创建文档 (需管理员)
### PUT `/docs/:id` - 更新文档 (需管理员)
### DELETE `/docs/:id` - 删除文档 (需管理员)

---

## 四、分类标签 `/api/v1/categories` `/api/v1/tags`

### GET `/categories` - 分类列表
### GET `/tags` - 标签列表
### POST/PUT/DELETE - 管理操作 (需管理员)

---

## 五、图集模块 `/api/v1/gallery`

### GET `/albums` - 相册列表 (公开)
### GET `/albums/:id/images` - 相册内图片 (公开)
### POST `/albums` - 创建相册 (需管理员)
### POST `/images/upload` - 上传图片 (需登录)
### DELETE `/images/:id` - 删除图片 (需管理员/上传者)

---

## 六、追番模块 `/api/v1/anime`

### GET `/anime` - 追番列表 (公开)
### POST `/anime` - 添加番剧 (需管理员)
### PUT `/anime/:id` - 更新进度 (需管理员)
### POST `/anime/sync` - 触发B站同步 (需管理员)

---

## 七、友链模块 `/api/v1/links`

### GET `/links` - 友链列表 (公开，仅已审核)
### POST `/links/apply` - 申请友链 (公开)
### PUT `/links/:id/approve` - 审核友链 (需管理员)
### DELETE `/links/:id` - 删除友链 (需管理员)

---

## 八、评论模块 `/api/v1/comments`

### GET `/comments?target_type=post&target_id=1` - 获取评论 (公开)
### POST `/comments` - 发表评论 (需登录)
### DELETE `/comments/:id` - 删除评论 (需管理员/评论者)
### PUT `/comments/:id/approve` - 审核评论 (需管理员)

---

## 九、站点设置 `/api/v1/settings`

### GET `/settings` - 获取公开设置 (公开)
### PUT `/settings` - 更新设置 (需管理员)

---

## 十、用户管理 `/api/v1/users` (需管理员)

### GET `/users` - 用户列表
### PUT `/users/:id` - 更新用户角色/状态
### DELETE `/users/:id` - 删除用户
