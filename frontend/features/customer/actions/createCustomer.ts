'use server';

import { apiServer } from '@/lib/api/client';
import type { CreateCustomerRequest, Customer } from '../types';

export async function createCustomer(data: CreateCustomerRequest) {
  return apiServer<Customer>('/api/customers', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
