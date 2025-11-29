'use client';

import { useToast } from '@/components/ui';
import type { UpdateCustomerRequest } from '@/features/customer/types';
import { actions } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type FormData = UpdateCustomerRequest & {
  contactName?: string;
  email?: string;
};

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
          tags: res.data.tags ?? [],
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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const name = e.target.name || e.target.id;
    let value: any = e.target.value;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerId) return;
    setError('');
    setIsSubmitting(true);
    try {
      const updateData: UpdateCustomerRequest = {
        contactName: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        company: formData.company,
        website: formData.website,
        // Prefer tagsStr (editable text field) when present, otherwise use tags
        tags:
          typeof (formData as any).tagsStr === 'string'
            ? (formData as any).tagsStr
                .split(',')
                .map((s: string) => s.trim())
                .filter(Boolean)
            : formData.tags,
        status: formData.status,
        ownerId:
          typeof formData.ownerId === 'string'
            ? formData.ownerId
              ? Number(formData.ownerId)
              : undefined
            : formData.ownerId,
        lastContactedAt:
          formData.lastContactedAt && formData.lastContactedAt !== ''
            ? new Date(formData.lastContactedAt).toISOString()
            : undefined,
        nextActionAt:
          formData.nextActionAt && formData.nextActionAt !== ''
            ? new Date(formData.nextActionAt).toISOString()
            : undefined,
        notes: formData.notes,
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
    handleChange,
    handleSubmit,
    loading,
    error,
    isSubmitting,
    goToList,
    goBack,
  } as const;
}
