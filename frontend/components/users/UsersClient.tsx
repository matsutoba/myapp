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
import { PAGINATION_DEFAULT_TAKE, USER_ROLES } from '@/constants';
import { useUsers, UseUsersOptions } from '@/features/user/hooks/useUsers';
import { userActions } from '@/lib/actions';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UsersClient({ opts }: { opts?: UseUsersOptions }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const keywordFromUrl = searchParams.get('keyword') ?? undefined;
  const takeFromUrl = searchParams.get('take')
    ? Number(searchParams.get('take'))
    : undefined;
  const skipFromUrl = searchParams.get('skip')
    ? Number(searchParams.get('skip'))
    : undefined;

  const effectiveOpts: UseUsersOptions = {
    ...(opts ?? {}),
    keyword: keywordFromUrl ?? opts?.keyword,
    take: takeFromUrl ?? opts?.take,
    skip: skipFromUrl ?? opts?.skip,
  };

  const { users, loading, total, take, refresh } = useUsers(effectiveOpts);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { showToast } = useToast();
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const thClass =
    'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase';
  const tdClass = 'px-6 py-4 whitespace-nowrap text-sm text-gray-900';

  useEffect(() => {
    setSearchTerm(keywordFromUrl ?? opts?.keyword ?? '');
  }, [keywordFromUrl, opts?.keyword]);

  const loadUsers = async (page?: number) => {
    const takeVal = Number(
      searchParams.get('take') || take || PAGINATION_DEFAULT_TAKE,
    );
    const p =
      page && page > 0
        ? page
        : Math.floor(Number(searchParams.get('skip') || 0) / takeVal) + 1;
    const skip = (p - 1) * takeVal;
    const keyword = searchParams.get('keyword') || undefined;
    await refresh({ skip, take: takeVal, keyword });
  };

  const handleSearch = (term?: string) => {
    const kw = typeof term === 'string' ? term : searchTerm;
    if (kw)
      router.push(
        `/admin/users?skip=0&take=${PAGINATION_DEFAULT_TAKE}&keyword=${encodeURIComponent(
          kw,
        )}`,
      );
    else router.push(`/admin/users`);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
    setShowConfirmModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteTargetId === null) return;
    const result = await userActions.deleteUser(deleteTargetId);
    if (result.success) {
      showToast({
        title: '削除しました',
        message: 'ユーザーを削除しました',
        variant: 'success',
        duration: 4000,
      });
      void refresh();
    }
  };

  if (loading) return <div>読み込み中...</div>;

  const takeVal = Number(
    searchParams.get('take') || take || PAGINATION_DEFAULT_TAKE,
  );
  const skipVal = Number(searchParams.get('skip') || 0);
  const currentPage = Math.floor(skipVal / takeVal) + 1;
  const totalPages = Math.max(
    1,
    Math.ceil((total || 0) / (takeVal || PAGINATION_DEFAULT_TAKE)),
  );

  const handlePageChange = (p: number) => {
    const newSkip = (p - 1) * takeVal;
    const pageQuery =
      newSkip > 0 ? `?skip=${newSkip}&take=${takeVal}` : `?take=${takeVal}`;
    router.push(`/admin/users${pageQuery}`);
  };

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
                  <th className={thClass}>ID</th>
                  <th className={thClass}>名前</th>
                  <th className={thClass}>メール</th>
                  <th className={thClass}>ロール</th>
                  <th className={thClass}>ステータス</th>
                  <th className={thClass}>操作</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className={tdClass}>{user.id}</td>
                    <td className={tdClass}>{user.name}</td>
                    <td className={tdClass}>{user.email}</td>
                    <td className={tdClass}>
                      <Badge
                        variant={
                          user.role === USER_ROLES.ADMIN ? 'admin' : 'user'
                        }
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className={tdClass}>
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
              page={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </Stack>
      </Container>

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
