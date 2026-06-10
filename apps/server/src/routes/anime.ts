import { Router } from 'express';
import { createHash } from 'crypto';
import { PrismaClient } from '@prisma/client';
import { success, fail } from '../utils/response.js';

const MIXIN_KEY_ENC_TAB = [
  46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35,
  27, 43, 5, 49, 33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13,
  37, 48, 7, 16, 24, 55, 40, 61, 26, 17, 0, 1, 60, 51, 30, 4,
  22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11, 36, 20, 34, 44, 52,
];

let wbiCache: { key: string; expire: number } | null = null;

async function getMixKey(): Promise<string> {
  if (wbiCache && Date.now() < wbiCache.expire) return wbiCache.key;
  const nav = await fetch('https://api.bilibili.com/x/web-interface/nav', {
    headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://www.bilibili.com/' },
  });
  const json: any = await nav.json();
  const wbiImg = json?.data?.wbi_img;
  if (!wbiImg) throw new Error('获取Wbi密钥失败');
  const imgKey = (wbiImg.img_url.split('/').pop() || '').split('.')[0];
  const subKey = (wbiImg.sub_url.split('/').pop() || '').split('.')[0];
  const mixed = MIXIN_KEY_ENC_TAB.map(i => (imgKey + subKey)[i] || '').join('').slice(0, 32);
  wbiCache = { key: mixed, expire: Date.now() + 3600000 };
  return mixed;
}

async function signUrl(path: string, params: Record<string, string>): Promise<string> {
  const mixKey = await getMixKey();
  params.wts = String(Math.floor(Date.now() / 1000));
  const sorted = Object.keys(params).sort().map(k => `${k}=${encodeURIComponent(params[k])}`).join('&');
  params.w_rid = createHash('md5').update(sorted + mixKey).digest('hex');
  return `https://api.bilibili.com${path}?${Object.entries(params).map(([k,v]) => `${k}=${encodeURIComponent(v)}`).join('&')}`;
}

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

router.post('/sync', async (req, res) => {
  try {
    const { uid, cookie } = req.body;
    if (!uid) return fail(res, '请提供B站UID');

    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer': `https://space.bilibili.com/${uid}/bangumi`,
    };
    if (cookie) headers['Cookie'] = cookie;

    let allItems: any[] = [];
    let pn = 1;
    while (true) {
      const url = `https://api.bilibili.com/x/space/bangumi/follow/list?vmid=${uid}&type=1&ps=15&pn=${pn}&follow_status=0`;
      const response = await fetch(url, { headers });
      const json: any = await response.json();
      if (json.code !== 0) {
        return fail(res, `B站API[${json.code}]: ${json.message || '未知'}`);
      }
      const list = json.data?.list || [];
      if (list.length === 0) break;
      allItems = allItems.concat(list);
      if (list.length < 15) break;
      pn++;
    }

    let count = 0;
    for (const item of allItems) {
      const bilibiliId = String(item.media_id);
      const existing = await prisma.anime.findFirst({ where: { bilibiliId } });

      // 正确映射 B站 API 字段
      const year = item.publish?.release_date
        ? new Date(item.publish.release_date).getFullYear()
        : null;

      const data = {
        title: item.title || '',
        cover: item.cover || '',
        progress: parseInt(String(item.progress), 10) || 0,
        total: item.total_count || 12,
        rating: item.rating?.score || 0,
        status: mapFollowStatus(item.follow_status ?? item.status) as any,
        note: (item.progress && String(item.progress)) || '',
        year,
        studio: item.producers?.[0]?.title || null,
        genre: Array.isArray(item.styles) ? item.styles.join(',') : (item.styles || ''),
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
    return success(res, { count }, `已同步${count}条追番`);
  } catch (err: any) {
    return fail(res, '同步失败: ' + err.message, 500);
  }
});

// follow_status: 1=想看 2=在看 3=看过
function mapFollowStatus(s: number | undefined | null): string {
  const n = Number(s);
  if (n === 1) return 'PLANNING';
  if (n === 2) return 'WATCHING';
  if (n === 3) return 'COMPLETED';
  return 'WATCHING';
}

export default router;
