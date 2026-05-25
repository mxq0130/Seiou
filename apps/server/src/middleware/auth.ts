import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { fail } from '../utils/response.js';

const JWT_SECRET = process.env.JWT_SECRET || 'boke-dev-secret';

export interface JwtPayload {
  userId: number;
  role: 'ADMIN' | 'USER';
}

/** 扩展 Express Request 类型 */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/** 必须登录 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return fail(res, '请先登录', 401);
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = payload;
    next();
  } catch {
    return fail(res, '登录已过期，请重新登录', 401);
  }
}

/** 可选登录（不强制，但如果有 token 就解析） */
export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
      // token 无效，忽略
    }
  }
  next();
}

/** 必须管理员 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    if (req.user?.role !== 'ADMIN') {
      return fail(res, '需要管理员权限', 403);
    }
    next();
  });
}

export { JWT_SECRET };
