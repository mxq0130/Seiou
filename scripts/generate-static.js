// 从 mock 数据生成静态 HTML 页面
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

async function main() {
  const { mockPosts } = await import('../../apps/blog/src/lib/mock.ts');
  const { mockAlbums } = await import('../../apps/blog/src/lib/mock.ts');
  const outDir = join(import.meta.dirname, '../../ht');

  // 复制 dist/client 中的所有静态文件（CSS/JS/图片）
  const { cpSync } = await import('fs');
  const clientDist = join(import.meta.dirname, '../../apps/blog/dist/client');
  cpSync(clientDist, outDir, { recursive: true });

  console.log('静态资源已复制');
  console.log('Mock 文章:', mockPosts.length, 'Mock 相册:', mockAlbums.length);
}

main();
