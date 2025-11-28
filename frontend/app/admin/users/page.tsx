'use client';

import {
  Badge,
  Button,
  Card,
  ConfirmModal,
  Container,
  FeatureTitleBar,
  IconButton,
  Input,
  Pagination,
  Stack,
  useToast,
} from '@/components/ui';
import { USER_ROLES } from '@/constants';
import type { User } from '@/features/user/types';
import { userActions } from '@/lib/actions';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { showToast } = useToast();
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const searchParams = useSearchParams();

  const loadUsers = async (page?: number) => {
    setLoading(true);
    const p = page && page > 0 ? page : Number(searchParams.get('page') || 1);
    const keyword = searchParams.get('keyword') || undefined;
    const result = await userActions.getUsers({ page: p, keyword }); // エラー時に自動でモーダル表示

    if (result.success && result.data) {
      const data = result.data;
      setUsers(data.items ?? []);
      const take = data.take || 20;
      setTotalPages(Math.max(1, Math.ceil((data.total || 0) / take)));
    }

    setLoading(false);
  };

  useEffect(() => {
    const p = Number(searchParams.get('page') || 1);
    // 初期検索語をステートに反映
    setSearchTerm(searchParams.get('keyword') || '');
    loadUsers(p);
  }, [searchParams]);

  const handleSearch = (term?: string) => {
    const kw = typeof term === 'string' ? term : searchTerm;
    const pageQuery = `?${
      kw ? `page=1&keyword=${encodeURIComponent(kw)}` : ''
    }`;
    // if kw empty, navigate to base users path
    if (kw)
      router.push(`/admin/users?page=1&keyword=${encodeURIComponent(kw)}`);
    else router.push(`/admin/users`);
  };

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
            <div className="flex items-center space-x-2">
              <div className="w-72">
                <Input
                  placeholder="検索 (名前 or メール)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onEnter={() => handleSearch()}
                  trailing={
                    <IconButton
                      icon="Search"
                      onClick={() => handleSearch()}
                      aria-label="検索"
                    />
                  }
                />
              </div>
            </div>
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
          <div className="px-4 py-4 flex justify-center">
            <Pagination
              page={Number(searchParams.get('page') || 1)}
              totalPages={totalPages}
              onPageChange={(p) => {
                const pageQuery = p > 1 ? `?page=${p}` : '';
                router.push(`/admin/users${pageQuery}`);
              }}
            />
          </div>
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
