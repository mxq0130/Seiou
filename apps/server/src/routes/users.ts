import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { success, fail, paginate } from '../utils/response.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

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
        select: { id: true, username: true, email: true, avatar: true, role: true, status: true, label: true, createdAt: true },
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

// 登录用户：更新用户（自己可改avatar/label，管理员可改全部）
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id));
    const isAdmin = req.user!.role === 'ADMIN';
    const isSelf = req.user!.userId === id;
    if (!isAdmin && !isSelf) return fail(res, '无权限', 403);

    const baseSchema = z.object({
      avatar: z.string().optional(),
      label: z.string().max(50).optional().nullable(),
      username: z.string().min(2).max(50).optional(),
      email: z.string().email().optional(),
    });
    const adminSchema = z.object({
      role: z.enum(['ADMIN', 'USER']).optional(),
      status: z.enum(['ACTIVE', 'DISABLED']).optional(),
    });

    let body = baseSchema.parse(req.body);
    if (isAdmin) {
      const adminBody = adminSchema.parse(req.body);
      body = { ...body, ...adminBody };
    }

    const user = await prisma.user.update({ where: { id }, data: body });
    return success(res, { user }, '更新成功');
  } catch (err: any) {
    if (err.code === 'P2025') return fail(res, '用户不存在', 404);
    if (err.code === 'P2002') return fail(res, '用户名或邮箱已存在');
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

// 公开 - 用户主页
router.get('/profile/:username', async (req, res) => {
  try {
    const username = String(req.params.username);
    const user = await prisma.user.findFirst({
      where: { username },
      select: { id: true, username: true, avatar: true, role: true, createdAt: true },
    });
    if (!user) return fail(res, '用户不存在', 404);

    const [posts, anime] = await Promise.all([
      prisma.post.findMany({
        where: { authorId: user.id, status: 'PUBLISHED' },
        select: { id: true, title: true, slug: true, excerpt: true, cover: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      prisma.anime.findMany({
        select: { id: true, title: true, cover: true, progress: true, total: true, rating: true, status: true },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ]);

    return success(res, { user, posts, anime });
  } catch (err: any) { return fail(res, err.message, 500); }
});

export default router;
