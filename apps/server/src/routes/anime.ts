import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { success, fail } from '../utils/response.js';

const prisma = new PrismaClient();
const router = Router();

router.get('/', async (_req, res) => {
  try { return success(res, await prisma.anime.findMany({ orderBy: { createdAt: 'desc' } })); }
  catch (err: any) { return fail(res, err.message, 500); }
});

router.post('/', async (req, res) => {
  try {
    const { title, cover, progress, total, rating, status, note, year, studio, genre, bilibiliId } = req.body;
    return success(res, await prisma.anime.create({
      data: { title, cover: cover || '', progress: progress || 0, total: total || 12, rating: rating || 0, status: (status || 'WATCHING') as any, note: note || '', year: year || null, studio: studio || null, genre: genre || null, bilibiliId: bilibiliId || null },
    }), '添加成功');
  } catch (err: any) { return fail(res, err.message, 500); }
});

router.put('/:id', async (req, res) => {
  try { return success(res, await prisma.anime.update({ where: { id: parseInt(req.params.id) }, data: req.body }), '更新成功'); }
  catch (err: any) { if (err.code === 'P2025') return fail(res, '不存在', 404); return fail(res, err.message, 500); }
});

router.delete('/:id', async (req, res) => {
  try { await prisma.anime.delete({ where: { id: parseInt(req.params.id) } }); return success(res, null, '删除成功'); }
  catch (err: any) { if (err.code === 'P2025') return fail(res, '不存在', 404); return fail(res, err.message, 500); }
});

// ===== B站追番同步 =====
router.post('/sync', async (req, res) => {
  try {
    const { uid } = req.body;
    if (!uid) return fail(res, '请提供 B站 UID');

    // B站公开API：获取用户追番列表
    const url = `https://api.bilibili.com/x/space/bangumi/follow/list?vmid=${uid}&type=1&ps=50`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://space.bilibili.com/' },
    });
    const json: any = await response.json();

    if (json.code !== 0) return fail(res, 'B站API返回错误: ' + (json.message || '未知'));

    const list = json.data?.list || [];
    let count = 0;

    for (const item of list) {
      const bilibiliId = String(item.media_id);
      const existing = await prisma.anime.findFirst({ where: { bilibiliId } });

      const data = {
        title: item.title || item.name || '',
        cover: item.cover || '',
        progress: item.progress || 0,
        total: item.total || item.new_ep?.title ? (item.total || 12) : 12,
        rating: item.evaluate ? parseFloat(item.evaluate) : 0,
        status: mapBilibiliStatus(item.status || item.follow_status) as any,
        note: item.progress || '',
        year: item.season?.year || null,
        studio: null,
        genre: item.styles || '',
        bilibiliId,
        syncedAt: new Date(),
      };

      if (existing) {
        await prisma.anime.update({ where: { id: existing.id }, data });
      } else {
        await prisma.anime.create({ data });
      }
      count++;
    }

    return success(res, { count, syncedAt: new Date().toISOString() }, `已同步 ${count} 条追番记录`);
  } catch (err: any) {
    return fail(res, '同步失败: ' + err.message, 500);
  }
});

function mapBilibiliStatus(status: number | string): string {
  const s = Number(status);
  if (s === 1 || s === 2 || s === 3) return 'WATCHING';
  if (s === 4) return 'COMPLETED';
  if (s === 5) return 'PLANNING';
  if (s === 6) return 'DROPPED';
  return 'WATCHING';
}

export default router;
