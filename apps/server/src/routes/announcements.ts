import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { success, fail } from '../utils/response.js';
import { requireAdmin } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = Router();

// 公开 - 获取全部公告
router.get('/', async (req, res) => {
  try {
    const active = req.query.active;
    const where: any = {};
    if (active === 'true') where.active = true;
    const list = await prisma.announcement.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    return success(res, list);
  } catch (err: any) {
    return fail(res, err.message, 500);
  }
});

// 公开 - 获取活跃公告（给前台用）
router.get('/active', async (_req, res) => {
  try {
    const list = await prisma.announcement.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    });
    return success(res, list);
  } catch (err: any) {
    return fail(res, err.message, 500);
  }
});

// 管理员 - 创建公告
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { content, active } = req.body;
    if (!content) return fail(res, '内容不能为空');
    const ann = await prisma.announcement.create({
      data: { content, active: active ?? true },
    });
    return success(res, ann, '创建成功');
  } catch (err: any) {
    return fail(res, err.message, 500);
  }
});

// 管理员 - 更新公告
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { content, active } = req.body;
    const ann = await prisma.announcement.update({
      where: { id: parseInt(String(req.params.id)) },
      data: {
        ...(content !== undefined && { content }),
        ...(active !== undefined && { active }),
      },
    });
    return success(res, ann, '更新成功');
  } catch (err: any) {
    if (err.code === 'P2025') return fail(res, '公告不存在', 404);
    return fail(res, err.message, 500);
  }
});

// 管理员 - 删除公告
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.announcement.delete({ where: { id: parseInt(String(req.params.id)) } });
    return success(res, null, '删除成功');
  } catch (err: any) {
    if (err.code === 'P2025') return fail(res, '公告不存在', 404);
    return fail(res, err.message, 500);
  }
});

export default router;
