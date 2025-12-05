import { IconButton } from '@/components/ui';
import { ColumnDef } from '@tanstack/react-table';

type Order = {
  id: string;
  customerName?: string;
  total?: number;
};

type CreateOrderListTableColumnsArgs = {
  router: any;
  onDelete: (id: number) => void;
};

export function createOrderListTableColumns({
  router,
  onDelete,
}: CreateOrderListTableColumnsArgs): ColumnDef<Order>[] {
  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: 'customerName',
      header: '顧客',
      cell: (ctx) => ctx.getValue() ?? '-',
    },
    {
      accessorKey: 'total',
      header: '合計',
      cell: (ctx) => {
        const v = ctx.getValue() as number | undefined;
        return v != null ? `¥${v.toLocaleString()}` : '-';
      },
    },
    {
      id: 'actions',
      header: '操作',
      cell: ({ row }) => {
        const id = row.original.id;
        return (
          <div className="flex gap-2">
            <IconButton
              icon="FileText"
              onClick={() => router.push(`/orders/${id}`)}
              aria-label="詳細"
            />

            <IconButton
              icon="Pencil"
              onClick={() => router.push(`/orders/${id}/edit`)}
              aria-label="編集"
            />
            <IconButton
              icon="Trash"
              onClick={() => onDelete(Number(id))}
              aria-label="削除"
            />
          </div>
        );
      },
    },
  ];

  return columns;
}

export default createOrderListTableColumns;
