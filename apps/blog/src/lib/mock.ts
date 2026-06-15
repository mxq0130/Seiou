import type { Post, Category, Tag, Album, Anime, Link, DiaryEntry, SiteStats, PaginatedResult } from './types';

// ===== 分类 =====
export const mockCategories = [
  {
    id: 1,
    name: "技术",
    slug: "tech",
    postCount: 5
  },
  {
    id: 2,
    name: "生活",
    slug: "life",
    postCount: 0
  },
  {
    id: 3,
    name: "动漫",
    slug: "anime",
    postCount: 0
  },
  {
    id: 4,
    name: "小说",
    slug: "novel",
    postCount: 0
  }
];

// ===== 标签 =====
export const mockTags = [
  {
    id: 1,
    name: "JavaScript",
    slug: "javascript",
    postCount: 0
  },
  {
    id: 2,
    name: "TypeScript",
    slug: "typescript",
    postCount: 0
  },
  {
    id: 3,
    name: "React",
    slug: "react",
    postCount: 0
  },
  {
    id: 4,
    name: "Node.js",
    slug: "nodejs",
    postCount: 0
  },
  {
    id: 5,
    name: "CSS",
    slug: "css",
    postCount: 0
  }
];

// ===== 文章 =====
export const mockPosts: any[] = [
  {
    id: 8,
    title: "星桜 1.0：博客命名与未来路线图",
    slug: "seiou-1-0-roadmap",
    excerpt: "",
    cover: "http://38.22.90.40/uploads/1781547474070-580788620.jpg",
    content: "",
    status: "published",
    viewCount: 2,
    createdAt: "2026-06-15T18:01:04.902Z",
    author: {
      id: 1,
      username: "admin",
      avatar: ""
    },
    category: {
      id: 1,
      name: "技术",
      slug: "tech"
    },
    tags: []
  },
  {
    id: 7,
    title: "从零到上线：小破站全栈博客开发全纪录",
    slug: "boke-dev-journey",
    excerpt: "",
    cover: "http://38.22.90.40/uploads/1781546787314-280765102.png",
    content: "",
    status: "published",
    viewCount: 10,
    createdAt: "2026-06-15T14:55:33.807Z",
    author: {
      id: 1,
      username: "admin",
      avatar: ""
    },
    category: {
      id: 1,
      name: "技术",
      slug: "tech"
    },
    tags: []
  },
  {
    id: 5,
    title: "小破站更新日志",
    slug: "changelog",
    excerpt: "",
    cover: "http://38.22.90.40/uploads/1781547357838-643996576.png",
    content: "",
    status: "published",
    viewCount: 10,
    createdAt: "2026-06-15T14:50:48.859Z",
    author: {
      id: 1,
      username: "admin",
      avatar: ""
    },
    category: {
      id: 1,
      name: "技术",
      slug: "tech"
    },
    tags: []
  },
  {
    id: 4,
    title: "博客使用技巧完全指南",
    slug: "blog-usage-tips",
    excerpt: "",
    cover: "http://38.22.90.40/uploads/1781547427945-884039209.png",
    content: "",
    status: "published",
    viewCount: 39,
    createdAt: "2026-06-04T05:32:36.638Z",
    author: {
      id: 1,
      username: "admin",
      avatar: ""
    },
    category: {
      id: 1,
      name: "技术",
      slug: "tech"
    },
    tags: []
  },
  {
    id: 3,
    title: "🎉 博客v0.1测试版 正式上线！",
    slug: "hello-world",
    excerpt: "个人博客正式上线，来看看我们的心路历程",
    cover: "http://38.22.90.40/uploads/1781114059398-328867091.jpg",
    content: "",
    status: "published",
    viewCount: 51,
    createdAt: "2026-06-04T05:31:40.452Z",
    author: {
      id: 1,
      username: "admin",
      avatar: ""
    },
    category: {
      id: 1,
      name: "技术",
      slug: "tech"
    },
    tags: []
  }
];

