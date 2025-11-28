'use client';

import type { User } from '@/features/user/types';
import { actions } from '@/lib/actions';
import { useCallback, useEffect, useRef, useState } from 'react';

export type UseUsersOptions = {
  take?: number;
  skip?: number;
  page?: number;
  keyword?: string;
};

export function useUsers(opts?: UseUsersOptions) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [take, setTake] = useState<number | null>(null);
  const [skip, setSkip] = useState<number | null>(null);

  const mountedRef = useRef(true);

  const fetchUsers = useCallback(
    async (override?: UseUsersOptions) => {
      setLoading(true);
      setError(null);
      try {
        const merged = { ...(opts ?? {}), ...(override ?? {}) };
        const res = await actions.user.getUsers({
          take: merged.take,
          skip: merged.skip,
          page: merged.page,
          keyword: merged.keyword,
        });
        if (!mountedRef.current) return;
        const items: User[] =
          res.success && res.data ? res.data.items ?? [] : [];
        setUsers(items);
        if (res.success && res.data) {
          setTotal(res.data.total ?? null);
          setTake(res.data.take ?? null);
          setSkip(res.data.skip ?? null);
        } else {
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
    fetchUsers();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    total,
    take,
    skip,
    refresh: fetchUsers,
  } as const;
}
