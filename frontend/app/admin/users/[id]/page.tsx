'use client';

import {
  Alert,
  Button,
  Card,
  Container,
  FeatureTitleBar,
  Input,
  Select,
  Stack,
} from '@/components/ui';
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
        <FeatureTitleBar title="ユーザー管理 > 編集" />
        <Container size="sm">
          <Card>
            <p className="text-gray-600">読み込み中...</p>
          </Card>
        </Container>
      </div>
    );
  }

  if (error && !formData.email) {
    return (
      <div>
        <FeatureTitleBar title="ユーザー管理 > 編集" />
        <Container size="sm">
          <Card>
            <Stack spacing="md">
              <Alert variant="error">{error}</Alert>
              <Button
                onClick={() => router.push('/admin/users')}
                variant="secondary"
              >
                一覧に戻る
              </Button>
            </Stack>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div>
      <FeatureTitleBar title="ユーザー管理 > 編集" />
      <Container size="sm">
        <Card>
          <form onSubmit={handleSubmit}>
            <Stack spacing="md">
              {error && <Alert variant="error">{error}</Alert>}

              <Input
                type="text"
                id="name"
                name="name"
                label="名前"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="山田太郎"
              />

              <Input
                type="email"
                id="email"
                name="email"
                label="メールアドレス"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="user@example.com"
              />

              <Input
                type="password"
                id="password"
                name="password"
                label="パスワード"
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="変更する場合のみ入力"
                helperText="変更しない場合は空のままにしてください"
              />

              <Select
                id="role"
                name="role"
                label="ロール"
                required
                value={formData.role}
                onChange={handleChange}
                options={[
                  { value: 'user', label: '一般ユーザー' },
                  { value: 'admin', label: '管理者' },
                ]}
              />

              <Stack direction="horizontal" spacing="sm">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? '更新中...' : '更新'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.back()}
                >
                  キャンセル
                </Button>
              </Stack>
            </Stack>
          </form>
        </Card>
      </Container>
    </div>
  );
}
