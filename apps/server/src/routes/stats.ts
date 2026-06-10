import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { success, fail } from '../utils/response.js';

const prisma = new PrismaClient();
const router = Router();

router.get('/', async (_req, res) => {
  try {
    const [postCount, categoryCount, tagCount, userCount, firstPost, lastPost, recentPosts, recentUsers] = await Promise.all([
      prisma.post.count({ where: { status: 'PUBLISHED' } }),
      prisma.category.count(),
      prisma.tag.count(),
      prisma.user.count(),
      prisma.post.findFirst({ orderBy: { createdAt: 'asc' }, select: { createdAt: true } }),
      prisma.post.findFirst({ where: { status: 'PUBLISHED' }, orderBy: { updatedAt: 'desc' }, select: { updatedAt: true } }),
      prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, title: true, createdAt: true },
      }),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, username: true, role: true, createdAt: true },
      }),
    ]);

    // 计算总字数
    const posts = await prisma.post.findMany({
      where: { status: 'PUBLISHED' },
      select: { content: true },
    });
    const totalWords = posts.reduce((sum, p) => sum + (p.content || '').length, 0);

    const runningDays = firstPost
      ? Math.floor((Date.now() - new Date(firstPost.createdAt).getTime()) / 86400000) + 1
      : 0;

    return success(res, {
      posts: postCount,
      categories: categoryCount,
      tags: tagCount,
      users: userCount,
      totalWords,
      runningDays,
      lastActivity: lastPost?.updatedAt?.toISOString() || null,
      recentPosts: recentPosts.map(p => ({
        id: p.id,
        title: p.title,
        date: new Date(p.createdAt).toISOString().split('T')[0],
      })),
      recentUsers: recentUsers.map(u => ({
        id: u.id,
        username: u.username,
        role: u.role,
        createdAt: new Date(u.createdAt).toISOString().split('T')[0],
      })),
    });
  } catch (err: any) {
    return fail(res, err.message, 500);
  }
});

export default router;
