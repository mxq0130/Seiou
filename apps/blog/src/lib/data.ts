/**
 * 统一数据层 —— 根据运行模式切换数据源
 *
 * 生产模式 (SSR): fetch Express API
 * 静态模式 (static): import Mock 数据
 */
import type { Post, Category, Tag, Album, Anime, Link, DiaryEntry, SiteStats, PaginatedResult } from './types';

const isStatic = import.meta.env.ASTRO_MODE === 'static';
// 服务端 fetch API 用 127.0.0.1（容器/本地访问），客户端走代理 /api/v1
const API_BASE = isStatic ? '' : (typeof window === 'undefined' ? 'http://127.0.0.1:3000/api/v1' : '/api/v1');

// ===== 通用 fetch 封装 =====
async function fetchAPI<T>(path: string): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error: ${res.status} ${path}`);
  const json = await res.json();
  if (json.code !== 0) throw new Error(json.message || 'API error');
  return json.data as T;
}

// ===== 文章 =====
export async function getPosts(params?: {
  page?: number; limit?: number; category?: string; tag?: string; q?: string;
}): Promise<PaginatedResult<Post>> {
  if (isStatic) {
    const { mockPosts, paginate } = await import('./mock');
    let filtered = mockPosts.filter(p => p.status === 'published');
    if (params?.category) filtered = filtered.filter(p => p.category?.slug === params.category);
    if (params?.tag) filtered = filtered.filter(p => p.tags.some(t => t.slug === params.tag));
    if (params?.q) {
      const q = params.q.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.excerpt?.toLowerCase().includes(q));
    }
    return paginate(filtered, params?.page || 1, params?.limit || 10);
  }
  const qs = new URLSearchParams();
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  if (params?.category) qs.set('category', params.category);
  if (params?.tag) qs.set('tag', params.tag);
  if (params?.q) qs.set('q', params.q);
  return fetchAPI<PaginatedResult<Post>>(`/posts?${qs}`);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  if (isStatic) {
    const { mockPosts } = await import('./mock');
    return mockPosts.find(p => p.slug === slug && p.status === 'published') || null;
  }
  return fetchAPI<Post>(`/posts/${slug}`);
}

// ===== 分类标签 =====
export async function getCategories(): Promise<Category[]> {
  if (isStatic) {
    const { mockCategories } = await import('./mock');
    return mockCategories;
  }
  return fetchAPI<Category[]>('/categories');
}

export async function getTags(): Promise<Tag[]> {
  if (isStatic) {
    const { mockTags } = await import('./mock');
    return mockTags;
  }
  return fetchAPI<Tag[]>('/tags');
}

// ===== 追番 =====
export async function getAnimeList(status?: string): Promise<Anime[]> {
  if (isStatic) {
    const { mockAnime } = await import('./mock');
    return status && status !== 'all' ? mockAnime.filter(a => a.status === status) : mockAnime;
  }
  const qs = status ? `?status=${status}` : '';
  return fetchAPI<Anime[]>(`/anime${qs}`);
}

// ===== 友链 =====
export async function getLinks(): Promise<Link[]> {
  if (isStatic) {
    const { mockLinks } = await import('./mock');
    return mockLinks.filter(l => l.approved);
  }
  return fetchAPI<Link[]>('/links');
}

// ===== 图集 =====
export async function getAlbums(): Promise<Album[]> {
  if (isStatic) {
    const { mockAlbums } = await import('./mock');
    return mockAlbums;
  }
  return fetchAPI<Album[]>('/albums');
}

// ===== 日记 =====
export async function getDiaries(page = 1, limit = 30): Promise<PaginatedResult<DiaryEntry>> {
  if (isStatic) {
    const { mockDiaries, paginate } = await import('./mock');
    return paginate(mockDiaries, page, limit);
  }
  return fetchAPI<PaginatedResult<DiaryEntry>>(`/diary?page=${page}&limit=${limit}`);
}

// ===== 统计 =====
export async function getStats(): Promise<SiteStats> {
  if (isStatic) {
    const { mockStats } = await import('./mock');
    return mockStats;
  }
  return fetchAPI<SiteStats>('/stats');
}
