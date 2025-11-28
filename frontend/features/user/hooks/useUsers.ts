'use client';

import type { User } from '@/features/user/types';
import { actions } from '@/lib/actions';
import { useCallback, useEffect, useRef, useState } from 'react';

export type UseUsersOptions = { take?: number; skip?: number };

export function useUsers(opts?: UseUsersOptions) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const mountedRef = useRef(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await actions.user.getUsers({
        take: opts?.take,
        skip: opts?.skip,
      });
      if (!mountedRef.current) return;
      const items: User[] =
        res.success && res.data
          ? Array.isArray(res.data)
            ? res.data
            : res.data.items ?? []
          : [];
      setUsers(items);
    } catch (e) {
      console.error(e);
      if (!mountedRef.current) return;
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [opts?.take, opts?.skip]);

  useEffect(() => {
    mountedRef.current = true;
    fetchUsers();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchUsers]);

  return { users, loading, error } as const;
}
