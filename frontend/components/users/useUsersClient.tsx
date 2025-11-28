'use client';

import { useToast } from '@/components/ui';
import { PAGINATION_DEFAULT_TAKE } from '@/constants';
import { useUsers, UseUsersOptions } from '@/features/user/hooks/useUsers';
import { userActions } from '@/lib/actions';
import usePagination from '@/lib/hooks/usePagination';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function useUsersClient(opts?: UseUsersOptions) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const keywordFromUrl = searchParams.get('keyword') ?? undefined;
  const takeFromUrl = searchParams.get('take')
    ? Number(searchParams.get('take'))
    : undefined;
  const skipFromUrl = searchParams.get('skip')
    ? Number(searchParams.get('skip'))
    : undefined;

  const effectiveOpts: UseUsersOptions = {
    ...(opts ?? {}),
    keyword: keywordFromUrl ?? opts?.keyword,
    take: takeFromUrl ?? opts?.take,
    skip: skipFromUrl ?? opts?.skip,
  };

  const { users, loading, total, take, refresh } = useUsers(effectiveOpts);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    setSearchTerm(keywordFromUrl ?? opts?.keyword ?? '');
  }, [keywordFromUrl, opts?.keyword]);

  const loadUsers = async (page?: number) => {
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
        `/admin/users?skip=0&take=${PAGINATION_DEFAULT_TAKE}&keyword=${encodeURIComponent(
          kw,
        )}`,
      );
    else router.push(`/admin/users`);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId === null) return;
    const result = await userActions.deleteUser(deleteTargetId);
    if (result.success) {
      showToast({
        title: '削除しました',
        message: 'ユーザーを削除しました',
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
      basePath: '/admin/users',
    });

  return {
    router,
    searchParams,
    users,
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
    loadUsers,
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
