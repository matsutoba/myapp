'use client';

import {
  Button,
  Card,
  Container,
  FeatureTitleBar,
  Input,
  Notification,
  Stack,
  useToast,
} from '@/components/ui';
import type { UpdateCustomerRequest } from '@/features/customer/types';
import {
  CustomerForm,
  customerFormSchema,
} from '@/features/customer/validation';
import { actions } from '@/lib/actions';
import getErrorMessage from '@/lib/zod/getErrorMessage';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';

export default function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [customerId, setCustomerId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      name: '',
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

  useEffect(() => {
    params.then((resolved) => {
      const id = parseInt(resolved.id, 10);
      setCustomerId(id);
      loadCustomer(id);
    });
  }, []);

  const loadCustomer = async (id: number) => {
    setLoading(true);
    try {
      const res = await actions.customer.getCustomerById(id);
      if (res.success && res.data) {
        const tagsField = res.data.tags;
        const parsedTags =
          typeof tagsField === 'string'
            ? tagsField
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            : Array.isArray(tagsField)
            ? (tagsField as string[])
            : [];

        reset({
          name: res.data.name || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          address: res.data.address || '',
          company: res.data.company ?? '',
          website: res.data.website ?? '',
          tagsStr: parsedTags.join(', '),
          status: res.data.status ?? '',
          ownerId: res.data.ownerId ?? null,
          lastContactedAt: res.data.lastContactedAt
            ? String(res.data.lastContactedAt)
            : '',
          nextActionAt: res.data.nextActionAt
            ? String(res.data.nextActionAt)
            : '',
          notes: res.data.notes ?? '',
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit: SubmitHandler<CustomerForm> = async (data) => {
    if (!customerId) return;
    setError('');
    const payload: UpdateCustomerRequest = {
      name: data.name,
      contact_name: undefined,
      email: data.email,
      phone: data.phone || '',
      address: data.address || '',
      company: data.company || '',
      website: data.website || '',
      tags: data.tagsStr
        ? data.tagsStr
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      status: data.status || '',
      owner_id: data.ownerId ?? undefined,
      next_action_at: data.nextActionAt ?? undefined,
      notes: data.notes || '',
    } as unknown as UpdateCustomerRequest;

    try {
      const result = await actions.customer.updateCustomer(customerId, payload);
      if (result.success) {
        showToast({
          title: '顧客を更新しました',
          message: '',
          variant: 'success',
          duration: 4000,
        });
        router.push('/customers');
      } else {
        setError('更新に失敗しました');
      }
    } catch (err) {
      setError('予期しないエラーが発生しました');
    }
  };

  if (loading) {
    return (
      <div>
        <FeatureTitleBar title="顧客管理 > 編集" />
        <Container size="sm">
          <Card>
            <p className="text-gray-600">読み込み中...</p>
          </Card>
        </Container>
      </div>
    );
  }

  return (
    <div>
      <FeatureTitleBar title="顧客管理 > 編集" />
      <Container size="sm">
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing="md">
              {error && <Notification variant="error">{error}</Notification>}

              <Input
                type="text"
                id="name"
                label="名前"
                {...register('name')}
                placeholder="顧客名"
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
                type="text"
                id="phone"
                label="電話番号"
                {...register('phone')}
                placeholder="090-0000-0000"
              />

              <Input
                type="text"
                id="address"
                label="住所"
                {...register('address')}
                placeholder="東京都"
              />

              <Input
                type="text"
                id="company"
                label="会社名"
                {...register('company')}
                placeholder="会社名"
              />

              <Input
                type="url"
                id="website"
                label="Website"
                {...register('website')}
                placeholder="https://example.com"
              />

              <Input
                type="text"
                id="tagsStr"
                label="Tags (comma separated)"
                {...register('tagsStr')}
                placeholder="vip,lead"
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

              <Input
                type="number"
                id="ownerId"
                label="担当者ID"
                {...register('ownerId')}
                placeholder="1"
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

              <label className="block text-sm font-medium text-gray-700">
                メモ
              </label>
              <textarea
                {...register('notes')}
                className="block w-full rounded border px-2 py-1"
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
