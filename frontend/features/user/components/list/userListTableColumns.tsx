import { Badge, IconButton } from '@/components/ui';
import { USER_ROLES } from '@/constants';
import type { User } from '@/features/user/types';
import { ColumnDef } from '@tanstack/react-table';

type CreateUserListTableColumnsArgs = {
  router: { push: (url: string) => void };
  onDelete: (id: number) => void;
};

export function createUserListTableColumns({
  router,
  onDelete,
}: CreateUserListTableColumnsArgs): ColumnDef<User>[] {
  return [
    {
      accessorKey: 'name',
      header: '名前',
      meta: { tdClass: 'max-w-0 min-w-24' },
      cell: (ctx) => {
        const v = ctx.getValue() as string | undefined;
        return <div className="truncate">{v ?? '-'}</div>;
      },
    },
    {
      accessorKey: 'email',
      header: 'メール',
      meta: { thClass: 'w-56', tdClass: 'w-56' },
    },
    {
      accessorKey: 'role',
      header: 'ロール',
      meta: { thClass: 'w-28', tdClass: 'w-28' },
      cell: ({ getValue }) => (
        <Badge variant={getValue() === USER_ROLES.ADMIN ? 'admin' : 'user'}>
          {String(getValue())}
        </Badge>
      ),
    },
    {
      accessorKey: 'isActive',
      header: 'ステータス',
      meta: { thClass: 'w-28', tdClass: 'w-28' },
      cell: ({ getValue }) => (
        <Badge variant={getValue() ? 'success' : 'danger'}>
          {getValue() ? '有効' : '無効'}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: '操作',
      meta: { thClass: 'w-26', tdClass: 'w-26' },
      cell: ({ row }) => (
        <div className="flex">
          <IconButton
            icon="Pencil"
            onClick={() => router.push(`/admin/users/${row.original.id}`)}
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

export default createUserListTableColumns;
