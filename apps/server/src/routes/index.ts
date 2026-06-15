import { Router } from 'express';
import authRoutes from './auth.js';
import postRoutes from './posts.js';
import userRoutes from './users.js';
import settingsRoutes from './settings.js';
import animeRoutes from './anime.js';
import albumsRoutes from './albums.js';
import diaryRoutes from './diary.js';
import linksAdminRoutes from './links-admin.js';
import aboutRoutes from './about.js';
import statsRoutes from './stats.js';
import categoriesRoutes from './categories.js';
import tagsRoutes from './tags.js';
import announcementsRoutes from './announcements.js';
import commentsRoutes from './comments.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/users', userRoutes);
router.use('/settings', settingsRoutes);
router.use('/anime', animeRoutes);
router.use('/albums', albumsRoutes);
router.use('/diary', diaryRoutes);
router.use('/links', linksAdminRoutes);
router.use('/about', aboutRoutes);
router.use('/stats', statsRoutes);
router.use('/categories', categoriesRoutes);
router.use('/tags', tagsRoutes);
router.use('/announcements', announcementsRoutes);
router.use('/comments', commentsRoutes);

// 健康检查
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

export default router;
