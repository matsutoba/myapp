'use server';

import { apiServer } from '@/lib/api/client';
import type { UpdateUserRequest, User } from '../types';

export async function updateUser(id: number, data: UpdateUserRequest) {
  return apiServer<User>(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteUser(id: number) {
  return apiServer<{ message: string }>(`/api/users/${id}`, {
    method: 'DELETE',
  });
}
