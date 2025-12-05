'use server';

import { apiServer } from '@/lib/api/client';

export type CreateOrderInput = {
  customerId?: string;
  product: string;
  quantity: number;
};

export async function createOrder(data: CreateOrderInput) {
  // Ensure we only send expected fields to the backend.
  const payload = {
    customerId: data?.customerId ?? undefined,
    product: data?.product,
    quantity:
      typeof data?.quantity === 'number'
        ? data.quantity
        : Number(data?.quantity) || 1,
  };

  return apiServer<{ id: string; customerId?: string }>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
