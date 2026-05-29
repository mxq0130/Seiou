import { Router } from 'express';
import { success, fail } from '../utils/response.js';

const router = Router();

let links = [
  { id:1, name:'Mizuki 主题', url:'https://mizuki.mysqil.com', avatar:'', description:'Astro博客主题', approved:true, createdAt:'2025-01-01' },
  { id:2, name:'GitHub', url:'https://github.com', avatar:'', description:'代码托管', approved:true, createdAt:'2025-01-01' },
  { id:3, name:'Bilibili', url:'https://bilibili.com', avatar:'', description:'视频社区', approved:true, createdAt:'2025-01-01' },
];

router.get('/', (_req, res) => success(res, links));
router.post('/', (req, res) => {
  const { name, url, avatar, description } = req.body;
  const link = { id:Date.now(), name, url, avatar:avatar||'', description:description||'', approved:true, createdAt:new Date().toISOString() };
  links.unshift(link);
  return success(res, link, '添加成功');
});
router.put('/:id', (req, res) => {
  const idx = links.findIndex(l => l.id === parseInt(req.params.id));
  if (idx === -1) return fail(res, '不存在', 404);
  links[idx] = { ...links[idx], ...req.body };
  return success(res, links[idx], '更新成功');
});
router.delete('/:id', (req, res) => {
  links = links.filter(l => l.id !== parseInt(req.params.id));
  return success(res, null, '删除成功');
});

export default router;
