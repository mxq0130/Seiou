import { Router } from 'express';
import { createHash } from 'crypto';
import { PrismaClient } from '@prisma/client';
import { success, fail } from '../utils/response.js';

// B站 Wbi 签名混排表
const MIXIN_KEY_ENC_TAB = [
  46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35,
  27, 43, 5, 49, 33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13,
  37, 48, 7, 16, 24, 55, 40, 61, 26, 17, 0, 1, 60, 51, 30, 4,
  22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11, 36, 20, 34, 44, 52,
];

let wbiCache: { key: string; expire: number } | null = null;

/** 获取 Wbi 混合密钥（缓存1小时） */
async function getMixKey(): Promise<string> {
  if (wbiCache && Date.now() < wbiCache.expire) return wbiCache.key;

  const nav = await fetch('https://api.bilibili.com/x/web-interface/nav', {
    headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://www.bilibili.com/' },
  });
  const json: any = await nav.json();
  const wbiImg: { img_url: string; sub_url: string } = json?.data?.wbi_img;
  if (!wbiImg) throw new Error('获取 Wbi 密钥失败');

  const imgKey = (wbiImg.img_url.split('/').pop() || '').split('.')[0];
  const subKey = (wbiImg.sub_url.split('/').pop() || '').split('.')[0];
  const raw = imgKey + subKey;
  const mixed = MIXIN_KEY_ENC_TAB.map(i => raw[i] || '').join('').slice(0, 32);

  wbiCache = { key: mixed, expire: Date.now() + 3600000 };
  return mixed;
}

/** 对 URL 添加 Wbi 签名 */
async function signUrl(path: string, params: Record<string, string>): Promise<string> {
  const mixKey = await getMixKey();
  params.wts = String(Math.floor(Date.now() / 1000));
  const sorted = Object.keys(params).sort().map(k => `${k}=${encodeURIComponent(params[k])}`).join('&');
  const raw = sorted + mixKey;
  params.w_rid = createHash('md5').update(raw).digest('hex');

  const qs = Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join('&');
  return `https://api.bilibili.com${path}?${qs}`;
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

// ===== B站追番同步 =====
router.post('/sync', async (req, res) => {
  try {
    const { uid, cookie } = req.body;
    if (!uid) return fail(res, '请提供 B站 UID');

    // 使用 Wbi 签名调用 B站 API
    const url = await signUrl('/x/space/bangumi/follow/list', {
      vmid: String(uid), type: '1', ps: '50',
    });
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer': `https://space.bilibili.com/${uid}/bangumi`,
      'Accept': 'application/json',
      'Accept-Language': 'zh-CN',
    };
    if (cookie) headers['Cookie'] = cookie;

    const response = await fetch(url, { headers });
    const json: any = await response.json();

    if (json.code !== 0) {
      let hint = '';
      if (json.code === -400 || json.code === 53000) hint = '（请将B站追番隐私设为公开）';
      return fail(res, `B站API [${json.code}]: ${json.message || '未知'} ${hint}`);
    }

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
