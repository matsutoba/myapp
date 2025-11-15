'use server';

import { apiServer } from '@/lib/api/client';
import type { CreateUserRequest, User } from '../types';

export async function createUser(data: CreateUserRequest) {
  return apiServer<User>('/api/users', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
