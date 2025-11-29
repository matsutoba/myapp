'use client';

import {
  Button,
  ConfirmModal,
  Container,
  FeatureTitleBar,
  Pagination,
  Spinner,
  Stack,
  TextField,
} from '@/components/ui';
import UserListTable from '@/features/user/components/list/UserListTable';
import { createUserListTableColumns } from '@/features/user/components/list/userListTableColumns';
import useUserList from '@/features/user/hooks/useUserList';
import { UseUsersOptions } from '@/features/user/hooks/useUsers';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import React from 'react';

export default function UserList({ opts }: { opts?: UseUsersOptions }) {
  const {
    router,
    users,
    loading,
    showConfirmModal,
    setShowConfirmModal,
    deleteTargetId,
    setDeleteTargetId,
    handleSearch,
    handleDeleteClick,
    handleDeleteConfirm,
    searchTerm,
    setSearchTerm,
    currentPage,
    totalPages,
    handlePageChange,
  } = useUserList(opts);

  const columns = React.useMemo(
    () => createUserListTableColumns({ router, onDelete: handleDeleteClick }),
    [router, handleDeleteClick],
  );

  const table = useReactTable({
    data: users,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) return <Spinner mask open />;

  return (
    <div>
      <FeatureTitleBar title="ユーザー管理" />
      <Container>
        <Stack spacing="lg">
          <Stack direction="horizontal" justify="between" align="center">
            <div className="flex items-center space-x-2">
              <div className="w-72">
                <TextField
                  placeholder="検索 (名前 or メール)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onEnter={() => handleSearch()}
                  onClear={() => {
                    setSearchTerm('');
                    handleSearch('');
                  }}
                />
              </div>
            </div>
            <Button size="sm" onClick={() => router.push('/admin/users/new')}>
              新規作成
            </Button>
          </Stack>

          <UserListTable
            table={table}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

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
