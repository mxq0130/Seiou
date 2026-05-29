import { Router } from 'express';
import { success } from '../utils/response.js';

const router = Router();

router.get('/', (_req, res) => {
  return success(res, {
    posts: 6,
    categories: 3,
    tags: 12,
    users: 2,
    comments: 5,
    runningDays: Math.floor((Date.now() - new Date('2025-01-01').getTime()) / 86400000),
    recentPosts: [
      { title:'Markdown写作指南', date:'2025-01-20' },
      { title:'Astro入门', date:'2025-03-10' },
      { title:'Tailwind v4', date:'2025-04-01' },
    ],
    recentUsers: [
      { username:'root', role:'ADMIN', createdAt:'2025-01-01' },
      { username:'user1', role:'USER', createdAt:'2025-06-01' },
    ],
  });
});

export default router;
