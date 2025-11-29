import {
  Button,
  Input,
  Notification,
  Select,
  Stack,
  TextField,
} from '@/components/ui';
import { userEditSchema, type UserEditForm } from '@/features/user/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

type FormValues = UserEditForm & { isActive?: boolean | null };

type Props = {
  formData: FormValues;
  onSubmit: (values: FormValues) => void;
  isSubmitting: boolean;
  error?: string;
  onCancel: () => void;
};

export default function UserEditForm({
  formData,
  onSubmit,
  isSubmitting,
  error,
  onCancel,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<any>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      ...formData,
      isActive:
        typeof formData.isActive === 'boolean'
          ? String(formData.isActive)
          : 'true',
    },
  });

  useEffect(() => {
    // 親からの読み込み完了後にフォームをリセットしてデフォルト値を反映
    reset(formData);
  }, [formData, reset]);

  const internalSubmit = (values: any) => {
    // isActive は select から文字列 'true'/'false' で来るため boolean に変換
    const normalized = {
      ...values,
      isActive:
        typeof values.isActive === 'string'
          ? values.isActive === 'true'
          : values.isActive,
    } as FormValues;
    onSubmit(normalized);
  };

  return (
    <form onSubmit={handleSubmit(internalSubmit)}>
      <Stack spacing="md">
        {error && <Notification variant="error">{error}</Notification>}

        <TextField
          id="name"
          {...register('name')}
          label="名前"
          required
          placeholder="山田太郎"
          error={errors.name?.message as string | undefined}
        />

        <Input
          type="email"
          id="email"
          {...register('email')}
          label="メールアドレス"
          required
          placeholder="user@example.com"
          error={errors.email?.message as string | undefined}
        />

        <Input
          type="password"
          id="password"
          {...register('password')}
          label="パスワード"
          placeholder="変更する場合のみ入力"
          helperText="変更しない場合は空のままにしてください"
          error={errors.password?.message as string | undefined}
        />

        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <Select
              id="role"
              label="ロール"
              required
              value={field.value}
              onChange={(e: any) => field.onChange(e.target.value)}
              options={[
                { value: 'user', label: '一般ユーザー' },
                { value: 'admin', label: '管理者' },
              ]}
            />
          )}
        />

        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <Select
              id="isActive"
              label="ステータス"
              required
              value={field.value}
              onChange={(e: any) => field.onChange(e.target.value)}
              options={[
                { value: 'true', label: '有効' },
                { value: 'false', label: '無効' },
              ]}
            />
          )}
        />

        <Stack direction="horizontal" spacing="sm">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '更新中...' : '更新'}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            キャンセル
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
