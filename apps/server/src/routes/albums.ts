import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { success, fail } from '../utils/response.js';

const prisma = new PrismaClient();
const router = Router();

router.get('/', async (_req, res) => {
  try {
    const list = await prisma.album.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { images: true } } },
    });
    const result = list.map(a => ({
      ...a,
      imageCount: a._count.images,
    }));
    return success(res, result);
  } catch (err: any) {
    return fail(res, err.message, 500);
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, coverUrl, description } = req.body;
    const album = await prisma.album.create({
      data: { name, coverUrl: coverUrl || '', description: description || '' },
    });
    return success(res, album, '创建成功');
  } catch (err: any) {
    return fail(res, err.message, 500);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const album = await prisma.album.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    return success(res, album, '更新成功');
  } catch (err: any) {
    if (err.code === 'P2025') return fail(res, '不存在', 404);
    return fail(res, err.message, 500);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.album.delete({ where: { id: parseInt(req.params.id) } });
    return success(res, null, '删除成功');
  } catch (err: any) {
    if (err.code === 'P2025') return fail(res, '不存在', 404);
    return fail(res, err.message, 500);
  }
});

export default router;
