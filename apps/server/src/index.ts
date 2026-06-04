import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { mockAuthMiddleware } from './middleware/mockAuth.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const USE_MOCK = process.env.USE_MOCK !== 'false';

// 上传目录
const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(process.cwd(), '..', '..', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// multer 配置
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + ext);
  },
});
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

// 中间件
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 静态文件 - 上传目录
app.use('/uploads', express.static(UPLOADS_DIR));

// Mock 认证
if (USE_MOCK) {
  console.log('🔧 Mock 模式已启用 (root / 123456)');
  app.use(mockAuthMiddleware);
}

// 图片上传端点（简单实现，生产应加 requireAdmin）
app.post('/api/v1/images/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.json({ code: 400, message: '请选择文件', data: null });
  const protocol = req.headers['x-forwarded-proto'] || 'http';
  const host = req.headers.host || 'localhost:3000';
  const url = `${protocol}://${host}/uploads/${req.file.filename}`;
  res.json({ code: 0, message: '上传成功', data: { url, filename: req.file.filename } });
});

// 路由
app.use('/api/v1', routes);

// 错误处理
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 API 服务已启动: http://localhost:${PORT}`);
  console.log(`📋 健康检查: http://localhost:${PORT}/api/v1/health`);
  console.log(`📁 上传目录: ${UPLOADS_DIR}`);
});

export default app;
