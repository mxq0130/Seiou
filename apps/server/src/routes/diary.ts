import { Router } from 'express';
import { success, fail } from '../utils/response.js';

const router = Router();

let diaries = [
  { id:1, content:'桜の落ちる速さは秒速5センチメートル！🌸', weather:'☀️', location:'东京', createdAt:'2025-03-15' },
  { id:2, content:'今天终于把博客的前端搭建完了！💪', weather:'⛅', location:'家', createdAt:'2025-05-25' },
];

router.get('/', (_req, res) => success(res, diaries));
router.post('/', (req, res) => {
  const { content, weather, location } = req.body;
  const entry = { id:Date.now(), content, weather:weather||'☀️', location:location||'', createdAt:new Date().toISOString() };
  diaries.unshift(entry);
  return success(res, entry, '发表成功');
});
router.delete('/:id', (req, res) => {
  diaries = diaries.filter(d => d.id !== parseInt(req.params.id));
  return success(res, null, '删除成功');
});

export default router;
