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
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'company', header: '会社名' },
    { accessorKey: 'contactName', header: '担当者' },
    { accessorKey: 'email', header: 'メール' },
    {
      id: 'actions',
      header: '操作',
      cell: ({ row }) => (
        <div className="inline-flex items-center space-x-2">
          <IconButton
            icon="Pencil"
            onClick={() => router.push(`/customers/${row.getValue('id')}`)}
            aria-label="編集"
          />
          <IconButton
            icon="Trash"
            onClick={() => onDelete(Number(row.getValue('id')))}
            aria-label="削除"
          />
        </div>
      ),
    },
  ];
}

export default createCustomerListTableColumns;
