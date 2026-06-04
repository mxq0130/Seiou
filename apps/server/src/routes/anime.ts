import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { success, fail } from '../utils/response.js';

const prisma = new PrismaClient();
const router = Router();

// 公开 GET - 所有人可看
router.get('/', async (_req, res) => {
  try {
    const list = await prisma.anime.findMany({ orderBy: { createdAt: 'desc' } });
    return success(res, list);
  } catch (err: any) {
    return fail(res, err.message, 500);
  }
});

// 管理端 POST
router.post('/', async (req, res) => {
  try {
    const { title, cover, progress, total, rating, status, note, year, studio, genre } = req.body;
    const item = await prisma.anime.create({
      data: {
        title,
        cover: cover || '',
        progress: progress || 0,
        total: total || 12,
        rating: rating || 0,
        status: status || 'WATCHING',
        note: note || '',
      },
    });
    return success(res, item, '添加成功');
  } catch (err: any) {
    return fail(res, err.message, 500);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await prisma.anime.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    return success(res, item, '更新成功');
  } catch (err: any) {
    if (err.code === 'P2025') return fail(res, '不存在', 404);
    return fail(res, err.message, 500);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.anime.delete({ where: { id: parseInt(req.params.id) } });
    return success(res, null, '删除成功');
  } catch (err: any) {
    if (err.code === 'P2025') return fail(res, '不存在', 404);
    return fail(res, err.message, 500);
  }
});

export default router;
