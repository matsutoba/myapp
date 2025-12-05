'use client';

import { useToast } from '@/components/ui';
import { actions } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type FormData = {
  customerId?: string | number;
  amount?: number;
  currency?: string;
  itemsCount?: number;
  orderChannel?: string;
  category?: string;
  status?: string;
};

export function useOrderEdit(orderIdProp: string) {
  const router = useRouter();
  const { showToast } = useToast();

  const [orderId, setOrderId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (orderIdProp) {
      void loadOrder(orderIdProp);
    }
  }, [orderIdProp]);

  const loadOrder = async (id: string) => {
    setLoading(true);
    try {
      const res = await actions.order.getOrderById(id);
      if (res.success && res.data) {
        setOrderId(id);
        setFormData({
          customerId: res.data.customerId ?? '',
          amount: res.data.amount ?? res.data.total ?? 0,
          currency: res.data.currency ?? 'JPY',
          itemsCount: res.data.itemsCount ?? 1,
          orderChannel: res.data.orderChannel ?? 'web',
          category: res.data.category ?? '',
          status: res.data.status ?? 'pending',
        });
      }
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  const submit = async (values: FormData) => {
    if (!orderId) return;
    setError(null);
    setIsSubmitting(true);
    try {
      const payload = {
        amount: typeof values.amount === 'number' ? values.amount : undefined,
        currency: values.currency || undefined,
        itemsCount:
          typeof values.itemsCount === 'number' ? values.itemsCount : undefined,
        orderChannel: values.orderChannel || undefined,
        category: values.category || undefined,
        status: values.status || undefined,
      } as any;

      const result = await actions.order.updateOrder(orderId, payload);
      if (result && result.success) {
        showToast({
          title: '注文を更新しました',
          message: '',
          variant: 'success',
          duration: 4000,
        });
        router.push('/orders');
      } else {
        setError(result?.error?.message || '更新に失敗しました');
      }
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToList = () => router.push('/orders');
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
