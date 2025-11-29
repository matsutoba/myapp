'use client';

import type { Customer } from '@/features/customer/types';
import { actions } from '@/lib/actions';
import { useCallback, useEffect, useRef, useState } from 'react';

export type UseCustomersOptions = {
  take?: number;
  skip?: number;
  page?: number;
  keyword?: string;
};

export function useCustomers(
  opts?: UseCustomersOptions,
  initial?: {
    customers?: Customer[];
    total?: number;
    take?: number;
    skip?: number;
  },
) {
  const [customers, setCustomers] = useState<Customer[]>(
    initial?.customers ?? [],
  );
  const [loading, setLoading] = useState<boolean>(initial ? false : true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number | null>(initial?.total ?? null);
  const [take, setTake] = useState<number | null>(initial?.take ?? null);
  const [skip, setSkip] = useState<number | null>(initial?.skip ?? null);

  const mountedRef = useRef(true);

  const fetchCustomers = useCallback(
    async (override?: UseCustomersOptions) => {
      setLoading(true);
      setError(null);
      try {
        const merged = { ...(opts ?? {}), ...(override ?? {}) };
        const res = await actions.customer.getCustomers({
          take: merged.take,
          skip: merged.skip,
          page: merged.page,
          keyword: merged.keyword,
        });
        if (!mountedRef.current) return;

        if (res.success && res.data) {
          // data may be an array or a paged response
          const raw = res.data as any;
          if (Array.isArray(raw)) {
            setCustomers(raw as Customer[]);
            setTotal(null);
            setTake(null);
            setSkip(null);
          } else {
            setCustomers(raw.items ?? []);
            setTotal(raw.total ?? null);
            setTake(raw.take ?? null);
            setSkip(raw.skip ?? null);
          }
        } else {
          setCustomers([]);
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
      void fetchCustomers();
    }
    return () => {
      mountedRef.current = false;
    };
  }, [fetchCustomers, initial]);

  return {
    customers,
    loading,
    error,
    total,
    take,
    skip,
    refresh: fetchCustomers,
  } as const;
}
