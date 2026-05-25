import { Router } from 'express';
import authRoutes from './auth.js';
import postRoutes from './posts.js';
import userRoutes from './users.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/users', userRoutes);

// 健康检查
router.get('/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

export default router;
