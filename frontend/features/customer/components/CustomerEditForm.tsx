import { Button, Input, Notification, Stack } from '@/components/ui';
import type { UpdateCustomerRequest } from '@/features/customer/types';
import type { User } from '@/features/user/types';
import React from 'react';

type Props = {
  formData: UpdateCustomerRequest & { contactName?: string; email?: string };
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  error?: string;
  onCancel: () => void;
  users?: User[];
};

export default function CustomerEditForm({
  formData,
  onChange,
  onSubmit,
  isSubmitting,
  error,
  onCancel,
  users,
}: Props) {
  return (
    <form onSubmit={onSubmit}>
      <Stack spacing="md">
        {error && <Notification variant="error">{error}</Notification>}

        <Input
          type="text"
          id="company"
          name="company"
          label="会社名"
          value={String(formData.company ?? '')}
          onChange={onChange}
          placeholder="会社名"
        />

        <Input
          type="text"
          id="contactName"
          name="contactName"
          label="担当者名"
          value={String(formData.contactName ?? '')}
          onChange={onChange}
          placeholder="担当者名"
        />

        <Input
          type="email"
          id="email"
          name="email"
          label="メールアドレス"
          value={String(formData.email ?? '')}
          onChange={onChange}
          placeholder="user@example.com"
        />

        <Input
          type="text"
          id="phone"
          name="phone"
          label="電話番号"
          value={String(formData.phone ?? '')}
          onChange={onChange}
          placeholder="090-0000-0000"
        />

        <Input
          type="text"
          id="address"
          name="address"
          label="住所"
          value={String(formData.address ?? '')}
          onChange={onChange}
          placeholder="東京都"
        />

        <Input
          type="url"
          id="website"
          name="website"
          label="Website"
          value={String(formData.website ?? '')}
          onChange={onChange}
          placeholder="https://example.com"
        />

        <Input
          type="text"
          id="tagsStr"
          name="tagsStr"
          label="Tags (comma separated)"
          value={
            Array.isArray(formData.tags)
              ? (formData.tags as string[]).join(', ')
              : String(formData.tags ?? '')
          }
          onChange={onChange}
          placeholder="vip,lead"
        />

        <label className="block text-sm font-medium text-gray-700">
          ステータス
        </label>
        <select
          id="status"
          name="status"
          value={String(formData.status ?? '')}
          onChange={onChange}
          className="mt-1 block w-full border rounded-md px-2 py-1"
        >
          <option value="">--</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="prospect">Prospect</option>
        </select>

        <label className="block text-sm font-medium text-gray-700">
          担当者
        </label>
        <select
          id="ownerId"
          name="ownerId"
          value={formData.ownerId == null ? '' : String(formData.ownerId)}
          onChange={onChange}
          className="mt-1 block w-full border rounded-md px-2 py-1"
        >
          <option value="">-- 未選択 --</option>
          {(users ?? []).map((u: User) => (
            <option key={u.id} value={String(u.id)}>
              {u.name} ({u.email})
            </option>
          ))}
        </select>

        <label className="block text-sm font-medium text-gray-700">
          最終コンタクト日時
        </label>
        <Input
          type="datetime-local"
          id="lastContactedAt"
          name="lastContactedAt"
          value={String(formData.lastContactedAt ?? '')}
          onChange={onChange}
        />

        <label className="block text-sm font-medium text-gray-700">
          次回アクション日時
        </label>
        <Input
          type="datetime-local"
          id="nextActionAt"
          name="nextActionAt"
          value={String(formData.nextActionAt ?? '')}
          onChange={onChange}
        />

        <label className="block text-sm font-medium text-gray-700">メモ</label>
        <textarea
          id="notes"
          name="notes"
          value={String(formData.notes ?? '')}
          onChange={onChange}
          className="block w-full rounded border px-2 py-1"
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
