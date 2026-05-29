import { Router } from 'express';
import { success, fail } from '../utils/response.js';

const router = Router();

let aboutData = {
  name: 'まつざか ゆき',
  bio: '一个热爱二次元的前端开发者。喜欢摄影、追番、写代码。',
  socialLinks: { github:'https://github.com', bilibili:'https://bilibili.com', email:'example@boke.local' },
  skills: [
    { name:'HTML/CSS', level:90 }, { name:'TypeScript', level:85 }, { name:'React', level:80 },
    { name:'Node.js', level:75 }, { name:'Astro', level:70 }, { name:'MySQL', level:65 },
  ],
  projects: [
    { name:'个人博客', desc:'基于Astro的全栈博客系统', url:'https://github.com', tech:'Astro/React/Express' },
  ],
  timeline: [
    { year:'2025', event:'开始构建个人博客', desc:'从零搭建全栈博客系统' },
    { year:'2024', event:'学习前端开发', desc:'系统学习React和Node.js' },
  ],
};

router.get('/', (_req, res) => success(res, aboutData));
router.put('/', (req, res) => {
  aboutData = { ...aboutData, ...req.body };
  return success(res, aboutData, '更新成功');
});

export default router;
