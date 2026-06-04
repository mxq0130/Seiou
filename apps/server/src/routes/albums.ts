import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { success, fail } from '../utils/response.js';

const prisma = new PrismaClient();
const router = Router();

// 获取所有相册
router.get('/', async (_req, res) => {
  try {
    const list = await prisma.album.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { _count: { select: { images: true } } },
    });
    return success(res, list.map(a => ({ ...a, imageCount: a._count.images })));
  } catch (err: any) { return fail(res, err.message, 500); }
});

// 获取单个相册（按 id）
router.get('/:id', async (req, res) => {
  try {
    const idParam = parseInt(req.params.id);
    const album = await prisma.album.findUnique({
      where: { id: idParam },
      include: { images: { orderBy: { createdAt: 'desc' } } },
    });
    if (!album) return fail(res, '相册不存在', 404);
    return success(res, { ...album, imageCount: album.images.length });
  } catch (err: any) { return fail(res, err.message, 500); }
});

// 创建相册
router.post('/', async (req, res) => {
  try {
    const { name, coverUrl, description } = req.body;
    const album = await prisma.album.create({
      data: { name, coverUrl: coverUrl || '', description: description || '' },
    });
    return success(res, album, '创建成功');
  } catch (err: any) { return fail(res, err.message, 500); }
});

// 更新相册
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

// 删除相册
router.delete('/:id', async (req, res) => {
  try {
    await prisma.album.delete({ where: { id: parseInt(req.params.id) } });
    return success(res, null, '删除成功');
  } catch (err: any) {
    if (err.code === 'P2025') return fail(res, '不存在', 404);
    return fail(res, err.message, 500);
  }
});

// 获取相册内图片列表
router.get('/:id/images', async (req, res) => {
  try {
    const images = await prisma.image.findMany({
      where: { albumId: parseInt(req.params.id) },
      orderBy: { createdAt: 'desc' },
    });
    return success(res, images);
  } catch (err: any) { return fail(res, err.message, 500); }
});

// 向相册添加图片（URL 字符串）
router.post('/:id/images', async (req, res) => {
  try {
    const { url, uploaderId } = req.body;
    const image = await prisma.image.create({
      data: { url, albumId: parseInt(req.params.id), uploaderId: uploaderId || 1 },
    });
    return success(res, image, '添加成功');
  } catch (err: any) { return fail(res, err.message, 500); }
});

// 删除图片
router.delete('/:albumId/images/:imageId', async (req, res) => {
  try {
    await prisma.image.delete({ where: { id: parseInt(req.params.imageId) } });
    return success(res, null, '删除成功');
  } catch (err: any) {
    if (err.code === 'P2025') return fail(res, '不存在', 404);
    return fail(res, err.message, 500);
  }
});

export default router;
