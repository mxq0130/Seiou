import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const MOCK_USER = {
  id: 1,
  username: 'root',
  email: 'root@boke.local',
  password: '123456',
  avatar: null,
  role: 'ADMIN' as const,
};

const JWT_SECRET = process.env.JWT_SECRET || 'boke-dev-secret';

/** Mock 认证中间件：在无数据库时使用 */
export function mockAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  // 仅拦截 /api/v1/auth 路由
  if (!req.path.startsWith('/api/v1/auth')) {
    return next();
  }

  // POST /api/v1/auth/login
  if (req.path === '/api/v1/auth/login' && req.method === 'POST') {
    const { username, password } = req.body;

    if (username === MOCK_USER.username && password === MOCK_USER.password) {
      const token = jwt.sign(
        { userId: MOCK_USER.id, role: MOCK_USER.role },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      return res.json({
        code: 0,
        message: '登录成功 (Mock)',
        data: {
          token,
          user: {
            id: MOCK_USER.id,
            username: MOCK_USER.username,
            email: MOCK_USER.email,
            avatar: MOCK_USER.avatar,
            role: MOCK_USER.role,
          },
        },
      });
    }

    return res.json({ code: 400, message: '用户名或密码错误', data: null });
  }

  // GET /api/v1/auth/me
  if (req.path === '/api/v1/auth/me' && req.method === 'GET') {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.json({ code: 401, message: '请先登录', data: null });
    }
    try {
      jwt.verify(token, JWT_SECRET);
      return res.json({
        code: 0,
        message: 'success',
        data: { user: { ...MOCK_USER, createdAt: new Date().toISOString() } },
      });
    } catch {
      return res.json({ code: 401, message: 'Token 无效', data: null });
    }
  }

  next();
}
