// ============================================================
// 项目类型定义 — 覆盖所有页面所需的数据结构
// ============================================================

// ----- 文章相关 -----
export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover?: string;
  category?: Category;
  tags: Tag[];
  author: Author;
  viewCount: number;
  readingTime: number;       // 阅读时长（分钟）
  encrypted: boolean;        // 是否加密
  pinned: boolean;           // 是否置顶
  status: 'draft' | 'published';
  createdAt: string;         // ISO 日期字符串
  updatedAt: string;
  prevPost?: { title: string; slug: string } | null;
  nextPost?: { title: string; slug: string } | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  postCount: number;
}

export interface Tag {
  id: number;
  name: string;
  slug: string;
  postCount: number;
}

export interface Author {
  id: number;
  username: string;
  avatar?: string;
}

// ----- 图集相关 -----
export interface Album {
  id: number;
  name: string;
  coverUrl?: string;
  description?: string;
  imageCount: number;
  encrypted: boolean;
  sortOrder: number;
  tags: string[];
  createdAt: string;
}

export interface ImageItem {
  id: number;
  url: string;
  albumId: number;
  createdAt: string;
}

// ----- 追番相关 -----
export interface Anime {
  id: number;
  title: string;
  cover?: string;
  bilibiliId?: string;
  progress: number;
  total: number;
  rating: number;
  status: 'watching' | 'completed' | 'planning' | 'dropped';
  note?: string;
  year?: number;
  studio?: string;
  genre?: string;
  createdAt: string;
}

export type AnimeStatus = Anime['status'];

// ----- 友链相关 -----
export interface Link {
  id: number;
  name: string;
  url: string;
  avatar?: string;
  description?: string;
  approved: boolean;
  createdAt: string;
}

// ----- 日记相关 -----
export interface DiaryEntry {
  id: number;
  content: string;
  weather?: string;          // 天气 emoji
  location?: string;         // 位置
  createdAt: string;
}

// ----- 评论相关 -----
export interface Comment {
  id: number;
  content: string;
  user: { id: number; username: string; avatar?: string };
  parentId?: number;
  replies?: Comment[];
  approved: boolean;
  createdAt: string;
}

// ----- 站点统计 -----
export interface SiteStats {
  posts: number;
  categories: number;
  tags: number;
  totalWords: number;
  runningDays: number;
  lastActivity: string;      // ISO 日期字符串
}

// ----- 站点设置（公开） -----
export interface SiteConfig {
  title: string;
  subtitle: string;
  description: string;
  keywords: string[];
  bannerImages: string[];
  announcement?: string;
  footer: string;
}

// ----- 分页 -----
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  totalPages: number;
}
