'use client';

import { useToast } from '@/components/ui';
import { actions } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type FormData = {
  customerId?: string;
  product?: string;
  quantity?: number;
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
          product: '',
          quantity: 1,
        });
        // If backend returns product/quantity, map here
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
        // map form fields to update payload; backend accepts amount/currency/itemsCount/etc.
        // For now, map quantity -> itemsCount as example
        itemsCount: values.quantity,
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
