import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { success, fail } from '../utils/response.js';

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

export default router;
