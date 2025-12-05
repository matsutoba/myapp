import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

type Order = {
  id: string;
  customerName?: string;
  total?: number;
};

export function createOrderListTableColumns({
  onDelete,
}: { onDelete?: (id: string) => void } = {}) {
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
            <Link
              href={`/orders/${id}`}
              className="text-blue-600 hover:underline"
            >
              詳細
            </Link>
            <Link
              href={`/orders/${id}/edit`}
              className="text-green-600 hover:underline"
            >
              編集
            </Link>
            {onDelete ? (
              <button
                className="text-red-600 hover:underline"
                onClick={() => onDelete(id)}
              >
                削除
              </button>
            ) : null}
          </div>
        );
      },
    },
  ];

  return columns;
}

export default createOrderListTableColumns;
