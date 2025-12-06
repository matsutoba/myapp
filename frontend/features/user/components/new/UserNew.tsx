'use client';

import {
  Button,
  Card,
  Container,
  FeatureTitleBar,
  Input,
  Select,
  Stack,
  TextField,
  useToast,
} from '@/components/ui';
import { createUser } from '@/features/user/actions/createUser';
import type { CreateUserRequest } from '@/features/user/types';
import {
  userCreateSchema,
  type UserCreateForm,
} from '@/features/user/validation';
import { getErrorMessage } from '@/lib/zod/getErrorMessage';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import type { Resolver } from 'react-hook-form';
import { useForm } from 'react-hook-form';

export default function UserNew() {
  const router = useRouter();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserCreateForm>({
    resolver: zodResolver(userCreateSchema) as Resolver<UserCreateForm>,
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'user',
    },
  });

  const onSubmit = async (data: UserCreateForm) => {
    const payload: CreateUserRequest = {
      name: data.name,
      email: data.email,
      password: data.password,
      role: data.role || 'user',
    };

    try {
      const result = await createUser(payload);
      if (result.success) {
        showToast({
          title: 'ユーザーを作成しました',
          message: '',
          variant: 'success',
          duration: 4000,
        });
        router.push('/admin/users');
      } else {
        // サーバー側のエラー表示は別途ハンドリング可
      }
    } catch {
      // noop
    }
  };

  return (
    <div>
      <FeatureTitleBar title="ユーザー管理 > 新規作成" />
      <Container size="sm">
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing="md">
              <TextField
                id="name"
                label="名前"
                placeholder="山田太郎"
                {...register('name')}
                error={getErrorMessage(errors.name)}
              />

              <Input
                type="email"
                id="email"
                label="メールアドレス"
                {...register('email')}
                placeholder="user@example.com"
                error={getErrorMessage(errors.email)}
              />

              <Input
                type="password"
                id="password"
                label="パスワード"
                {...register('password')}
                placeholder="8文字以上"
                helperText="最低8文字以上で設定してください"
                error={getErrorMessage(errors.password)}
              />

              <Select
                id="role"
                label="ロール"
                {...register('role')}
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
