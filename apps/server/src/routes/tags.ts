import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { success, fail } from '../utils/response.js';
import { requireAdmin } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = Router();

// 公开 - 获取所有标签
router.get('/', async (_req, res) => {
  try {
    const list = await prisma.tag.findMany({
      orderBy: { id: 'asc' },
      include: { _count: { select: { posts: true } } },
    });
    const result = list.map(t => ({
      id: t.id,
      name: t.name,
      slug: t.slug,
      postCount: t._count.posts,
    }));
    return success(res, result);
  } catch (err: any) {
    return fail(res, err.message, 500);
  }
});

// 管理员 - 创建标签
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { name, slug } = req.body;
    if (!name || !slug) return fail(res, '名称和 slug 不能为空');
    const tag = await prisma.tag.create({ data: { name, slug } });
    return success(res, tag, '创建成功');
  } catch (err: any) {
    if (err.code === 'P2002') return fail(res, 'slug 已存在');
    return fail(res, err.message, 500);
  }
});

// 管理员 - 更新标签
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { name, slug } = req.body;
    const tag = await prisma.tag.update({
      where: { id: parseInt(String(req.params.id)) },
      data: { ...(name && { name }), ...(slug && { slug }) },
    });
    return success(res, tag, '更新成功');
  } catch (err: any) {
    if (err.code === 'P2025') return fail(res, '标签不存在', 404);
    if (err.code === 'P2002') return fail(res, 'slug 已存在');
    return fail(res, err.message, 500);
  }
});

// 管理员 - 删除标签（PostTag 自动级联删除）
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.tag.delete({ where: { id: parseInt(String(req.params.id)) } });
    return success(res, null, '删除成功');
  } catch (err: any) {
    if (err.code === 'P2025') return fail(res, '标签不存在', 404);
    return fail(res, err.message, 500);
  }
});

export default router;
