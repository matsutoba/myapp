'use server';

import { apiServer } from '@/lib/api/client';
import type { Customer } from '../types';

export type CustomersPagedResponse = {
  items: Customer[];
  total: number;
  skip: number;
  take: number;
};

type CustomersResponse = Customer[] | CustomersPagedResponse;

export async function getCustomers(opts?: { page?: number; skip?: number; take?: number; keyword?: string }) {
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
  return apiServer<CustomersResponse>(`/api/customers${query}`, {
    method: 'GET',
  });
}

export async function getCustomerById(id: number) {
  return apiServer<Customer>(`/api/customers/${id}`, {
    method: 'GET',
  });
}
