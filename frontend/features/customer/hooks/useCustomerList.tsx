'use client';

import { useToast } from '@/components/ui';
import { PAGINATION_DEFAULT_TAKE } from '@/constants';
import {
  useCustomers,
  UseCustomersOptions,
} from '@/features/customer/hooks/useCustomers';
import { actions } from '@/lib/actions';
import usePagination from '@/lib/hooks/usePagination';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

export default function useCustomerList(opts?: UseCustomersOptions) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const keywordFromUrl = searchParams.get('keyword') ?? undefined;
  const takeFromUrl = searchParams.get('take')
    ? Number(searchParams.get('take'))
    : undefined;
  const skipFromUrl = searchParams.get('skip')
    ? Number(searchParams.get('skip'))
    : undefined;

  const effectiveOpts: UseCustomersOptions = useMemo(
    () => ({
      ...(opts ?? {}),
      keyword: keywordFromUrl ?? opts?.keyword,
      take: takeFromUrl ?? opts?.take,
      skip: skipFromUrl ?? opts?.skip,
    }),
    [opts, keywordFromUrl, takeFromUrl, skipFromUrl],
  );

  const { customers, loading, total, take, refresh } =
    useCustomers(effectiveOpts);

  const [searchTerm, setSearchTerm] = useState<string>(
    () => keywordFromUrl ?? opts?.keyword ?? '',
  );
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const { showToast } = useToast();

  // `searchTerm` の更新を次のマイクロタスクに遅延させます。
  // effect 内で同期的に `setState` を行うと即時に再レンダーが発生し
  // effect が再実行されることでレンダーループが起きる場合があります。
  // `await Promise.resolve()` によるマイクロタスクは遅延が極めて短く、
  // 現在のレンダー/エフェクト処理の完了を待ってから更新を行います。
  // また、クリーンアップ後に不要な state 更新が起きないように
  // キャンセルフラグを使って更新を防いでいます。
  useEffect(() => {
    const newVal = keywordFromUrl ?? opts?.keyword ?? '';
    let cancelled = false;
    (async () => {
      await Promise.resolve();
      if (!cancelled)
        setSearchTerm((prev) => (prev === newVal ? prev : newVal));
    })();
    return () => {
      cancelled = true;
    };
  }, [keywordFromUrl, opts?.keyword]);

  const loadCustomers = async (page?: number) => {
    const takeVal = Number(
      searchParams.get('take') || take || PAGINATION_DEFAULT_TAKE,
    );
    const p =
      page && page > 0
        ? page
        : Math.floor(Number(searchParams.get('skip') || 0) / takeVal) + 1;
    const skip = (p - 1) * takeVal;
    const keyword = searchParams.get('keyword') || undefined;
    await refresh({ skip, take: takeVal, keyword });
  };

  const handleSearch = (term?: string) => {
    const kw = typeof term === 'string' ? term : searchTerm;
    if (kw)
      router.push(
        `/customers?skip=0&take=${PAGINATION_DEFAULT_TAKE}&keyword=${encodeURIComponent(
          kw,
        )}`,
      );
    else router.push(`/customers`);
  };

  const handleDeleteClick = useCallback(
    (id: number) => {
      setDeleteTargetId(id);
      setShowConfirmModal(true);
    },
    [setDeleteTargetId, setShowConfirmModal],
  );

  const handleDeleteConfirm = async () => {
    if (deleteTargetId === null) return;
    const result = await actions.customer.deleteCustomer(deleteTargetId);
    if (result.success) {
      showToast({
        title: '削除しました',
        message: '顧客を削除しました',
        variant: 'success',
        duration: 4000,
      });
      void refresh();
      setShowConfirmModal(false);
      setDeleteTargetId(null);
    }
  };

  const { takeVal, skipVal, currentPage, totalPages, handlePageChange } =
    usePagination({
      takeFromHook: take ?? undefined,
      total: total ?? undefined,
      basePath: '/customers',
    });

  return {
    router,
    searchParams,
    customers,
    loading,
    total,
    take,
    refresh,
    searchTerm,
    setSearchTerm,
    showConfirmModal,
    setShowConfirmModal,
    deleteTargetId,
    setDeleteTargetId,
    loadCustomers,
    handleSearch,
    handleDeleteClick,
    handleDeleteConfirm,
    takeVal,
    skipVal,
    currentPage,
    totalPages,
    handlePageChange,
  } as const;
}
