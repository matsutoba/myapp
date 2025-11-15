'use server';

import { apiServer } from '@/lib/api/client';
import type { User } from '../types';

export async function getUsers() {
  return apiServer<User[]>('/api/users', {
    method: 'GET',
  });
}

export async function getUserById(id: number) {
  return apiServer<User>(`/api/users/${id}`, {
    method: 'GET',
  });
}
