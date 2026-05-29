import { Router } from 'express';
import authRoutes from './auth.js';
import postRoutes from './posts.js';
import userRoutes from './users.js';
import settingsRoutes from './settings.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/users', userRoutes);
router.use('/settings', settingsRoutes);

// 健康检查
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

export default router;
