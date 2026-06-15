import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { success, fail, paginate } from '../utils/response.js';
import { requireAdmin } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = Router();

function str(val: unknown): string {
  return typeof val === 'string' ? val : '';
}

// 管理员：用户列表
router.get('/', requireAdmin, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(str(req.query.page) || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(str(req.query.limit) || '10')));

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        select: { id: true, username: true, email: true, avatar: true, role: true, status: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count(),
    ]);

    return paginate(res, users, total, page, limit);
  } catch (err: any) {
    return fail(res, err.message, 500);
  }
});

// 管理员：更新用户
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id));
    const body = z.object({
      role: z.enum(['ADMIN', 'USER']).optional(),
      status: z.enum(['ACTIVE', 'DISABLED']).optional(),
    }).parse(req.body);

    const user = await prisma.user.update({ where: { id }, data: body });
    return success(res, { user }, '更新成功');
  } catch (err: any) {
    if (err.code === 'P2025') return fail(res, '用户不存在', 404);
    return fail(res, err.message, 500);
  }
});

// 管理员：删除用户
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: parseInt(String(req.params.id)) } });
    return success(res, null, '删除成功');
  } catch (err: any) {
    if (err.code === 'P2025') return fail(res, '用户不存在', 404);
    return fail(res, err.message, 500);
  }
});

export default router;
