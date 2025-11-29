import {
  Button,
  Input,
  Notification,
  Select,
  Stack,
  TextField,
} from '@/components/ui';
import type { UpdateUserRequest } from '@/features/user/types';
import React from 'react';

type Props = {
  formData: UpdateUserRequest & { isActive?: boolean | null };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  error?: string;
  onCancel: () => void;
};

export default function UserEditForm({
  formData,
  onChange,
  onSubmit,
  isSubmitting,
  error,
  onCancel,
}: Props) {
  return (
    <form onSubmit={onSubmit}>
      <Stack spacing="md">
        {error && <Notification variant="error">{error}</Notification>}

        <TextField
          id="name"
          name="name"
          label="名前"
          required
          value={formData.name}
          onChange={onChange}
          placeholder="山田太郎"
        />

        <Input
          type="email"
          id="email"
          name="email"
          label="メールアドレス"
          required
          value={formData.email}
          onChange={onChange}
          placeholder="user@example.com"
        />

        <Input
          type="password"
          id="password"
          name="password"
          label="パスワード"
          minLength={6}
          value={formData.password}
          onChange={onChange}
          placeholder="変更する場合のみ入力"
          helperText="変更しない場合は空のままにしてください"
        />

        <Select
          id="role"
          name="role"
          label="ロール"
          required
          value={formData.role}
          onChange={onChange}
          options={[
            { value: 'user', label: '一般ユーザー' },
            { value: 'admin', label: '管理者' },
          ]}
        />

        <Select
          id="isActive"
          name="isActive"
          label="ステータス"
          required
          value={
            typeof formData.isActive === 'boolean'
              ? String(formData.isActive)
              : 'true'
          }
          onChange={onChange}
          options={[
            { value: 'true', label: '有効' },
            { value: 'false', label: '無効' },
          ]}
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
