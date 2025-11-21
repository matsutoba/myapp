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
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="6文字以上"
                helperText="最低6文字以上で設定してください"
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
                  {isSubmitting ? '作成中...' : '作成'}
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
