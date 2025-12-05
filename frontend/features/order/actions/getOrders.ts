'use server';

import { apiServer } from '@/lib/api/client';

export type Order = {
  id: string;
  customerId?: string;
  customerName?: string;
  total?: number;
  status?: string;
  createdAt?: string;
};

export type OrdersPagedResponse = {
  items: Order[];
  total: number;
  skip: number;
  take: number;
};

type OrdersResponse = Order[] | OrdersPagedResponse;

export async function getOrders(opts?: {
  page?: number;
  skip?: number;
  take?: number;
  keyword?: string;
}) {
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
  return apiServer<OrdersResponse>(`/api/orders/list${query}`, {
    method: 'GET',
  });
}

export async function getOrderById(id: string) {
  return apiServer<Order>(`/api/orders/${id}`, {
    method: 'GET',
  });
}
