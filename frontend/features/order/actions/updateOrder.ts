'use server';

import { apiServer } from '@/lib/api/client';

export type UpdateOrderInput = {
  amount?: number;
  currency?: string;
  itemsCount?: number;
  orderChannel?: string;
  category?: string;
  status?: string;
};

export async function updateOrder(id: string, data: UpdateOrderInput) {
  return apiServer(`/api/orders/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
