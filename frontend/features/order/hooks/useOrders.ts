'use client';

import { PAGINATION_DEFAULT_TAKE } from '@/constants';
import type { Order } from '@/features/order/actions/getOrders';
import { actions } from '@/lib/actions';
import { useCallback, useEffect, useRef, useState } from 'react';

export type UseOrdersOptions = {
  take?: number;
  skip?: number;
  page?: number;
  keyword?: string;
};

export function useOrders(
  opts?: UseOrdersOptions,
  initial?: { orders?: Order[]; total?: number; take?: number; skip?: number },
) {
  const [orders, setOrders] = useState<Order[]>(initial?.orders ?? []);
  const [loading, setLoading] = useState<boolean>(initial ? false : true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number | null>(initial?.total ?? null);
  const [take, setTake] = useState<number | null>(initial?.take ?? null);
  const [skip, setSkip] = useState<number | null>(initial?.skip ?? null);

  const mountedRef = useRef(true);

  const fetchOrders = useCallback(
    async (override?: UseOrdersOptions) => {
      setLoading(true);
      setError(null);
      try {
        const merged = { ...(opts ?? {}), ...(override ?? {}) };
        const res = await actions.order.getOrders({
          take: merged.take ?? PAGINATION_DEFAULT_TAKE,
          skip: merged.skip,
          page: merged.page,
          keyword: merged.keyword,
        });
        if (!mountedRef.current) return;

        if (res.success && res.data) {
          const raw = res.data as any;
          if (Array.isArray(raw)) {
            setOrders(raw as Order[]);
            setTotal(null);
            setTake(null);
            setSkip(null);
          } else {
            setOrders(raw.items ?? []);
            setTotal(raw.total ?? null);
            setTake(raw.take ?? null);
            setSkip(raw.skip ?? null);
          }
        } else {
          setOrders([]);
          setTotal(null);
          setTake(null);
          setSkip(null);
        }
      } catch (e) {
        console.error(e);
        if (!mountedRef.current) return;
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    },
    [opts?.take, opts?.skip, opts?.page, opts?.keyword],
  );

  useEffect(() => {
    mountedRef.current = true;
    if (!initial) {
      void fetchOrders();
    }
    return () => {
      mountedRef.current = false;
    };
  }, [fetchOrders, initial]);

  return {
    orders,
    loading,
    error,
    total,
    take,
    skip,
    refresh: fetchOrders,
  } as const;
}
