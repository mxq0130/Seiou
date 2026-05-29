import { Router } from 'express';
import { success, fail } from '../utils/response.js';

const router = Router();

let albums = [
  { id:1, name:'可爱的图片', coverUrl:'', description:'探索世界', imageCount:22, encrypted:false, tags:['Kawai'], createdAt:new Date().toISOString() },
  { id:2, name:'加密相册', coverUrl:'', description:'需要密码', imageCount:4, encrypted:true, tags:['私密'], createdAt:new Date().toISOString() },
];

router.get('/', (_req, res) => success(res, albums));
router.post('/', (req, res) => {
  const { name, description, encrypted, tags } = req.body;
  const album = { id:Date.now(), name, coverUrl:'', description, imageCount:0, encrypted:!!encrypted, tags:tags||[], createdAt:new Date().toISOString() };
  albums.unshift(album);
  return success(res, album, '创建成功');
});
router.put('/:id', (req, res) => {
  const idx = albums.findIndex(a => a.id === parseInt(req.params.id));
  if (idx === -1) return fail(res, '不存在', 404);
  albums[idx] = { ...albums[idx], ...req.body };
  return success(res, albums[idx], '更新成功');
});
router.delete('/:id', (req, res) => {
  albums = albums.filter(a => a.id !== parseInt(req.params.id));
  return success(res, null, '删除成功');
});

export default router;
