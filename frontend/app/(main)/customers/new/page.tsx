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
import type { CreateCustomerRequest } from '@/features/customer/types';
import { actions } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewCustomerPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateCustomerRequest>({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: null,
    website: null,
    tags: [],
    status: null,
    ownerId: null,
    lastContactedAt: null,
    nextActionAt: null,
    notes: null,
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value } = target;
    if (name === 'tags') {
      const arr = value
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      setFormData({ ...formData, tags: arr });
      return;
    }
    if (name === 'ownerId') {
      setFormData({ ...formData, ownerId: value ? parseInt(value, 10) : null });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const result = await actions.customer.createCustomer(formData);
      if (result.success) {
        showToast({
          title: '顧客を作成しました',
          message: '',
          variant: 'success',
          duration: 4000,
        });
        router.push('/customers');
      } else {
        setError('作成に失敗しました');
      }
    } catch (err) {
      setError('予期しないエラーが発生しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <FeatureTitleBar title="顧客管理 > 新規作成" />
      <Container size="sm">
        <Card>
          <form onSubmit={handleSubmit}>
            <Stack spacing="md">
              {error && <Notification variant="error">{error}</Notification>}

              <Input
                type="text"
                id="name"
                name="name"
                label="名前"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="顧客名"
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
                type="text"
                id="phone"
                name="phone"
                label="電話番号"
                value={formData.phone}
                onChange={handleChange}
                placeholder="090-0000-0000"
              />

              <Input
                type="text"
                id="address"
                name="address"
                label="住所"
                value={formData.address}
                onChange={handleChange}
                placeholder="東京都"
              />

              <Input
                type="text"
                id="company"
                name="company"
                label="会社名"
                value={formData.company ?? ''}
                onChange={handleChange}
                placeholder="会社名"
              />

              <Input
                type="url"
                id="website"
                name="website"
                label="Website"
                value={formData.website ?? ''}
                onChange={handleChange}
                placeholder="https://example.com"
              />

              <Input
                type="text"
                id="tags"
                name="tags"
                label="Tags (comma separated)"
                value={(formData.tags || []).join(', ')}
                onChange={handleChange}
                placeholder="vip,lead"
              />

              <label className="block text-sm font-medium text-gray-700">
                ステータス
              </label>
              <select
                name="status"
                value={formData.status ?? ''}
                onChange={handleChange}
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
                name="ownerId"
                label="担当者ID"
                value={formData.ownerId ?? ''}
                onChange={handleChange}
                placeholder="1"
              />

              <label className="block text-sm font-medium text-gray-700">
                最終コンタクト日時
              </label>
              <Input
                type="datetime-local"
                id="lastContactedAt"
                name="lastContactedAt"
                value={formData.lastContactedAt ?? ''}
                onChange={handleChange}
              />

              <label className="block text-sm font-medium text-gray-700">
                次回アクション日時
              </label>
              <Input
                type="datetime-local"
                id="nextActionAt"
                name="nextActionAt"
                value={formData.nextActionAt ?? ''}
                onChange={handleChange}
              />

              <label className="block text-sm font-medium text-gray-700">
                メモ
              </label>
              <textarea
                name="notes"
                value={formData.notes ?? ''}
                onChange={handleChange}
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
