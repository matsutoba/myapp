import { IconButton } from '@/components/ui';
import { ColumnDef } from '@tanstack/react-table';

type CreateCustomerListTableColumnsArgs = {
  router: any;
  onDelete: (id: number) => void;
};

export function createCustomerListTableColumns({
  router,
  onDelete,
}: CreateCustomerListTableColumnsArgs): ColumnDef<any>[] {
  return [
    {
      accessorKey: 'company',
      header: '会社名',
      meta: { tdClass: 'max-w-0 min-w-24' },
      cell: (ctx) => {
        const v = ctx.getValue() as string | undefined;
        return <div className="truncate">{v ?? '-'}</div>;
      },
    },
    {
      accessorKey: 'contactName',
      header: '担当者',
      meta: { thClass: 'w-36', tdClass: 'w-36' },
    },
    {
      accessorKey: 'email',
      header: 'メール',
      meta: { thClass: 'w-56', tdClass: 'w-56' },
    },
    {
      id: 'actions',
      header: '操作',
      meta: { thClass: 'w-36', tdClass: 'w-36' },
      cell: ({ row }) => (
        <div className="flex">
          <IconButton
            icon="Plus"
            onClick={() =>
              router.push(
                `/orders/new?customerId=${encodeURIComponent(
                  String(row.original.id),
                )}`,
              )
            }
            aria-label="この顧客で注文を作成"
            title="この顧客で注文を作成"
          />
          <IconButton
            icon="Pencil"
            onClick={() => router.push(`/customers/${row.original.id}`)}
            aria-label="編集"
          />
          <IconButton
            icon="Trash"
            onClick={() => onDelete(Number(row.original.id))}
            aria-label="削除"
          />
        </div>
      ),
    },
  ];
}

export default createCustomerListTableColumns;
