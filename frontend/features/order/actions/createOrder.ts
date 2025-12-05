'use server';

import { apiServer } from '@/lib/api/client';

export type CreateOrderInput = {
  customerId?: string | number | undefined;
  amount: number;
  currency?: string;
  itemsCount?: number;
  orderChannel?: 'web' | 'app' | 'store' | 'phone' | string;
  category?: string;
  status?: 'completed' | 'pending' | 'refunded' | string;
};

export async function createOrder(data: CreateOrderInput) {
  // Normalize and send only expected fields to the backend.
  const payload = {
    customerId:
      data?.customerId === undefined || data?.customerId === ''
        ? undefined
        : Number(data.customerId),
    amount:
      typeof data?.amount === 'number'
        ? data.amount
        : Number(data?.amount) || 0,
    currency: data?.currency || undefined,
    itemsCount:
      typeof data?.itemsCount === 'number' ? data.itemsCount : undefined,
    orderChannel: data?.orderChannel || undefined,
    category: data?.category || undefined,
    status: data?.status || undefined,
  };

  return apiServer<{
    id: number;
    customerId?: number;
    total?: number;
  }>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
