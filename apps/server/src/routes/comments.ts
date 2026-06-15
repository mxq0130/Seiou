import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { success, fail, paginate } from '../utils/response.js';
import { requireAdmin, requireAuth } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = Router();

// 公开 - 获取评论列表
router.get('/', async (req, res) => {
  try {
    const targetType = (req.query.targetType as string) || 'POST';
    const targetId = parseInt(String(req.query.targetId || '0'));
    const page = Math.max(1, parseInt(String(req.query.page || '1')));
    const limit = Math.min(50, Math.max(1, parseInt(String(req.query.limit || '20'))));

    const where: any = { approved: true };
    if (targetId) where.targetId = targetId;
    if (targetType) where.targetType = targetType;
    where.parentId = null; // 只取顶级评论

    const [list, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        include: {
          user: { select: { id: true, username: true, avatar: true } },
          replies: {
            where: { approved: true },
            include: { user: { select: { id: true, username: true, avatar: true } } },
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.comment.count({ where }),
    ]);

    return paginate(res, list, total, page, limit);
  } catch (err: any) {
    return fail(res, err.message, 500);
  }
});

// 登录用户 - 发表评论
router.post('/', requireAuth, async (req, res) => {
  try {
    const { content, targetType, targetId, parentId } = req.body;
    if (!content || !targetType || !targetId) return fail(res, '缺少必填字段');

    const comment = await prisma.comment.create({
      data: {
        content,
        targetType,
        targetId: parseInt(String(targetId)),
        parentId: parentId ? parseInt(String(parentId)) : null,
        userId: req.user!.userId,
      },
      include: { user: { select: { id: true, username: true, avatar: true } } },
    });

    return success(res, comment, '评论成功');
  } catch (err: any) {
    return fail(res, err.message, 500);
  }
});

// 管理员 - 审核评论
router.put('/:id/approve', requireAdmin, async (req, res) => {
  try {
    const comment = await prisma.comment.update({
      where: { id: parseInt(String(req.params.id)) },
      data: { approved: req.body.approved ?? true },
    });
    return success(res, comment, '已更新');
  } catch (err: any) {
    if (err.code === 'P2025') return fail(res, '评论不存在', 404);
    return fail(res, err.message, 500);
  }
});

// 管理员 - 删除评论
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    // 先删除子回复
    await prisma.comment.deleteMany({ where: { parentId: parseInt(String(req.params.id)) } });
    await prisma.comment.delete({ where: { id: parseInt(String(req.params.id)) } });
    return success(res, null, '已删除');
  } catch (err: any) {
    if (err.code === 'P2025') return fail(res, '不存在', 404);
    return fail(res, err.message, 500);
  }
});

// 管理员 - 所有评论列表（含待审核）
router.get('/all', requireAdmin, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(String(req.query.page || '1')));
    const limit = 20;
    const [list, total] = await Promise.all([
      prisma.comment.findMany({
        include: { user: { select: { id: true, username: true, avatar: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.comment.count(),
    ]);
    return paginate(res, list, total, page, limit);
  } catch (err: any) {
    return fail(res, err.message, 500);
  }
});

export default router;
