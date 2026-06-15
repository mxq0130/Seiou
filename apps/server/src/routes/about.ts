import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { success, fail } from '../utils/response.js';

const prisma = new PrismaClient();
const router = Router();
const ABOUT_KEY = 'about_config';

const defaults = {
  name: 'まつざか ゆき',
  avatar: '',
  bio: '一个热爱二次元的前端开发者。',
  socialLinks: { github: 'https://github.com', bilibili: 'https://bilibili.com', email: 'example@boke.local' },
  skills: [
    { name: 'HTML/CSS', level: 90 }, { name: 'TypeScript', level: 85 },
    { name: 'React', level: 80 }, { name: 'Node.js', level: 75 },
  ],
  projects: [{ name: '个人博客', desc: '基于Astro的全栈博客系统', url: 'https://github.com' }],
  timeline: [
    { year: '2025', event: '开始构建个人博客', desc: '从零搭建全栈博客系统' },
    { year: '2024', event: '学习前端开发', desc: '系统学习React和Node.js' },
  ],
};

async function load(): Promise<Record<string, any>> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key: ABOUT_KEY } });
    if (row?.value) return { ...defaults, ...JSON.parse(row.value) };
  } catch {}
  return { ...defaults };
}

router.get('/', async (_req, res) => {
  try { return success(res, await load()); } catch (e: any) { return fail(res, e.message, 500); }
});

router.put('/', async (req, res) => {
  try {
    const data = { ...await load(), ...req.body };
    await prisma.siteSetting.upsert({
      where: { key: ABOUT_KEY },
      create: { key: ABOUT_KEY, value: JSON.stringify(data) },
      update: { value: JSON.stringify(data) },
    });
    return success(res, data, '更新成功');
  } catch (e: any) { return fail(res, e.message, 500); }
});

export default router;
