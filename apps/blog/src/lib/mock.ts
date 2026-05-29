import type { Post, Category, Tag, Album, Anime, Link, DiaryEntry, SiteStats, PaginatedResult } from './types';

// ===== 分类 =====
export const mockCategories: Category[] = [
  { id: 1, name: '示例文章', slug: 'examples', postCount: 4 },
  { id: 2, name: '使用指南', slug: 'guides', postCount: 1 },
  { id: 3, name: '技术分享', slug: 'tech', postCount: 1 },
];

// ===== 标签 =====
export const mockTags: Tag[] = [
  { id: 1, name: 'Markdown', slug: 'markdown', postCount: 3 },
  { id: 2, name: 'Blogging', slug: 'blogging', postCount: 2 },
  { id: 3, name: 'Demo', slug: 'demo', postCount: 1 },
  { id: 4, name: 'Example', slug: 'example', postCount: 2 },
  { id: 5, name: 'Mermaid', slug: 'mermaid', postCount: 1 },
  { id: 6, name: 'Video', slug: 'video', postCount: 1 },
  { id: 7, name: 'Encryption', slug: 'encryption', postCount: 1 },
  { id: 8, name: 'Mizuki', slug: 'mizuki', postCount: 2 },
  { id: 9, name: 'Test', slug: 'test', postCount: 1 },
  { id: 10, name: 'Customization', slug: 'customization', postCount: 1 },
];

// ===== 文章 =====
export const mockPosts: Post[] = [
  {
    id: 1, title: 'Markdown 写作完全指南', slug: 'markdown-guide',
    content: `## 什么是 Markdown？\nMarkdown 是一种轻量级标记语言。\n### 基本语法\n支持标题、粗体、斜体、链接、图片、代码块等。`,
    excerpt: '掌握 Markdown 的所有语法，包括扩展功能如数学公式、Mermaid 图表、代码块增强等。',
    cover: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=300&fit=crop',
    category: mockCategories[0], tags: [mockTags[0], mockTags[1]],
    author: { id: 1, username: 'まつざか ゆき' },
    viewCount: 1280, readingTime: 8, encrypted: false, pinned: true,
    status: 'published', createdAt: '2025-01-20', updatedAt: '2025-01-20',
  },
  {
    id: 2, title: '加密文章示例', slug: 'encrypted-post',
    content: `这篇文章已被加密，请输入密码查看。`,
    excerpt: '这篇文章已被加密，需要输入密码才能查看内容。',
    category: mockCategories[2], tags: [mockTags[6], mockTags[8]],
    author: { id: 1, username: 'まつざか ゆき' },
    viewCount: 420, readingTime: 3, encrypted: true, pinned: false,
    status: 'published', createdAt: '2024-01-15', updatedAt: '2024-01-15',
  },
  {
    id: 3, title: 'Markdown 扩展功能展示', slug: 'markdown-extended',
    content: `## Callout 提示框\n支持 NOTE、WARNING、TIP 等多种类型。`,
    excerpt: '了解 Mizuki 主题提供的 Markdown 扩展功能：Callout 提示框、GitHub 卡片、视频嵌入等。',
    cover: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
    category: mockCategories[0], tags: [mockTags[0], mockTags[2], mockTags[3], mockTags[7]],
    author: { id: 1, username: 'まつざか ゆき' },
    viewCount: 890, readingTime: 5, encrypted: false, pinned: false,
    status: 'published', createdAt: '2024-05-01', updatedAt: '2024-05-01',
  },
  {
    id: 4, title: 'Mizuki 主题上手指南', slug: 'mizuki-guide',
    content: `## 快速开始\n克隆项目后运行 pnpm install && pnpm dev。`,
    excerpt: '如何快速上手使用 Mizuki 博客主题，包括配置修改、文章编写和部署上线。',
    category: mockCategories[1], tags: [mockTags[7], mockTags[1], mockTags[9]],
    author: { id: 1, username: 'まつざか ゆき' },
    viewCount: 650, readingTime: 6, encrypted: false, pinned: false,
    status: 'published', createdAt: '2024-04-01', updatedAt: '2024-04-01',
  },
  {
    id: 5, title: '在文章中嵌入 Mermaid 图表', slug: 'mermaid-demo',
    content: `## Mermaid 流程图\`\`\`mermaid\ngraph TD\nA[开始]-->B[结束]\n\`\`\``,
    excerpt: '使用 Mermaid 在文章中绘制流程图、时序图、甘特图等。',
    cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    category: mockCategories[0], tags: [mockTags[0], mockTags[4]],
    author: { id: 1, username: 'まつざか ゆき' },
    viewCount: 560, readingTime: 4, encrypted: false, pinned: false,
    status: 'published', createdAt: '2023-10-01', updatedAt: '2023-10-01',
  },
  {
    id: 6, title: '在文章中嵌入视频', slug: 'video-post',
    content: `## 嵌入 Bilibili 视频\n使用 iframe 标签。`,
    excerpt: '这篇文章演示如何在博客文章中嵌入 Bilibili / YouTube 视频。',
    category: mockCategories[0], tags: [mockTags[3], mockTags[5]],
    author: { id: 1, username: 'まつざか ゆき' },
    viewCount: 320, readingTime: 2, encrypted: false, pinned: false,
    status: 'published', createdAt: '2022-08-01', updatedAt: '2022-08-01',
  },
];

