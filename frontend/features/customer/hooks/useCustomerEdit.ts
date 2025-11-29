'use client';

import { useToast } from '@/components/ui';
import type { UpdateCustomerRequest } from '@/features/customer/types';
import type { CustomerForm } from '@/features/customer/validation';
import { actions } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type FormData = Partial<CustomerForm> & { ownerId?: number | null };

export default function useCustomerEdit(customerIdProp: number) {
  const router = useRouter();
  const { showToast } = useToast();

  const [customerId, setCustomerId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadCustomer(customerIdProp);
  }, [customerIdProp]);

  const loadCustomer = async (id: number) => {
    setLoading(true);
    try {
      const res = await actions.customer.getCustomerById(id);
      if (res.success && res.data) {
        setCustomerId(id);
        setFormData({
          contactName: res.data.contactName || '',
          email: res.data.email || '',
          phone: res.data.phone || '',
          address: res.data.address || '',
          company: res.data.company ?? '',
          website: res.data.website ?? '',
          tagsStr: Array.isArray(res.data.tags) ? res.data.tags.join(', ') : '',
          status: res.data.status ?? '',
          ownerId: res.data.ownerId ?? null,
          lastContactedAt: res.data.lastContactedAt ?? '',
          nextActionAt: res.data.nextActionAt ?? '',
          notes: res.data.notes ?? '',
        });
      }
    } catch (err) {
      console.error(err);
      setError(String(err ?? 'エラーが発生しました'));
    } finally {
      setLoading(false);
    }
  };

  // フォームからバリデート済みの値を受け取り API 呼び出しを行う
  const submit = async (values: CustomerForm & { ownerId?: string | null }) => {
    if (!customerId) return;
    setError('');
    setIsSubmitting(true);

    try {
      const updateData: UpdateCustomerRequest = {
        contactName: values.contactName,
        email: values.email,
        phone: values.phone,
        address: values.address,
        company: values.company,
        website: values.website,
        tags:
          typeof values.tagsStr === 'string'
            ? values.tagsStr
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean)
            : undefined,
        status: values.status,
        ownerId:
          typeof values.ownerId === 'string'
            ? values.ownerId
              ? Number(values.ownerId)
              : undefined
            : (values.ownerId as any),
        lastContactedAt:
          values.lastContactedAt && values.lastContactedAt !== ''
            ? new Date(values.lastContactedAt).toISOString()
            : undefined,
        nextActionAt:
          values.nextActionAt && values.nextActionAt !== ''
            ? new Date(values.nextActionAt).toISOString()
            : undefined,
        notes: values.notes,
      };

      const result = await actions.customer.updateCustomer(
        customerId,
        updateData,
      );
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
      console.error(err);
      setError(String(err ?? '予期しないエラーが発生しました'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToList = () => router.push('/customers');
  const goBack = () => router.back();

  return {
    formData,
    submit,
    loading,
    error,
    isSubmitting,
    goToList,
    goBack,
  } as const;
}
