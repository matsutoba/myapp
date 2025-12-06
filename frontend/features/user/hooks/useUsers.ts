'use client';

import type { User } from '@/features/user/types';
import { actions } from '@/lib/actions';
import { useCallback, useEffect, useRef, useState } from 'react';

/* eslint-disable react-hooks/exhaustive-deps */

export type UseUsersOptions = {
  take?: number;
  skip?: number;
  page?: number;
  keyword?: string;
};

export function useUsers(
  opts?: UseUsersOptions,
  initial?: { users?: User[]; total?: number; take?: number; skip?: number },
) {
  const [users, setUsers] = useState<User[]>(initial?.users ?? []);
  const [loading, setLoading] = useState<boolean>(initial ? false : true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number | null>(initial?.total ?? null);
  const [take, setTake] = useState<number | null>(initial?.take ?? null);
  const [skip, setSkip] = useState<number | null>(initial?.skip ?? null);

  const mountedRef = useRef(true);

  const optsKey = JSON.stringify(opts ?? {});

  // フェッチ用コールバックを作成します。
  // 呼び出し側が内容は同じだが参照が新しいオブジェクトを渡した場合でも
  // 不要にコールバックを再生成しないよう、オプションをシリアライズした
  // 文字列キー（`optsKey`）に依存します。
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
    [optsKey],
  );

  // 最新の fetch 関数を参照するための ref を保持します。
  // メインの effect は関数の参照(identity)に依存させず、安定した
  // `optsKey` に依存して呼び出すため、参照は新しいが内容が同じオブジェクトを
  // 渡した場合の effect の不必要な再実行を防ぎます。
  const fetchRef = useRef<typeof fetchUsers | null>(null);
  useEffect(() => {
    fetchRef.current = fetchUsers;
  }, [fetchUsers]);

  useEffect(() => {
    mountedRef.current = true;
    if (!initial) {
      void fetchRef.current?.();
    }
    return () => {
      mountedRef.current = false;
    };
  }, [optsKey, initial]);

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
