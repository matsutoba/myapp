'use server';

import { apiServer } from '@/lib/api/client';
import type { Customer, UpdateCustomerRequest } from '../types';

export async function updateCustomer(id: number, data: UpdateCustomerRequest) {
  return apiServer<Customer>(`/api/customers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteCustomer(id: number) {
  return apiServer<{ message: string }>(`/api/customers/${id}`, {
    method: 'DELETE',
  });
}
