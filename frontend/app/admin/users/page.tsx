'use client';

import {
  Badge,
  Button,
  Card,
  ConfirmModal,
  Container,
  FeatureTitleBar,
  IconButton,
  Stack,
  useToast,
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
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { showToast } = useToast();
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

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

  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId === null) return;
    const result = await userActions.deleteUser(deleteTargetId); // エラー時に自動でモーダル表示
    if (result.success) {
      showToast({
        title: '削除しました',
        message: 'ユーザーを削除しました',
        variant: 'success',
        duration: 4000,
      });
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
                        onClick={() => handleDeleteClick(user.id)}
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

      {/* 削除確認モーダル */}
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
