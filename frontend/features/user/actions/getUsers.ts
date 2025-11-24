'use server';

import { apiServer } from '@/lib/api/client';
import type { User } from '../types';

export type UsersPagedResponse = {
  items: User[];
  total: number;
  skip: number;
  take: number;
};

type UsersResponse = User[] | UsersPagedResponse;

export async function getUsers(opts?: {
  page?: number;
  skip?: number;
  take?: number;
  keyword?: string;
}) {
  const params = new URLSearchParams();
  if (opts?.page && opts.page > 0) {
    params.set('page', String(opts.page));
  } else if (typeof opts?.skip === 'number' || typeof opts?.take === 'number') {
    if (typeof opts.skip === 'number') params.set('skip', String(opts.skip));
    if (typeof opts.take === 'number') params.set('take', String(opts.take));
  }
  if (opts?.keyword) {
    params.set('keyword', opts.keyword);
  }

  const query = params.toString() ? `?${params.toString()}` : '';
  return apiServer<UsersResponse>(`/api/users${query}`, {
    method: 'GET',
  });
}

export async function getUserById(id: number) {
  return apiServer<User>(`/api/users/${id}`, {
    method: 'GET',
  });
}
