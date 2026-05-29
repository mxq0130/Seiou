/**
 * 站点设置路由 — 提供公开和管理的站点配置接口
 *
 * GET  /api/v1/settings       → 公开设置（任何人可读）
 * PUT  /api/v1/settings       → 更新设置（需管理员）
 */
import { Router } from 'express';
import { success, fail } from '../utils/response.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// 默认站点配置（生产环境从数据库读取）
let siteSettings = {
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
  announcement: 'ブログへようこそ！これはサンプルの告知です 🎉',
  footer: '© 2025 まつざか ゆき. All Rights Reserved.',
  socialLinks: {
    github: 'https://github.com',
    bilibili: 'https://bilibili.com',
    email: 'example@boke.local',
  },
  musicPlaylist: [
    { title: 'secret base ~君がくれたもの~', artist: 'あの花' },
    { title: '打上花火', artist: 'DAOKO × 米津玄師' },
    { title: 'アイドル', artist: 'YOASOBI' },
  ],
  /** 侧边栏 Widget 可见性 */
  sidebarWidgets: {
    stats: true,
    announcement: true,
    categories: true,
    tags: true,
    music: true,
    calendar: true,
  },
  /** 首页区块可见性 */
  homepageSections: {
    hero: true,
    about: true,
    posts: true,
    stats: true,
    quickLinks: true,
  },
};

// GET /api/v1/settings — 公开设置
router.get('/', (_req, res) => {
  return success(res, siteSettings);
});

// PUT /api/v1/settings — 更新设置（需管理员）
router.put('/', requireAdmin, (req, res) => {
  try {
    const updates = req.body;
    siteSettings = { ...siteSettings, ...updates };
    // 深度合并嵌套对象
    if (updates.socialLinks) {
      siteSettings.socialLinks = { ...siteSettings.socialLinks, ...updates.socialLinks };
    }
    if (updates.sidebarWidgets) {
      siteSettings.sidebarWidgets = { ...siteSettings.sidebarWidgets, ...updates.sidebarWidgets };
    }
    if (updates.homepageSections) {
      siteSettings.homepageSections = { ...siteSettings.homepageSections, ...updates.homepageSections };
    }
    return success(res, siteSettings, '设置已更新');
  } catch (err: any) {
    return fail(res, err.message, 500);
  }
});

export default router;
