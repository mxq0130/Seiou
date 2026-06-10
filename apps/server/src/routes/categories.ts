import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { success, fail } from '../utils/response.js';
import { requireAdmin } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = Router();

// 公开 - 获取所有分类
router.get('/', async (_req, res) => {
  try {
    const list = await prisma.category.findMany({
      orderBy: { id: 'asc' },
      include: { _count: { select: { posts: true } } },
    });
    const result = list.map(c => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      postCount: c._count.posts,
    }));
    return success(res, result);
  } catch (err: any) {
    return fail(res, err.message, 500);
  }
});

// 管理员 - 创建分类
router.post('/', requireAdmin, async (req, res) => {
  try {
    const { name, slug, type } = req.body;
    if (!name || !slug) return fail(res, '名称和 slug 不能为空');
    const cat = await prisma.category.create({
      data: { name, slug, type: type || 'POST' },
    });
    return success(res, cat, '创建成功');
  } catch (err: any) {
    if (err.code === 'P2002') return fail(res, 'slug 已存在');
    return fail(res, err.message, 500);
  }
});

// 管理员 - 更新分类
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { name, slug, type } = req.body;
    const cat = await prisma.category.update({
      where: { id: parseInt(String(req.params.id)) },
      data: { ...(name && { name }), ...(slug && { slug }), ...(type && { type }) },
    });
    return success(res, cat, '更新成功');
  } catch (err: any) {
    if (err.code === 'P2025') return fail(res, '分类不存在', 404);
    if (err.code === 'P2002') return fail(res, 'slug 已存在');
    return fail(res, err.message, 500);
  }
});

// 管理员 - 删除分类（先解除关联文章）
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id));
    await prisma.post.updateMany({ where: { categoryId: id }, data: { categoryId: null } });
    await prisma.category.delete({ where: { id } });
    return success(res, null, '删除成功');
  } catch (err: any) {
    if (err.code === 'P2025') return fail(res, '分类不存在', 404);
    return fail(res, err.message, 500);
  }
});

export default router;
