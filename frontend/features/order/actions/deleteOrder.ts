'use server';

import { apiServer } from '@/lib/api/client';

export async function deleteOrder(id: string) {
  return apiServer<void>(`/api/orders/${id}`, {
    method: 'DELETE',
  });
}
