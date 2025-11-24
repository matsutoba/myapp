'use server';

import { apiServer } from '@/lib/api/client';
import type { Customer, UpdateCustomerRequest } from '../types';

export async function updateCustomer(id: number, data: UpdateCustomerRequest) {
  // Normalize tags to comma-separated string for backend
  const payload = {
    ...data,
    tags: Array.isArray(data.tags) ? data.tags.join(',') : data.tags,
  } as unknown as UpdateCustomerRequest;
  return apiServer<Customer>(`/api/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
}

export async function deleteCustomer(id: number) {
  return apiServer<{ message: string }>(`/api/customers/${id}`, {
    method: 'DELETE',
  });
}
