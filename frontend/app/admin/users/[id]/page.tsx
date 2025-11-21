'use client';

import FeatureTitleBar from '@/components/FeatureTitleBar';
import { getUserById } from '@/features/user/actions/getUsers';
import { updateUser } from '@/features/user/actions/updateUser';
import type { UpdateUserRequest } from '@/features/user/types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [userId, setUserId] = useState<number | null>(null);
  const [formData, setFormData] = useState<UpdateUserRequest>({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    params.then((resolvedParams) => {
      const id = parseInt(resolvedParams.id);
      setUserId(id);
      loadUser(id);
    });
  }, []);

  const loadUser = async (id: number) => {
    setLoading(true);
    try {
      const result = await getUserById(id);

      if (result.success && result.data) {
        setFormData({
          name: result.data.name || '',
          email: result.data.email,
          password: '',
          role: result.data.role || 'user',
        });
      } else {
        setError(result.error?.message || 'ユーザーの取得に失敗しました');
      }
    } catch (err) {
      setError('予期しないエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setError('');
    setIsSubmitting(true);

    try {
      // パスワードが空の場合は送信しない
      const updateData: UpdateUserRequest = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const result = await updateUser(userId, updateData);

      if (result.success) {
        alert('ユーザーを更新しました');
        router.push('/admin/users');
      } else {
        setError(`ユーザーの更新に失敗しました。(${result.error?.message})`);
      }
    } catch (err) {
      setError('予期しないエラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-xl font-bold">ユーザー編集</h1>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error && !formData.email) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-xl font-bold">ユーザー編集</h1>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => router.push('/admin/users')}
            className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            一覧に戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <FeatureTitleBar title="ユーザー管理 > 編集" />
      <div className="p-4">
        <div className="bg-white shadow rounded-lg p-6 max-w-2xl">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                名前 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="山田太郎"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                メールアドレス <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="user@example.com"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                パスワード
              </label>
              <input
                type="password"
                id="password"
                name="password"
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="変更する場合のみ入力"
              />
              <p className="mt-1 text-sm text-gray-500">
                変更しない場合は空のままにしてください
              </p>
            </div>

            <div className="mb-6">
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                ロール <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">一般ユーザー</option>
                <option value="admin">管理者</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '更新中...' : '更新'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                キャンセル
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
