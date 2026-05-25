import type { Response } from 'express';

/** 统一 API 响应格式 */
export function success<T>(res: Response, data: T, message = 'success') {
  return res.json({ code: 0, message, data });
}

export function fail(res: Response, message: string, code = 400, data: unknown = null) {
  return res.status(code >= 1000 ? 500 : code).json({ code, message, data });
}

export function paginate(res: Response, data: unknown[], total: number, page: number, limit: number) {
  return res.json({
    code: 0,
    message: 'success',
    data: {
      list: data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    },
  });
}
