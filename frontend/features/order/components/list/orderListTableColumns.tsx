import { Badge, IconButton } from '@/components/ui';
import { ColumnDef } from '@tanstack/react-table';

type Order = {
  id: string;
  customerName?: string;
  total?: number;
  createdAt?: string;
  status?: string;
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
      accessorKey: 'id',
      header: '注文番号',
      meta: { thClass: 'w-24', tdClass: 'w-24' },
      cell: (ctx) => {
        const v = ctx.getValue() as string | number | undefined;
        return v != null ? String(v) : '-';
      },
    },
    {
      accessorKey: 'companyName',
      header: '会社名',
      meta: { tdClass: 'max-w-0 min-w-8' },
      cell: (ctx) => {
        const v = ctx.getValue() as string | undefined;
        return <div className="truncate">{v ?? '-'}</div>;
      },
    },
    {
      accessorKey: 'createdAt',
      header: '注文日',
      meta: { thClass: 'w-40', tdClass: 'w-40' },
      cell: (ctx) => {
        const v = ctx.getValue() as string | undefined;
        if (!v) return '-';
        try {
          const d = new Date(v);
          return d.toLocaleString();
        } catch {
          return v;
        }
      },
    },
    {
      accessorKey: 'total',
      header: '合計',
      meta: { thClass: 'w-36', tdClass: 'w-36 text-right' },
      cell: (ctx) => {
        const v = ctx.getValue() as number | undefined;
        return v != null ? (
          <div className="text-right">¥{v.toLocaleString()}</div>
        ) : (
          '-'
        );
      },
    },
    {
      accessorKey: 'status',
      header: 'ステータス',
      meta: { thClass: 'w-28', tdClass: 'w-28' },
      cell: ({ getValue }) => {
        const val = String(getValue() ?? '');
        const variant =
          val === 'completed'
            ? 'success'
            : val === 'cancelled'
            ? 'danger'
            : 'default';
        return <Badge variant={variant as any}>{val || '-'}</Badge>;
      },
    },
    {
      id: 'actions',
      header: '操作',
      meta: { thClass: 'w-36', tdClass: 'w-36' },
      cell: ({ row }) => {
        const id = row.original.id;
        return (
          <div className="flex">
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
