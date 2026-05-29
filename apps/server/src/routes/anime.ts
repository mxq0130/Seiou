import { Router } from 'express';
import { success, fail } from '../utils/response.js';

const router = Router();

// 内存模拟数据
let animeList = [
  { id:1, title:'Lycoris Recoil', cover:'', progress:12, total:12, rating:9.8, status:'completed', note:"Girl's gunfight", year:2022, studio:'A-1 Pictures', genre:'Action', createdAt:new Date().toISOString() },
  { id:2, title:'弱虫ペダル', cover:'', progress:8, total:12, rating:9.5, status:'watching', note:'Girls daily life', year:2015, studio:'Nexus', genre:'Daily', createdAt:new Date().toISOString() },
  { id:3, title:'恋する小惑星', cover:'', progress:5, total:12, rating:9.2, status:'watching', note:'Among the stars', year:2020, studio:'Doga Kobo', genre:'Romance', createdAt:new Date().toISOString() },
];

router.get('/', (_req, res) => success(res, animeList));
router.post('/', (req, res) => {
  const { title, cover, progress, total, rating, status, note, year, studio, genre } = req.body;
  const item = { id: Date.now(), title, cover, progress:progress||0, total:total||12, rating:rating||0, status:status||'watching', note, year, studio, genre, createdAt: new Date().toISOString() };
  animeList.unshift(item);
  return success(res, item, '添加成功');
});
router.put('/:id', (req, res) => {
  const idx = animeList.findIndex(a => a.id === parseInt(req.params.id));
  if (idx === -1) return fail(res, '不存在', 404);
  animeList[idx] = { ...animeList[idx], ...req.body };
  return success(res, animeList[idx], '更新成功');
});
router.delete('/:id', (req, res) => {
  const idx = animeList.findIndex(a => a.id === parseInt(req.params.id));
  if (idx === -1) return fail(res, '不存在', 404);
  animeList.splice(idx, 1);
  return success(res, null, '删除成功');
});

export default router;
