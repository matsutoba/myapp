'use client';

import {
  Badge,
  Button,
  Card,
  Container,
  FeatureTitleBar,
  IconButton,
  Stack,
} from '@/components/ui';
import { USER_ROLES } from '@/constants';
import type { User } from '@/features/user/types';
import { userActions } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);
    const result = await userActions.getUsers(); // エラー時に自動でモーダル表示
    if (result.success && result.data) {
      setUsers(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('本当に削除しますか?')) return;
    const result = await userActions.deleteUser(id); // エラー時に自動でモーダル表示
    if (result.success) {
      alert('削除しました');
      loadUsers();
    }
  };

  if (loading) return <div>読み込み中...</div>;

  return (
    <div>
      <FeatureTitleBar title="ユーザー管理" />
      <Container>
        <Stack spacing="lg">
          <Stack direction="horizontal" justify="between" align="center">
            <Button size="sm" onClick={() => router.push('/admin/users/new')}>
              新規作成
            </Button>
          </Stack>
          <Card padding="none" className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    名前
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    メール
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ロール
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    ステータス
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <Badge
                        variant={
                          user.role === USER_ROLES.ADMIN ? 'admin' : 'user'
                        }
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <Badge variant={user.isActive ? 'success' : 'danger'}>
                        {user.isActive ? '有効' : '無効'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <IconButton
                        icon="Pencil"
                        onClick={() => router.push(`/admin/users/${user.id}`)}
                        aria-label="編集"
                      />
                      <IconButton
                        icon="Trash"
                        onClick={() => handleDelete(user.id)}
                        aria-label="削除"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </Stack>
      </Container>
    </div>
  );
}
