import { Router } from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { success, fail, paginate } from '../utils/response.js';
import { requireAdmin, requireAuth, optionalAuth } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = Router();

function str(val: unknown): string {
  return typeof val === 'string' ? val : '';
}

// 公开：文章列表
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(str(req.query.page) || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(str(req.query.limit) || '10')));
    const category = str(req.query.category);
    const tag = str(req.query.tag);
    const q = str(req.query.q);

    const where: any = { status: 'PUBLISHED' };
    if (category) where.category = { slug: category };
    if (tag) where.tags = { some: { tag: { slug: tag } } };
    if (q) where.OR = [
      { title: { contains: q } },
      { content: { contains: q } },
      { excerpt: { contains: q } },
    ];

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        select: {
          id: true, title: true, slug: true, excerpt: true, cover: true,
          viewCount: true, createdAt: true, updatedAt: true,
          author: { select: { id: true, username: true, avatar: true } },
          category: { select: { id: true, name: true, slug: true } },
          tags: { select: { tag: { select: { id: true, name: true, slug: true } } } },
        },
        orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    const list = posts.map((p: any) => ({
      ...p,
      tags: p.tags.map((t: any) => t.tag),
    }));

    return paginate(res, list, total, page, limit);
  } catch (err: any) {
    return fail(res, err.message, 500);
  }
});

// 管理员：按 ID 获取文章（编辑用，含草稿）
router.get('/admin/:id', requireAdmin, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) return fail(res, '无效的文章 ID');
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, username: true, avatar: true } },
        category: { select: { id: true, name: true, slug: true } },
        tags: { select: { tag: { select: { id: true, name: true, slug: true } } } },
      },
    });
    if (!post) return fail(res, '文章不存在', 404);
    const result: any = { ...post, tags: (post as any).tags.map((t: any) => t.tag) };
    return success(res, result);
  } catch (err: any) {
    return fail(res, err.message, 500);
  }
});

// 公开：文章详情
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const post = await prisma.post.findUnique({
      where: { slug: String(req.params.slug) },
      include: {
        author: { select: { id: true, username: true, avatar: true } },
        category: { select: { id: true, name: true, slug: true } },
        tags: { select: { tag: { select: { id: true, name: true, slug: true } } } },
      },
    });

    if (!post || (post.status !== 'PUBLISHED')) {
      return fail(res, '文章不存在', 404);
    }

    // 增加阅读量
    await prisma.post.update({ where: { id: post.id }, data: { viewCount: { increment: 1 } } });

    const result: any = { ...post, tags: (post as any).tags.map((t: any) => t.tag) };
    return success(res, { post: result });
  } catch (err: any) {
    return fail(res, err.message, 500);
  }
});

// 登录用户：创建文章（管理员直接发布，普通用户需审核）
router.post('/', requireAuth, async (req, res) => {
  try {
    const body = z.object({
      title: z.string().min(1).max(200),
      slug: z.string().min(1).max(200),
      content: z.string(),
      excerpt: z.string().max(500).optional().nullable(),
      cover: z.string().max(500).optional().nullable(),
      pinned: z.boolean().optional(),
      status: z.enum(['DRAFT', 'PUBLISHED', 'PENDING']).optional(),
      categoryId: z.number().int().optional().nullable(),
      tagIds: z.array(z.number().int()).optional(),
    }).parse(req.body);

    const isAdmin = req.user!.role === 'ADMIN';
    const finalStatus = isAdmin ? (body.status || 'DRAFT') : 'PENDING';

    const post = await prisma.post.create({
      data: {
        title: body.title,
        slug: body.slug,
        content: body.content,
        excerpt: body.excerpt,
        cover: body.cover,
        pinned: isAdmin ? body.pinned : false,
        status: finalStatus,
        authorId: req.user!.userId,
        categoryId: body.categoryId,
        tags: body.tagIds ? { create: body.tagIds.map((tagId) => ({ tagId })) } : undefined,
      },
    });

    return success(res, { post }, isAdmin ? '创建成功' : '投稿成功，等待管理员审核');
  } catch (err: any) {
    if (err instanceof z.ZodError) return fail(res, '参数校验失败: ' + err.message);
    return fail(res, err.message, 500);
  }
});

// 管理员 - 待审核文章列表
router.get('/pending', requireAdmin, async (_req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { status: 'PENDING' },
      include: { author: { select: { id: true, username: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return success(res, posts);
  } catch (err: any) { return fail(res, err.message, 500); }
});

// 管理员 - 审核文章
router.put('/:id/approve', requireAdmin, async (req, res) => {
  try {
    const { approved } = req.body; // true=发布, false=退回草稿
    const post = await prisma.post.update({
      where: { id: parseInt(String(req.params.id)) },
      data: { status: approved ? 'PUBLISHED' : 'DRAFT' },
    });
    return success(res, post, approved ? '已通过审核' : '已退回');
  } catch (err: any) {
    if (err.code === 'P2025') return fail(res, '文章不存在', 404);
    return fail(res, err.message, 500);
  }
});

// 管理员：更新文章
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id));
    const body = z.object({
      title: z.string().min(1).max(200).optional(),
      slug: z.string().min(1).max(200).optional(),
      content: z.string().optional(),
      excerpt: z.string().max(500).optional().nullable(),
      cover: z.string().max(500).optional().nullable(),
      pinned: z.boolean().optional(),
      status: z.enum(['DRAFT', 'PUBLISHED']).optional(),
      categoryId: z.number().int().optional().nullable(),
      tagIds: z.array(z.number().int()).optional(),
    }).parse(req.body);

    // 更新标签
    if (body.tagIds) {
      await prisma.postTag.deleteMany({ where: { postId: id } });
      await prisma.postTag.createMany({ data: body.tagIds.map((tagId) => ({ postId: id, tagId })) });
    }

    const post = await prisma.post.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.slug && { slug: body.slug }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.excerpt !== undefined && { excerpt: body.excerpt }),
        ...(body.cover !== undefined && { cover: body.cover }),
        ...(body.pinned !== undefined && { pinned: body.pinned }),
        ...(body.status && { status: body.status }),
        ...(body.categoryId !== undefined && { categoryId: body.categoryId }),
      },
    });

    return success(res, { post }, '更新成功');
  } catch (err: any) {
    if (err instanceof z.ZodError) return fail(res, '参数校验失败');
    if (err.code === 'P2025') return fail(res, '文章不存在', 404);
    return fail(res, err.message, 500);
  }
});

// 管理员：删除文章
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.post.delete({ where: { id: parseInt(String(req.params.id)) } });
    return success(res, null, '删除成功');
  } catch (err: any) {
    if (err.code === 'P2025') return fail(res, '文章不存在', 404);
    return fail(res, err.message, 500);
  }
});

export default router;
