'use client';

import {
  Button,
  ConfirmModal,
  Container,
  FeatureTitleBar,
  IconButton,
  Pagination,
  Spinner,
  Stack,
  TextField,
  useToast,
} from '@/components/ui';
import OrderListTable from '@/features/order/components/list/OrderListTable';
import { createOrderListTableColumns } from '@/features/order/components/list/orderListTableColumns';
import { useOrderList } from '@/features/order/hooks/useOrderList';
import type { UseOrdersOptions } from '@/features/order/hooks/useOrders';
import { actions } from '@/lib/actions';
import { getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function OrderList({
  opts,
}: {
  opts?: UseOrdersOptions | undefined;
}) {
  const router = useRouter();
  const {
    orders,
    loading,
    refresh,
    searchTerm,
    setSearchTerm,
    showConfirmModal,
    setShowConfirmModal,
    deleteTargetId,
    setDeleteTargetId,
    handleSearch,
    currentPage,
    totalPages,
    handlePageChange,
  } = useOrderList(opts);

  const { showToast } = useToast();

  const handleDeleteClick = React.useCallback(
    (id: number) => {
      setDeleteTargetId(id);
      setShowConfirmModal(true);
    },
    [setDeleteTargetId, setShowConfirmModal],
  );

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    const res = await actions.order.deleteOrder(deleteTargetId);
    if (res && res.success) {
      showToast({
        title: '削除しました',
        message: '注文を削除しました',
        variant: 'success',
        duration: 4000,
      });
      await refresh();
    } else {
      showToast({
        title: '削除に失敗しました',
        message: res?.error?.message || '',
        variant: 'error',
        duration: 6000,
      });
    }
    setShowConfirmModal(false);
    setDeleteTargetId(null);
  };

  // handlePageChange is provided by useOrderList/usePagination

  const columns = React.useMemo(
    () => createOrderListTableColumns({ router, onDelete: handleDeleteClick }),
    [router, handleDeleteClick],
  );

  const memoOrders = React.useMemo(() => orders ?? [], [orders]);

  // `useReactTable` returns functions that React Compiler cannot safely memoize.
  // We memoize `columns` and `data` above to avoid stale values; disable the
  // incompatible-library lint here to avoid noisy warnings.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: memoOrders,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) return <Spinner mask open />;

  // totalPages and takeVal are provided by the hook

  return (
    <div>
      <FeatureTitleBar title="注文管理" />
      <Container>
        <Stack spacing="lg">
          <Stack direction="horizontal" justify="between" align="center">
            <div className="flex items-center space-x-2">
              <div className="w-72">
                <TextField
                  placeholder="検索 (注文ID or 会社名)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onEnter={() => handleSearch()}
                  onClear={() => {
                    setSearchTerm('');
                    handleSearch('');
                  }}
                  trailing={
                    searchTerm && searchTerm !== '' ? (
                      <IconButton
                        icon="X"
                        onClick={() => {
                          setSearchTerm('');
                          handleSearch('');
                        }}
                        aria-label="検索条件をクリア"
                      />
                    ) : (
                      <IconButton
                        icon="Search"
                        onClick={() => handleSearch()}
                        aria-label="検索"
                      />
                    )
                  }
                />
              </div>
            </div>
            <Button size="sm" onClick={() => router.push('/orders/new')}>
              新規作成
            </Button>
          </Stack>

          <OrderListTable
            table={table}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />

          <ConfirmModal
            open={showConfirmModal}
            title="削除確認"
            message="本当に削除しますか？"
            confirmText="削除"
            cancelText="キャンセル"
            variant="danger"
            onClose={() => {
              setShowConfirmModal(false);
              setDeleteTargetId(null);
            }}
            onConfirm={handleDeleteConfirm}
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
    </div>
  );
}