// ===== 追番 =====
export const mockAnime = [
  {
    id: 58,
    title: "我女友与青梅竹马的惨烈修罗场",
    cover: "http://i0.hdslb.com/bfs/bangumi/654466a6f0cf9aa9b73b800da152a460bfabbb89.jpg",
    bilibiliId: "2667",
    progress: 0,
    total: 13,
    rating: 8.9,
    year: 2013,
    studio: null,
    genre: "校园,恋爱",
    status: "WATCHING",
    note: "",
    syncedAt: "2026-06-04T11:22:42.473Z",
    createdAt: "2026-06-04T11:22:42.474Z"
  },
  {
    id: 57,
    title: "言叶之庭",
    cover: "http://i0.hdslb.com/bfs/bangumi/image/5b00c25e00b639194f51ead01c557c9709c3ea6a.jpg",
    bilibiliId: "2546",
    progress: 0,
    total: 1,
    rating: 9.7,
    year: 2013,
    studio: null,
    genre: "少女,日常,治愈",
    status: "WATCHING",
    note: "",
    syncedAt: "2026-06-04T11:22:42.444Z",
    createdAt: "2026-06-04T11:22:42.445Z"
  },
  {
    id: 56,
    title: "某科学的超电磁炮S",
    cover: "http://i0.hdslb.com/bfs/bangumi/image/090d4aa97754d1d80206e461eb633b28b9deed07.jpg",
    bilibiliId: "427",
    progress: 0,
    total: 24,
    rating: 9.7,
    year: 2013,
    studio: null,
    genre: "奇幻,科幻,校园,战斗",
    status: "WATCHING",
    note: "",
    syncedAt: "2026-06-04T11:22:42.437Z",
    createdAt: "2026-06-04T11:22:42.438Z"
  },
  {
    id: 55,
    title: "某科学的超电磁炮",
    cover: "http://i0.hdslb.com/bfs/bangumi/image/aad797f1f0212aba5578a1ed1c992ef1b9ff7c4b.jpg",
    bilibiliId: "425",
    progress: 0,
    total: 24,
    rating: 9.7,
    year: 2009,
    studio: null,
    genre: "奇幻,校园,战斗,漫画改",
    status: "WATCHING",
    note: "",
    syncedAt: "2026-06-04T11:22:42.411Z",
    createdAt: "2026-06-04T11:22:42.411Z"
  },
  {
    id: 54,
    title: "路人女主的养成方法",
    cover: "http://i0.hdslb.com/bfs/bangumi/image/20ee5a611f71b848d2136aa93ad8fbf5d1b2b23a.png",
    bilibiliId: "1512",
    progress: 0,
    total: 13,
    rating: 9.4,
    year: 2015,
    studio: null,
    genre: "恋爱,小说改",
    status: "WATCHING",
    note: "",
    syncedAt: "2026-06-04T11:22:42.400Z",
    createdAt: "2026-06-04T11:22:42.400Z"
  },
  {
    id: 53,
    title: "3月的狮子",
    cover: "http://i0.hdslb.com/bfs/bangumi/7bfd5b9a4aabee8df09df12939d2f32c2f41a0d7.jpg",
    bilibiliId: "5523",
    progress: 0,
    total: 22,
    rating: 9.8,
    year: 2016,
    studio: null,
    genre: "日常,治愈,恋爱,漫画改,励志",
    status: "WATCHING",
    note: "",
    syncedAt: "2026-06-04T11:22:42.394Z",
    createdAt: "2026-06-04T11:22:42.394Z"
  },
  {
    id: 52,
    title: "我的妹妹不可能那么可爱 第二季",
    cover: "http://i0.hdslb.com/bfs/bangumi/745de8b481e33dbedd8115f212c08a3f4362e1c1.jpg",
    bilibiliId: "2661",
    progress: 0,
    total: 16,
    rating: 8.4,
    year: 2013,
    studio: null,
    genre: "日常,萌系,校园,小说改",
    status: "WATCHING",
    note: "",
    syncedAt: "2026-06-04T11:22:42.385Z",
    createdAt: "2026-06-04T11:22:42.386Z"
  },
  {
    id: 51,
    title: "云之彼端，约定的地方",
    cover: "http://i0.hdslb.com/bfs/bangumi/image/a237464905f461476a7bbd2e02eff8c85648c336.png",
    bilibiliId: "2545",
    progress: 0,
    total: 1,
    rating: 9,
    year: 2004,
    studio: null,
    genre: "少女,治愈,科幻",
    status: "COMPLETED",
    note: "",
    syncedAt: "2026-06-04T11:22:42.358Z",
    createdAt: "2026-06-04T11:22:42.358Z"
  },
  {
    id: 50,
    title: "Charlotte",
    cover: "http://i0.hdslb.com/bfs/bangumi/9c3e77244687a81e4b75e88ec22eeb8dbaa26380.jpg",
    bilibiliId: "2572",
    progress: 0,
    total: 13,
    rating: 9.5,
    year: 2015,
    studio: null,
    genre: "日常,治愈,奇幻,校园,催泪,原创",
    status: "COMPLETED",
    note: "",
    syncedAt: "2026-06-04T11:22:42.351Z",
    createdAt: "2026-06-04T11:22:42.352Z"
  },
  {
    id: 49,
    title: "埃罗芒阿老师",
    cover: "http://i0.hdslb.com/bfs/bangumi/a223b1376633625be1cd214c34d8bf34a1e03770.jpg",
    bilibiliId: "5997",
    progress: 0,
    total: 12,
    rating: 9.3,
    year: 2017,
    studio: null,
    genre: "搞笑,恋爱,小说改",
    status: "COMPLETED",
    note: "",
    syncedAt: "2026-06-04T11:22:42.323Z",
    createdAt: "2026-06-04T11:22:42.324Z"
  },
  {
    id: 48,
    title: "恋爱随意链接",
    cover: "http://i0.hdslb.com/bfs/bangumi/8274f1107032a6fe0843dc9cf875d887d6ad0f03.jpg",
    bilibiliId: "713",
    progress: 0,
    total: 17,
    rating: 9.5,
    year: 2012,
    studio: null,
    genre: "少女,日常,治愈,校园,小说改",
    status: "COMPLETED",
    note: "",
    syncedAt: "2026-06-04T11:22:42.317Z",
    createdAt: "2026-06-04T11:22:42.317Z"
  },
  {
    id: 47,
    title: "冰菓",
    cover: "https://i0.hdslb.com/bfs/bangumi/image/f623059d4e370a5b09a7c27b5a035895b40d18f8.png",
    bilibiliId: "3398",
    progress: 0,
    total: 23,
    rating: 9.8,
    year: 2012,
    studio: null,
    genre: "日常,校园,恋爱,推理,社团,悬疑",
    status: "WATCHING",
    note: "",
    syncedAt: "2026-06-04T11:22:42.309Z",
    createdAt: "2026-06-04T11:22:42.310Z"
  },
  {
    id: 46,
    title: "CLANNAD ～AFTER STORY～",
    cover: "http://i0.hdslb.com/bfs/bangumi/image/3a74ca41bae1a94e45b3d23afbb62b7ab613b5df.png",
    bilibiliId: "1178",
    progress: 0,
    total: 23,
    rating: 9.9,
    year: 2008,
    studio: null,
    genre: "治愈,时泪,校园,催泪,游戏改",
    status: "WATCHING",
    note: "",
    syncedAt: "2026-06-04T11:22:42.283Z",
    createdAt: "2026-06-04T11:22:42.284Z"
  },
  {
    id: 45,
    title: "徒然喜欢你",
    cover: "http://i0.hdslb.com/bfs/bangumi/image/cb4dde6d68cf3a826538d84925e123a1148b779d.png",
    bilibiliId: "6312",
    progress: 0,
    total: 12,
    rating: 9.7,
    year: 2017,
    studio: null,
    genre: "日常,搞笑,校园,声控,恋爱,漫画改",
    status: "WATCHING",
    note: "",
    syncedAt: "2026-06-04T11:22:42.268Z",
    createdAt: "2026-06-04T11:22:42.269Z"
  },
  {
    id: 44,
    title: "不时用俄语小声说真心话的邻桌艾莉同学",
    cover: "https://i0.hdslb.com/bfs/bangumi/image/96f9aeb74c9646c318f25bba798462061bd800d7.png",
    bilibiliId: "22053031",
    progress: 0,
    total: 12,
    rating: 7.8,
    year: 2024,
    studio: "播出",
    genre: "日常,搞笑,校园,恋爱,小说改",
    status: "WATCHING",
    note: "",
    syncedAt: "2026-06-04T11:22:42.261Z",
    createdAt: "2026-06-04T11:22:42.262Z"
  },
  {
    id: 43,
    title: "玉子市场",
    cover: "http://i0.hdslb.com/bfs/bangumi/67da3dae76e526a925b78b1d8abe21c870333491.jpg",
    bilibiliId: "116772",
    progress: 0,
    total: 12,
    rating: 9.8,
    year: 2013,
    studio: null,
    genre: "少女,日常,治愈,萌系",
    status: "WATCHING",
    note: "",
    syncedAt: "2026-06-04T11:22:42.248Z",
    createdAt: "2026-06-04T11:22:42.249Z"
  },
  {
    id: 42,
    title: "某科学的超电磁炮T",
    cover: "http://i0.hdslb.com/bfs/bangumi/image/85c6e348a00a54d0b86d538efb186e006a027e21.png",
    bilibiliId: "28224095",
    progress: 0,
    total: 25,
    rating: 9.8,
    year: 2020,
    studio: null,
    genre: "科幻,校园,战斗,漫画改,冒险",
    status: "WATCHING",
    note: "",
    syncedAt: "2026-06-04T11:22:42.242Z",
    createdAt: "2026-06-04T11:22:42.243Z"
  },
  {
    id: 41,
    title: "欢迎来到实力至上主义的教室",
    cover: "http://i0.hdslb.com/bfs/bangumi/a79e331b7443ed5df5a2acd345dc41d598d46ff9.jpg",
    bilibiliId: "6339",
    progress: 0,
    total: 12,
    rating: 8.9,
    year: 2017,
    studio: null,
    genre: "校园,小说改",
    status: "WATCHING",
    note: "",
    syncedAt: "2026-06-04T11:22:42.236Z",
    createdAt: "2026-06-04T11:22:42.237Z"
  },
  {
    id: 40,
    title: "我的青春恋爱物语果然有问题。 第一季 OVA",
    cover: "http://i0.hdslb.com/bfs/bangumi/0406cd1398ad8ae0e9623bed5544d6002d8d30be.jpg",
    bilibiliId: "3437",
    progress: 0,
    total: 1,
    rating: 9.7,
    year: 2013,
    studio: null,
    genre: "校园,恋爱,小说改",
    status: "WATCHING",
    note: "",
    syncedAt: "2026-06-04T11:22:42.230Z",
    createdAt: "2026-06-04T11:22:42.231Z"
  },
  {
    id: 39,
    title: "我的青春恋爱物语果然有问题 续 OVA",
    cover: "http://i0.hdslb.com/bfs/bangumi/8cd1bfa48e8da906012d51c1bf41bd14ce6db8ec.jpg",
    bilibiliId: "5622",
    progress: 0,
    total: 1,
    rating: 9.8,
    year: 2016,
    studio: null,
    genre: "",
    status: "WATCHING",
    note: "",
    syncedAt: "2026-06-04T11:22:42.218Z",
    createdAt: "2026-06-04T11:22:42.219Z"
  },
  {
    id: 38,
    title: "我的青春恋爱物语果然有问题。完",
    cover: "http://i0.hdslb.com/bfs/bangumi/image/82d628408f5472f1440982e880b0b4f0146862ad.png",
    bilibiliId: "28228386",
    progress: 0,
    total: 12,
    rating: 8.9,
    year: 2020,
    studio: "播出",
    genre: "校园,恋爱,小说改",
    status: "WATCHING",
    note: "",
    syncedAt: "2026-06-04T11:22:42.212Z",
    createdAt: "2026-06-04T11:22:42.213Z"
  },
  {
    id: 37,
    title: "我的妹妹不可能那么可爱 第一季",
    cover: "http://i0.hdslb.com/bfs/bangumi/94466dbf154b7da5fa0f1f20dae476efe8892368.jpg",
    bilibiliId: "2660",
    progress: 0,
    total: 16,
    rating: 9.2,
    year: 2010,
    studio: null,
    genre: "日常,萌系,校园,恋爱,小说改",
    status: "WATCHING",
    note: "",
    syncedAt: "2026-06-04T11:22:42.197Z",
    createdAt: "2026-06-04T11:22:42.198Z"
  },
  {
    id: 36,
    title: "我的青春恋爱物语果然有问题。",
    cover: "http://i0.hdslb.com/bfs/bangumi/image/8d1200b8c8b795dd3a7baae33afcec42fbd1947c.png",
    bilibiliId: "1539",
    progress: 0,
    total: 13,
    rating: 9.7,
    year: 2013,
    studio: null,
    genre: "日常,校园,恋爱,小说改",
    status: "WATCHING",
    note: "",
    syncedAt: "2026-06-04T11:22:42.191Z",
    createdAt: "2026-06-04T11:22:42.192Z"
  },
  {
    id: 35,
    title: "紫罗兰永恒花园",
    cover: "http://i0.hdslb.com/bfs/bangumi/image/6565f297b31fb4a4a0337557033426930c3b88c0.png",
    bilibiliId: "8892",
    progress: 0,
    total: 14,
    rating: 9.8,
    year: 2018,
    studio: "播出",
    genre: "治愈,催泪,小说改,励志,职场,架空",
    status: "WATCHING",
    note: "",
    syncedAt: "2026-06-04T11:22:42.162Z",
    createdAt: "2026-06-04T11:22:42.162Z"
  },
  {
    id: 34,
    title: "我的青春恋爱物语果然有问题。续",
    cover: "http://i0.hdslb.com/bfs/bangumi/image/8844c9bea1c5ff2371b47181785084c9650a1402.png",
    bilibiliId: "1540",
    progress: 0,
    total: 13,
    rating: 9.8,
    year: 2015,
    studio: null,
    genre: "日常,校园,恋爱,小说改",
    status: "WATCHING",
    note: "",
    syncedAt: "2026-06-04T11:22:42.155Z",
    createdAt: "2026-06-04T11:22:42.155Z"
  },
  {
    id: 33,
    title: "青春猪头少年不会梦到兔女郎学姐",
    cover: "http://i0.hdslb.com/bfs/bangumi/1cc333ff578e5ea9fded7e454953a4e2291440c2.png",
    bilibiliId: "134932",
    progress: 0,
    total: 13,
    rating: 9.8,
    year: 2018,
    studio: null,
    genre: "奇幻,校园,恋爱,小说改",
    status: "WATCHING",
    note: "",
    syncedAt: "2026-06-04T11:22:42.148Z",
    createdAt: "2026-06-04T11:22:42.148Z"
  },
  {
    id: 32,
    title: "萤火之森",
    cover: "http://i0.hdslb.com/bfs/bangumi/image/5e235a8a197f19be5df56da14676d9e264a601aa.jpg",
    bilibiliId: "27526419",
    progress: 0,
    total: 1,
    rating: 9.7,
    year: 2011,
    studio: null,
    genre: "奇幻,催泪,恋爱,漫画改,神魔",
    status: "WATCHING",
    note: "",
    syncedAt: "2026-06-04T11:22:42.140Z",
    createdAt: "2026-06-04T11:22:42.141Z"
  },
  {
    id: 31,
    title: "强风吹拂",
    cover: "http://i0.hdslb.com/bfs/bangumi/fe356b227e0005454ab2c267c9d7de902eebe837.png",
    bilibiliId: "139352",
    progress: 0,
    total: 23,
    rating: 9.9,
    year: 2018,
    studio: null,
    genre: "热血,运动,小说改,励志",
    status: "WATCHING",
    note: "",
    syncedAt: "2026-06-04T11:22:42.103Z",
    createdAt: "2026-06-04T11:22:42.104Z"
  },
  {
    id: 30,
    title: "薰香花朵凛然绽放",
    cover: "https://i0.hdslb.com/bfs/bangumi/image/433fceda3574bb232ab7091cf9aacc049678e96a.png",
    bilibiliId: "26641346",
    progress: 0,
    total: 13,
    rating: 9.6,
    year: 2025,
    studio: "播出",
    genre: "漫画改,日常,校园,恋爱",
    status: "WATCHING",
    note: "",
    syncedAt: "2026-06-04T11:22:42.046Z",
    createdAt: "2026-06-04T11:22:42.060Z"
  }
];

