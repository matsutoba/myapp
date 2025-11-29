'use client';

import {
  Button,
  ConfirmModal,
  Container,
  FeatureTitleBar,
  IconButton,
  Input,
  Pagination,
  Spinner,
  Stack,
} from '@/components/ui';
import CustomerListTable from '@/features/customer/components/CustomerListTable';
import { createCustomerListTableColumns } from '@/features/customer/components/customerListTableColumns';
import useCustomerList from '@/features/customer/hooks/useCustomerList';
import { UseCustomersOptions } from '@/features/customer/hooks/useCustomers';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import React from 'react';

export default function CustomerList({ opts }: { opts?: UseCustomersOptions }) {
  const {
    router,
    customers,
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
  } = useCustomerList(opts);

  const columns = React.useMemo(
    () =>
      createCustomerListTableColumns({ router, onDelete: handleDeleteClick }),
    [router, handleDeleteClick],
  );

  const table = useReactTable({
    data: customers,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) return <Spinner mask open />;

  return (
    <div>
      <FeatureTitleBar title="顧客管理" />
      <Container>
        <Stack spacing="lg">
          <Stack direction="horizontal" justify="between" align="center">
            <div className="flex items-center space-x-2">
              <div className="w-72">
                <Input
                  placeholder="検索 (会社名 or メール)"
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
            <Button size="sm" onClick={() => router.push('/customers/new')}>
              新規作成
            </Button>
          </Stack>

          <CustomerListTable
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
