/**
 * 站点设置路由 — 持久化到数据库 SiteSetting 表
 *
 * GET  /api/v1/settings       → 公开设置
 * PUT  /api/v1/settings       → 更新设置（需管理员）
 */
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { success, fail } from '../utils/response.js';
import { requireAdmin } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = Router();

const SETTINGS_KEY = 'site_config';

const defaultSettings = {
  title: '🌸 小破站',
  subtitle: 'わたしの部屋',
  description: '二次元风格个人博客 - 记录生活与技术',
  keywords: ['博客', '二次元', '前端', 'Astro'],
  author: 'まつざか ゆき',
  authorBio: '一个热爱二次元的前端开发者。喜欢摄影、追番、写代码。',
  bannerImages: [
    'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=600&fit=crop',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop',
  ],
  announcement: '',
  footer: '© 2025 まつざか ゆき. All Rights Reserved.',
  socialLinks: {
    github: 'https://github.com',
    bilibili: 'https://bilibili.com',
    email: 'example@boke.local',
  },
  musicPlaylist: [
    { title: 'secret base ~君がくれたもの~', artist: 'あの花' },
  ],
  carouselSlides: [
    { image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&h=500&fit=crop', title: '星空下的约定', subtitle: '原创科幻恋爱番 · 火星殖民地', link: '/anime' },
  ],
  sidebarWidgets: {
    stats: true, announcement: true, categories: true, tags: true, music: true, calendar: true,
  },
  homepageSections: {
    hero: true, about: true, posts: true, stats: true, quickLinks: true,
  },
};

async function loadSettings(): Promise<Record<string, any>> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key: SETTINGS_KEY } });
    if (row?.value) {
      return { ...defaultSettings, ...JSON.parse(row.value) };
    }
  } catch {}
  return { ...defaultSettings };
}

async function saveSettings(data: Record<string, any>): Promise<void> {
  await prisma.siteSetting.upsert({
    where: { key: SETTINGS_KEY },
    create: { key: SETTINGS_KEY, value: JSON.stringify(data) },
    update: { value: JSON.stringify(data) },
  });
}

// GET — 公开设置
router.get('/', async (_req, res) => {
  try {
    const settings = await loadSettings();
    return success(res, settings);
  } catch (err: any) {
    return fail(res, err.message, 500);
  }
});

// PUT — 更新设置（需管理员）
router.put('/', requireAdmin, async (req, res) => {
  try {
    const current = await loadSettings();
    const updates = req.body;

    // keywords: 前端发来的是逗号字符串或数组，统一转成数组存储
    if (typeof updates.keywords === 'string') {
      updates.keywords = (updates.keywords as string).split(/[,，]/).map((s: string) => s.trim()).filter(Boolean);
    }
    // bannerImages: 前端发来的是换行字符串或数组
    if (typeof updates.bannerImages === 'string') {
      updates.bannerImages = (updates.bannerImages as string).split('\n').map((s: string) => s.trim()).filter(Boolean);
    }

    const merged = { ...current, ...updates };
    if (updates.socialLinks) merged.socialLinks = { ...current.socialLinks, ...updates.socialLinks };
    if (updates.sidebarWidgets) merged.sidebarWidgets = { ...current.sidebarWidgets, ...updates.sidebarWidgets };
    if (updates.homepageSections) merged.homepageSections = { ...current.homepageSections, ...updates.homepageSections };

    await saveSettings(merged);
    return success(res, merged, '设置已更新');
  } catch (err: any) {
    return fail(res, err.message, 500);
  }
});

export default router;
