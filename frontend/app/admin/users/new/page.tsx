'use client';

import FeatureTitleBar from '@/components/FeatureTitleBar';
import { createUser } from '@/features/user/actions/createUser';
import type { CreateUserRequest } from '@/features/user/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateUserRequest>({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setError('');
    setIsSubmitting(true);

    try {
      const result = await createUser(formData);

      if (result.success) {
        alert('ユーザーを作成しました');
        router.push('/admin/users');
      } else {
        setError(`ユーザーの作成に失敗しました。(${result.error?.message})`);
      }
    } catch (err) {
      setError('予期しないエラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <FeatureTitleBar title="ユーザー管理 > 新規作成" />
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
                パスワード <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="6文字以上"
              />
              <p className="mt-1 text-sm text-gray-500">
                最低6文字以上で設定してください
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
                {isSubmitting ? '作成中...' : '作成'}
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
