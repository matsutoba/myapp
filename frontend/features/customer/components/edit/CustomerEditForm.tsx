import { Button, Input, Notification, Stack, TextField } from '@/components/ui';
import {
  customerFormSchema,
  type CustomerForm,
} from '@/features/customer/validation';
import type { User } from '@/features/user/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';

type FormValues = CustomerForm & { ownerId?: string | null };

type Props = {
  formData: any;
  onSubmit: (values: FormValues) => void;
  isSubmitting: boolean;
  error?: string;
  onCancel: () => void;
  users?: User[];
};

export default function CustomerEditForm({
  formData,
  onSubmit,
  isSubmitting,
  error,
  onCancel,
  users,
}: Props) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<any>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      ...formData,
      ownerId: formData.ownerId == null ? '' : String(formData.ownerId),
      tagsStr: (formData as any).tagsStr ?? '',
      lastContactedAt: formData.lastContactedAt ?? '',
      nextActionAt: formData.nextActionAt ?? '',
    },
  });

  useEffect(() => {
    reset({
      ...formData,
      ownerId: formData.ownerId == null ? '' : String(formData.ownerId),
      tagsStr: (formData as any).tagsStr ?? '',
      lastContactedAt: formData.lastContactedAt ?? '',
      nextActionAt: formData.nextActionAt ?? '',
    });
  }, [formData, reset]);

  const internalSubmit = (values: any) => {
    onSubmit(values as FormValues);
  };

  return (
    <form onSubmit={handleSubmit(internalSubmit)}>
      <Stack spacing="md">
        {error && <Notification variant="error">{error}</Notification>}

        <TextField
          id="company"
          {...register('company')}
          label="会社名"
          placeholder="会社名"
          error={errors.company?.message as string | undefined}
        />

        <TextField
          id="contactName"
          {...register('contactName')}
          label="担当者名"
          placeholder="担当者名"
          error={errors.contactName?.message as string | undefined}
        />

        <TextField
          type="email"
          id="email"
          {...register('email')}
          label="メールアドレス"
          placeholder="user@example.com"
          error={errors.email?.message as string | undefined}
        />

        <TextField
          id="phone"
          {...register('phone')}
          label="電話番号"
          placeholder="090-0000-0000"
          error={errors.phone?.message as string | undefined}
        />

        <TextField
          id="address"
          {...register('address')}
          label="住所"
          placeholder="東京都"
          error={errors.address?.message as string | undefined}
        />

        <TextField
          type="url"
          id="website"
          {...register('website')}
          label="Website"
          placeholder="https://example.com"
          error={errors.website?.message as string | undefined}
        />

        <TextField
          id="tagsStr"
          {...register('tagsStr')}
          label="Tags (comma separated)"
          placeholder="vip,lead"
          error={errors.tagsStr?.message as string | undefined}
        />

        <label className="block text-sm font-medium text-gray-700">
          ステータス
        </label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <select
              id="status"
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value)}
              className="mt-1 block w-full border rounded-md px-2 py-1"
            >
              <option value="">--</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="prospect">Prospect</option>
            </select>
          )}
        />

        <label className="block text-sm font-medium text-gray-700">
          担当者
        </label>
        <Controller
          name="ownerId"
          control={control}
          render={({ field }) => (
            <select
              id="ownerId"
              value={field.value ?? ''}
              onChange={(e) => field.onChange(e.target.value)}
              className="mt-1 block w-full border rounded-md px-2 py-1"
            >
              <option value="">-- 未選択 --</option>
              {(users ?? []).map((u: User) => (
                <option key={u.id} value={String(u.id)}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          )}
        />

        <label className="block text-sm font-medium text-gray-700">
          最終コンタクト日時
        </label>
        <Input
          type="datetime-local"
          id="lastContactedAt"
          {...register('lastContactedAt')}
        />

        <label className="block text-sm font-medium text-gray-700">
          次回アクション日時
        </label>
        <Input
          type="datetime-local"
          id="nextActionAt"
          {...register('nextActionAt')}
        />

        <label className="block text-sm font-medium text-gray-700">メモ</label>
        <textarea
          id="notes"
          {...register('notes')}
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
