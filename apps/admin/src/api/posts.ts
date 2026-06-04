import api from './client';

export interface PostData {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover?: string;
  status?: 'DRAFT' | 'PUBLISHED';
  categoryId?: number;
  tagIds?: number[];
}

export async function getPosts(params: { page?: number; limit?: number; q?: string } = {}) {
  return api.get('/posts', { params });
}

export async function getPost(id: string) {
  return api.get(`/posts/admin/${id}`);
}

export async function createPost(data: PostData) {
  return api.post('/posts', data);
}

export async function updatePost(id: number, data: Partial<PostData>) {
  return api.put(`/posts/${id}`, data);
}

export async function deletePost(id: number) {
  return api.delete(`/posts/${id}`);
}
