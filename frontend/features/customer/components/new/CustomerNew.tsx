'use client';

import {
  Button,
  Card,
  Container,
  FeatureTitleBar,
  Input,
  Notification,
  Stack,
  TextField,
  useToast,
} from '@/components/ui';
import type { CreateCustomerRequest } from '@/features/customer/types';
import { customerFormSchema } from '@/features/customer/validation';
import { useUsers } from '@/features/user/hooks/useUsers';
import type { User } from '@/features/user/types';
import { actions } from '@/lib/actions';
import getErrorMessage from '@/lib/zod/getErrorMessage';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

export default function CustomerNew() {
  const router = useRouter();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      contactName: '',
      email: '',
      phone: '',
      address: '',
      company: '',
      website: '',
      tagsStr: '',
      status: '',
      ownerId: null,
      lastContactedAt: '',
      nextActionAt: '',
      notes: '',
    },
  });

  const { users } = useUsers({ take: 1000 });

  const onSubmit = async (data: any) => {
    const payload: CreateCustomerRequest = {
      contactName: data.contactName,
      email: data.email,
      phone: data.phone || '',
      address: data.address || '',
      company: data.company || '',
      website: data.website || '',
      tags: data.tagsStr
        ? data.tagsStr
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean)
        : [],
      status: data.status || undefined,
      ownerId: data.ownerId == null ? undefined : data.ownerId,
      lastContactedAt:
        data.lastContactedAt && data.lastContactedAt !== ''
          ? new Date(data.lastContactedAt).toISOString()
          : undefined,
      nextActionAt:
        data.nextActionAt && data.nextActionAt !== ''
          ? new Date(data.nextActionAt).toISOString()
          : undefined,
      notes: data.notes || '',
    };

    const result = await actions.customer.createCustomer(payload);
    if (result.success) {
      showToast({
        title: '顧客を作成しました',
        message: '',
        variant: 'success',
        duration: 4000,
      });
      router.push('/customers');
    } else {
      alert(result.error?.message || '作成に失敗しました');
    }
  };

  return (
    <div>
      <FeatureTitleBar title="顧客管理 > 新規作成" />
      <Container size="sm">
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing="md">
              {errors && Object.keys(errors).length > 0 && (
                <Notification variant="error">
                  入力に誤りがあります
                </Notification>
              )}

              <TextField
                id="company"
                label="会社名"
                placeholder="会社名"
                {...register('company')}
              />

              <TextField
                id="contactName"
                label="担当者名"
                placeholder="担当者名"
                {...register('contactName')}
                error={getErrorMessage(errors.contactName)}
              />

              <TextField
                type="email"
                id="email"
                label="メールアドレス"
                {...register('email')}
                placeholder="user@example.com"
                error={getErrorMessage(errors.email)}
              />

              <TextField
                id="phone"
                label="電話番号"
                placeholder="090-0000-0000"
                {...register('phone')}
              />

              <TextField
                type="url"
                id="website"
                label="Website"
                {...register('website')}
                placeholder="https://example.com"
              />

              <TextField
                id="tagsStr"
                label="Tags (comma separated)"
                placeholder="vip,lead"
                {...register('tagsStr')}
              />

              <label className="block text-sm font-medium text-gray-700">
                ステータス
              </label>
              <select
                {...register('status')}
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
                {...register('ownerId')}
                className="mt-1 block w-full border rounded-md px-2 py-1"
              >
                <option value="">-- 未選択 --</option>
                {users.map((u: User) => (
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

              <label className="block text-sm font-medium text-gray-700">
                メモ
              </label>
              <textarea
                {...register('notes')}
                className="block w-full rounded border px-2 py-1"
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
