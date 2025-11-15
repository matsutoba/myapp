'use server';

import { apiServer } from '@/lib/api/client';
import type { Customer } from '../types';

export async function getCustomers() {
  return apiServer<Customer[]>('/api/customers', {
    method: 'GET',
  });
}

export async function getCustomerById(id: number) {
  return apiServer<Customer>(`/api/customers/${id}`, {
    method: 'GET',
  });
}
