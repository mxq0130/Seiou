import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { success, fail } from '../utils/response.js';

const prisma = new PrismaClient();
const router = Router();

// 公开 GET - 只返回已审核的友链
router.get('/', async (_req, res) => {
  try {
    const list = await prisma.link.findMany({
      where: { approved: true },
      orderBy: { createdAt: 'desc' },
    });
    return success(res, list);
  } catch (err: any) {
    return fail(res, err.message, 500);
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, url, avatar, description } = req.body;
    const link = await prisma.link.create({
      data: {
        name,
        url,
        avatar: avatar || '',
        description: description || '',
        approved: true,
      },
    });
    return success(res, link, '添加成功');
  } catch (err: any) {
    return fail(res, err.message, 500);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const link = await prisma.link.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
    });
    return success(res, link, '更新成功');
  } catch (err: any) {
    if (err.code === 'P2025') return fail(res, '不存在', 404);
    return fail(res, err.message, 500);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.link.delete({ where: { id: parseInt(req.params.id) } });
    return success(res, null, '删除成功');
  } catch (err: any) {
    if (err.code === 'P2025') return fail(res, '不存在', 404);
    return fail(res, err.message, 500);
  }
});

export default router;
