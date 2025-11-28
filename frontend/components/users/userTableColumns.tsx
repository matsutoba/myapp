import { Badge, IconButton } from '@/components/ui';
import { USER_ROLES } from '@/constants';
import { ColumnDef } from '@tanstack/react-table';

type CreateUserColumnsArgs = {
  router: any;
  onDelete: (id: number) => void;
};

export function createUserColumns({
  router,
  onDelete,
}: CreateUserColumnsArgs): ColumnDef<any>[] {
  return [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: '名前' },
    { accessorKey: 'email', header: 'メール' },
    {
      accessorKey: 'role',
      header: 'ロール',
      cell: ({ getValue }) => (
        <Badge variant={getValue() === USER_ROLES.ADMIN ? 'admin' : 'user'}>
          {String(getValue())}
        </Badge>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'ステータス',
      cell: ({ getValue }) => (
        <Badge variant={getValue() ? 'success' : 'danger'}>
          {getValue() ? '有効' : '無効'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: '操作',
      cell: ({ row }) => (
        <div className="inline-flex items-center space-x-2">
          <IconButton
            icon="Pencil"
            onClick={() => router.push(`/admin/users/${row.getValue('id')}`)}
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

export default createUserColumns;
