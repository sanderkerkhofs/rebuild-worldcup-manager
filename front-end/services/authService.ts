import { apiRequest } from '../lib/api';
import { SafeUser } from '../types';

export async function register(username: string, password: string) {
  return apiRequest<{ token: string; user: SafeUser }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
}

export async function login(username: string, password: string) {
  return apiRequest<{ token: string; user: SafeUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password })
  });
}

export async function me() {
  return apiRequest<SafeUser>('/auth/me');
}
