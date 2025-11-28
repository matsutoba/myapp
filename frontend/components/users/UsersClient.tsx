'use client';

import {
  Button,
  Card,
  ConfirmModal,
  Container,
  FeatureTitleBar,
  IconButton,
  Input,
  Pagination,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from '@/components/ui';
import { PAGINATION_DEFAULT_TAKE } from '@/constants';
import { useUsers, UseUsersOptions } from '@/features/user/hooks/useUsers';
import { userActions } from '@/lib/actions';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { createUserColumns } from './userTableColumns';

export default function UsersClient({ opts }: { opts?: UseUsersOptions }) {
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
  const { showToast } = useToast();
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

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
    }
  };

  const takeVal = Number(
    searchParams.get('take') || take || PAGINATION_DEFAULT_TAKE,
  );
  const skipVal = Number(searchParams.get('skip') || 0);
  const currentPage = Math.floor(skipVal / takeVal) + 1;
  const totalPages = Math.max(
    1,
    Math.ceil((total || 0) / (takeVal || PAGINATION_DEFAULT_TAKE)),
  );

  const handlePageChange = (p: number) => {
    const newSkip = (p - 1) * takeVal;
    const pageQuery =
      newSkip > 0 ? `?skip=${newSkip}&take=${takeVal}` : `?take=${takeVal}`;
    router.push(`/admin/users${pageQuery}`);
  };

  const columns = React.useMemo(
    () => createUserColumns({ router, onDelete: handleDeleteClick }),
    [router, handleDeleteClick],
  );

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) return <div>読み込み中...</div>;

  return (
    <div>
      <FeatureTitleBar title="ユーザー管理" />
      <Container>
        <Stack spacing="lg">
          <Stack direction="horizontal" justify="between" align="center">
            <div className="flex items-center space-x-2">
              <div className="w-72">
                <Input
                  placeholder="検索 (名前 or メール)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onEnter={() => handleSearch()}
                  trailing={
                    <IconButton
                      icon="Search"
                      onClick={() => handleSearch()}
                      aria-label="検索"
                    />
                  }
                />
              </div>
            </div>
            <Button size="sm" onClick={() => router.push('/admin/users/new')}>
              新規作成
            </Button>
          </Stack>
          <Card padding="none" className="overflow-hidden">
            <Table>
              <Thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <Th key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </Th>
                    ))}
                  </Tr>
                ))}
              </Thead>
              <Tbody>
                {table.getRowModel().rows.map((row) => (
                  <Tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <Td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Card>
          <div className="px-4 py-4 flex justify-center">
            <Pagination
              page={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </Stack>
      </Container>

      <ConfirmModal
        open={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setDeleteTargetId(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="削除確認"
        message="本当に削除しますか？"
        confirmText="削除"
        cancelText="キャンセル"
        variant="danger"
      />
    </div>
  );
}
