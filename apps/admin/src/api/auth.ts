import api from './client';

export interface LoginParams {
  username: string;
  password: string;
}

export interface RegisterParams {
  username: string;
  email: string;
  password: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  role: 'ADMIN' | 'USER';
}

export async function login(params: LoginParams) {
  return api.post('/auth/login', params);
}

export async function register(params: RegisterParams) {
  return api.post('/auth/register', params);
}

export async function getMe() {
  return api.get('/auth/me');
}

export async function updateMe(params: Partial<Pick<RegisterParams, 'username'> & { avatar: string }>) {
  return api.put('/auth/me', params);
}
