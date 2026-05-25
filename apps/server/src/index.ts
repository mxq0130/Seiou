import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { mockAuthMiddleware } from './middleware/mockAuth.js';

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const USE_MOCK = process.env.USE_MOCK !== 'false'; // 默认启用 mock

// 中间件
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Mock 认证（无数据库时使用）
if (USE_MOCK) {
  console.log('🔧 Mock 模式已启用 (root / 123456)');
  app.use(mockAuthMiddleware);
}

// 路由
app.use('/api/v1', routes);

// 错误处理
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 API 服务已启动: http://localhost:${PORT}`);
  console.log(`📋 健康检查: http://localhost:${PORT}/api/v1/health`);
});

export default app;
