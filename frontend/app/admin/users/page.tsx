'use client';

import FeatureTitleBar from '@/components/FeatureTitleBar';
import { USER_ROLES } from '@/constants';
import { getUsers } from '@/features/user/actions/getUsers';
import { deleteUser } from '@/features/user/actions/updateUser';
import type { User } from '@/features/user/types';
import { Pencil, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    const result = await getUsers();
    if (result.success && result.data) {
      setUsers(result.data);
    } else {
      setError(result.error?.message || 'ユーザーの取得に失敗しました');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('本当に削除しますか？')) return;
    const result = await deleteUser(id);
    if (result.success) {
      alert('削除しました');
      loadUsers();
    } else {
      alert(`削除失敗: ${result.error?.message || '不明なエラー'}`);
    }
  };

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <FeatureTitleBar title="ユーザー管理" />
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.push('/admin/users/new')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            新規作成
          </button>
        </div>
        <div className="bg-white shadow rounded-lg overflow-hidden">
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
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        user.role === USER_ROLES.ADMIN
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        user.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.isActive ? '有効' : '無効'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => router.push(`/admin/users/${user.id}`)}
                      className="hover:bg-gray-200 rounded-full p-1"
                    >
                      <Pencil size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="hover:bg-gray-200 rounded-full p-1"
                    >
                      <Trash size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
