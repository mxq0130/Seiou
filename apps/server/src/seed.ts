/**
 * 数据库种子脚本
 * 用于首次部署时初始化基础数据
 *
 * 使用方法:
 *   cd apps/server
 *   npm run db:seed
 *
 * 前置条件:
 *   - DATABASE_URL 指向真实 MySQL
 *   - npx prisma migrate dev 已完成（数据库表已创建）
 *   - USE_MOCK=false
 */

import { PrismaClient, Role, PostStatus, CateType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 开始填充种子数据...\n');

  // ===== 1. 创建管理员账号 =====
  console.log('📝 创建管理员账号...');
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@boke.local' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@boke.local',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });
  console.log(`   ✅ 管理员: admin@boke.local / admin123 (ID: ${admin.id})\n`);

  // ===== 2. 创建默认分类 =====
  console.log('📁 创建默认分类...');
  const categories = [
    { name: '技术', slug: 'tech' },
    { name: '生活', slug: 'life' },
    { name: '动漫', slug: 'anime' },
  ];

  const createdCategories: Record<string, number> = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { ...cat, type: CateType.POST },
    });
    createdCategories[cat.slug] = created.id;
    console.log(`   ✅ ${cat.name} (slug: ${cat.slug})`);
  }
  console.log();

  // ===== 3. 创建默认标签 =====
  console.log('🏷️  创建默认标签...');
  const tags = [
    { name: 'JavaScript', slug: 'javascript' },
    { name: 'TypeScript', slug: 'typescript' },
    { name: 'React', slug: 'react' },
    { name: 'Node.js', slug: 'nodejs' },
    { name: 'CSS', slug: 'css' },
  ];

  const createdTags: Record<string, number> = {};
  for (const tag of tags) {
    const created = await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
    createdTags[tag.slug] = created.id;
    console.log(`   ✅ ${tag.name}`);
  }
  console.log();

  // ===== 4. 创建一篇示例文章 =====
  console.log('📄 创建示例文章...');
  const existingPost = await prisma.post.findUnique({
    where: { slug: 'hello-world' },
  });

  if (!existingPost) {
    const post = await prisma.post.create({
      data: {
        title: 'Hello World！博客正式上线啦 🎉',
        slug: 'hello-world',
        content: `## 欢迎来到我的博客！

这里是 **boke**，一个二次元风格的个人博客。

### 技术栈

- **前端**: Astro 6 + Tailwind CSS 4
- **后台**: React 19 + Ant Design 6
- **后端**: Express + Prisma + MySQL
- **部署**: 雨云香港 + 1Panel + Docker

### 功能特色

- 🌸 樱花星夜动漫配色
- 📝 Markdown / MDX 文章
- 🖼️ 图集相册
- 📺 追番列表
- 📔 日记时间线
- 🔗 友链交换

> 感谢你的来访，欢迎常来逛逛！`,
        excerpt: '这是博客的第一篇文章，欢迎来访！',
        cover: '',
        status: PostStatus.PUBLISHED,
        authorId: admin.id,
        categoryId: createdCategories['tech'] || null,
      },
    });

    // 关联标签
    if (createdTags['typescript']) {
      await prisma.postTag.create({
        data: { postId: post.id, tagId: createdTags['typescript'] },
      });
    }
    console.log(`   ✅ "${post.title}" (slug: hello-world)\n`);
  } else {
    console.log('   ⏭️  示例文章已存在，跳过\n');
  }

  // ===== 5. 创建站点默认设置 =====
  console.log('⚙️  创建站点设置...');
  const settings = [
    { key: 'site_name', value: 'boke' },
    { key: 'site_description', value: '一个二次元风格的个人博客' },
    { key: 'site_keywords', value: '博客,二次元,技术,动漫,前端' },
    { key: 'footer_text', value: '© 2026 boke. Powered by Astro & Express.' },
    { key: 'posts_per_page', value: '12' },
  ];

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }
  console.log(`   ✅ ${settings.length} 个设置项\n`);

  // ===== 6. 创建示例友链 =====
  console.log('🔗 创建示例友链...');
  await prisma.link.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Astro 官网',
      url: 'https://astro.build',
      description: '现代静态站点框架',
      approved: true,
    },
  });
  console.log('   ✅ Astro 官网\n');

  // ===== 汇总 =====
  const counts = {
    users: await prisma.user.count(),
    categories: await prisma.category.count(),
    tags: await prisma.tag.count(),
    posts: await prisma.post.count(),
    settings: await prisma.siteSetting.count(),
    links: await prisma.link.count(),
  };

  console.log('🎉 种子数据填充完成！');
  console.log('━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`  用户: ${counts.users}`);
  console.log(`  分类: ${counts.categories}`);
  console.log(`  标签: ${counts.tags}`);
  console.log(`  文章: ${counts.posts}`);
  console.log(`  设置: ${counts.settings}`);
  console.log(`  友链: ${counts.links}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n🔑 登录后台: /admin');
  console.log('📧 邮箱: admin@boke.local');
  console.log('🔐 密码: admin123');
  console.log('\n⚠️  生产环境请立即修改管理员密码！');
}

main()
  .catch((e) => {
    console.error('❌ 种子数据填充失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