// ===== 友链 =====
export const mockLinks = [
  {
    id: 1,
    name: "Astro 官网",
    url: "https://astro.build",
    avatar: null,
    description: "现代静态站点框架",
    approved: true,
    createdAt: "2026-06-02T20:15:53.774Z"
  }
];

// ===== 相册 =====
export const mockAlbums = [
  {
    id: 3,
    name: "墨熙情的珍藏壁纸",
    coverUrl: "http://38.22.90.40/uploads/1781547716138-374508601.png",
    description: "一些壁纸，涵盖了手机和pc",
    sortOrder: 0,
    createdAt: "2026-06-15T18:21:58.701Z",
    _count: {
      images: 13
    },
    imageCount: 13,
    images: []
  },
  {
    id: 4,
    name: "一些摄影",
    coverUrl: "http://38.22.90.40/uploads/1781548645987-549086403.png",
    description: "",
    sortOrder: 0,
    createdAt: "2026-06-15T18:37:27.686Z",
    _count: {
      images: 2
    },
    imageCount: 2,
    images: []
  }
];

// ===== 日记 =====
export const mockDiaries: DiaryEntry[] = [
  { id:1, content:'桜の落ちる速さは秒速5センチメートル！🌸', weather:'☀️', location:'东京', createdAt:'2025-03-15' },
  { id:2, content:'今天终于把博客的前端搭建完了，虽然还有很多细节需要打磨，但整体已经可以看了。继续加油！💪', weather:'⛅', location:'家', createdAt:'2025-05-25' },
  { id:3, content:'新番 Lycoris Recoil 真的太好看了！千束和泷奈的互动太甜了 😭', weather:'🌧️', createdAt:'2025-06-10' },
  { id:4, content:'学习 Astro 框架中... 感觉比 Next.js 更适合做内容型站点', weather:'☀️', createdAt:'2025-06-20' },
];

