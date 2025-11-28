'use server';

import { apiServer } from '@/lib/api/client';
import type { CreateCustomerRequest, Customer } from '../types';

export async function createCustomer(data: CreateCustomerRequest) {
  // backend expects tags as a comma-separated string; normalize here
  const payload = {
    ...data,
    tags: Array.isArray(data.tags) ? data.tags.join(',') : data.tags,
  };
  return apiServer<Customer>('/api/customers', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
