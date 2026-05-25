import type { Request, Response, NextFunction } from 'express';

/** 全局错误处理中间件 */
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error('[Server Error]', err.message);
  res.status(500).json({
    code: 500,
    message: process.env.NODE_ENV === 'production' ? '服务器内部错误' : err.message,
    data: null,
  });
}