// ===== 追番 =====
export const mockAnime: Anime[] = [
  { id:1, title:'Lycoris Recoil', progress:12, total:12, rating:9.8, status:'completed', note:"Girl's gunfight", year:2022, studio:'A-1 Pictures', genre:'Action · Slice of life', createdAt:'2025-06-01' },
  { id:2, title:'弱虫ペダル', progress:8, total:12, rating:9.5, status:'watching', note:"Girl's daily life", year:2015, studio:'Nexus', genre:'Daily life · Healing', createdAt:'2025-05-15' },
  { id:3, title:'恋する小惑星', progress:5, total:12, rating:9.2, status:'watching', note:'Meeting girls among the stars', year:2020, studio:'Doga Kobo', genre:'Romance · Healing', createdAt:'2025-04-20' },
  { id:4, title:'ご注文はうさぎですか？', progress:0, total:12, rating:9.0, status:'planning', note:"A group of girls' warm daily life", year:2014, studio:'White Fox', genre:'Daily life · Healing', createdAt:'2025-03-10' },
  { id:5, title:'魔法少女の秘密', progress:8, total:12, rating:9.0, status:'watching', note:'Muli, Muli!', year:2024, studio:'C2C', genre:'Daily life · Healing · Magic', createdAt:'2025-02-01' },
];

// ===== 友链 =====
export const mockLinks: Link[] = [
  { id:1, name:'Mizuki 主题', url:'https://mizuki.mysqil.com', description:'一个简约&功能丰富的 Astro 博客主题', approved:true, createdAt:'2025-01-01' },
  { id:2, name:'GitHub', url:'https://github.com', description:'全球最大的代码托管平台', approved:true, createdAt:'2025-01-01' },
  { id:3, name:'Bilibili', url:'https://bilibili.com', description:'国内最大的二次元视频社区', approved:true, createdAt:'2025-01-01' },
  { id:4, name:'Astro 官网', url:'https://astro.build', description:'现代静态站点生成器', approved:true, createdAt:'2025-01-01' },
  { id:5, name:'Tailwind CSS', url:'https://tailwindcss.com', description:'原子化 CSS 框架', approved:true, createdAt:'2025-01-01' },
  { id:6, name:'Vercel', url:'https://vercel.com', description:'前端部署平台', approved:true, createdAt:'2025-01-01' },
];

// ===== 相册 =====
export const mockAlbums: Album[] = [
  { id:1, name:'可爱的图片', coverUrl:'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=300&fit=crop', description:'The world is vast, and you have to go explore it.', imageCount:22, encrypted:false, sortOrder:0, tags:['Kawai','Cute','Moe'], createdAt:'2025-08-01' },
  { id:2, name:'加密相册示例', coverUrl:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', description:'这是一个加密相册示例，需要密码才能查看', imageCount:4, encrypted:true, sortOrder:1, tags:['加密','示例','私密'], createdAt:'2025-05-22' },
];

// ===== 日记 =====
export const mockDiaries: DiaryEntry[] = [
  { id:1, content:'桜の落ちる速さは秒速5センチメートル！🌸', weather:'☀️', location:'东京', createdAt:'2025-03-15' },
  { id:2, content:'今天终于把博客的前端搭建完了，虽然还有很多细节需要打磨，但整体已经可以看了。继续加油！💪', weather:'⛅', location:'家', createdAt:'2025-05-25' },
  { id:3, content:'新番 Lycoris Recoil 真的太好看了！千束和泷奈的互动太甜了 😭', weather:'🌧️', createdAt:'2025-06-10' },
  { id:4, content:'学习 Astro 框架中... 感觉比 Next.js 更适合做内容型站点', weather:'☀️', createdAt:'2025-06-20' },
];

// ===== 站点统计 =====
export const mockStats: SiteStats = {
  posts: 6, categories: 3, tags: 10, totalWords: 2478, runningDays: 365, lastActivity: new Date().toISOString(),
};

// ===== 分页工具 =====
export function paginate<T>(items: T[], page: number, limit: number = 10): PaginatedResult<T> {
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  return { items: items.slice(start, start + limit), total, page, totalPages };
}