// ===== 站点统计 =====
export const mockStats = {
  posts: 5,
  categories: 4,
  tags: 5,
  users: 2,
  totalWords: 15120,
  runningDays: 12,
  lastActivity: "2026-06-15T19:22:14.040Z",
  recentPosts: [
    {
      id: 8,
      title: "星桜 1.0：博客命名与未来路线图",
      date: "2026-06-15"
    },
    {
      id: 7,
      title: "从零到上线：小破站全栈博客开发全纪录",
      date: "2026-06-15"
    },
    {
      id: 5,
      title: "小破站更新日志",
      date: "2026-06-15"
    },
    {
      id: 4,
      title: "博客使用技巧完全指南",
      date: "2026-06-04"
    },
    {
      id: 3,
      title: "🎉 博客v0.1测试版 正式上线！",
      date: "2026-06-04"
    }
  ],
  recentUsers: [
    {
      id: 2,
      username: "墨熙情的赛博体",
      role: "ADMIN",
      createdAt: "2026-06-15"
    },
    {
      id: 1,
      username: "admin",
      role: "ADMIN",
      createdAt: "2026-06-02"
    }
  ]
};

// ===== 分页工具 =====
export function paginate<T>(items: T[], page: number, limit: number = 10): PaginatedResult<T> {
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  return { items: items.slice(start, start + limit), total, page, totalPages };
}
