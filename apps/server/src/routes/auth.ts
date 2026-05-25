import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { success, fail } from '../utils/response.js';
import { requireAuth, JWT_SECRET } from '../middleware/auth.js';

const prisma = new PrismaClient();
const router = Router();

// 注册
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = z.object({
      username: z.string().min(2).max(50),
      email: z.string().email().max(100),
      password: z.string().min(6).max(100),
    }).parse(req.body);

    const exists = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (exists) {
      return fail(res, exists.email === email ? '邮箱已被注册' : '用户名已存在');
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { username, email, password: hashed },
      select: { id: true, username: true, email: true, avatar: true, role: true, createdAt: true },
    });

    return success(res, { user }, '注册成功');
  } catch (err: any) {
    if (err instanceof z.ZodError) return fail(res, '参数校验失败: ' + err.message);
    return fail(res, err.message, 500);
  }
});

// 登录
router.post('/login', async (req, res) => {
  try {
    const { email, password } = z.object({
      email: z.string().email(),
      password: z.string().min(1),
    }).parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return fail(res, '邮箱或密码错误');

    if (user.status === 'DISABLED') return fail(res, '账号已被禁用', 403);

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return fail(res, '邮箱或密码错误');

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' },
    );

    return success(res, {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
      },
    }, '登录成功');
  } catch (err: any) {
    if (err instanceof z.ZodError) return fail(res, '参数校验失败');
    return fail(res, err.message, 500);
  }
});

// 获取当前用户
router.get('/me', requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: { id: true, username: true, email: true, avatar: true, role: true, createdAt: true },
    });
    if (!user) return fail(res, '用户不存在', 404);
    return success(res, { user });
  } catch (err: any) {
    return fail(res, err.message, 500);
  }
});

// 更新个人信息
router.put('/me', requireAuth, async (req, res) => {
  try {
    const { username, avatar } = z.object({
      username: z.string().min(2).max(50).optional(),
      avatar: z.string().max(500).optional(),
    }).parse(req.body);

    const user = await prisma.user.update({
      where: { id: req.user!.userId },
      data: { ...(username && { username }), ...(avatar !== undefined && { avatar }) },
      select: { id: true, username: true, email: true, avatar: true, role: true },
    });

    return success(res, { user }, '更新成功');
  } catch (err: any) {
    if (err instanceof z.ZodError) return fail(res, '参数校验失败');
    return fail(res, err.message, 500);
  }
});

export default router;
