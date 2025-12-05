'use client';

import { Button, Notification, Select, TextField } from '@/components/ui';
import { orderFormSchema } from '@/features/order/validation';
import { actions } from '@/lib/actions';
import getErrorMessage from '@/lib/zod/getErrorMessage';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

type Props = {
  initialValues?: any;
  onSubmit: (data: any) => Promise<void> | void;
  onCancel?: () => void;
  /** 編集時などに顧客選択を無効化する */
  disableCustomerSelect?: boolean;
};

export default function OrderForm({
  initialValues = {},
  onSubmit,
  onCancel,
  disableCustomerSelect = false,
}: Props) {
  const [customerOptions, setCustomerOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [customersLoading, setCustomersLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    control,
  } = useForm<any>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customerId: initialValues.customerId
        ? String(initialValues.customerId)
        : '',
      amount: initialValues.amount ?? 0,
      currency: initialValues.currency ?? 'JPY',
      itemsCount: initialValues.itemsCount ?? 1,
      orderChannel: initialValues.orderChannel ?? 'web',
      category: initialValues.category ?? '',
      status: initialValues.status ?? 'pending',
    },
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setCustomersLoading(true);
      try {
        const res = await actions.customer.getCustomers({ take: 200 });
        if (!mounted) return;
        if (res && res.success && res.data) {
          const items = Array.isArray(res.data)
            ? res.data
            : (res.data as any).items || [];
          const opts = items.map((c: any) => ({
            value: String(c.id),
            label: c.company || c.contactName || c.email || String(c.id),
          }));
          setCustomerOptions(opts);
        }
      } catch (e) {
        console.error('load customers failed', e);
      } finally {
        if (mounted) setCustomersLoading(false);
      }
    };

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  const submitForm = handleSubmit(async (data) => {
    // double-check validation (some custom components might bypass expected events)
    const ok = await trigger();
    if (!ok) return;

    const payload = {
      customerId: data.customerId || undefined,
      amount: Number(data.amount) || 0,
      currency: data.currency || undefined,
      itemsCount: Number(data.itemsCount) || undefined,
      orderChannel: data.orderChannel || undefined,
      category: data.category || undefined,
      status: data.status || undefined,
    };

    await onSubmit(payload);
  });

  return (
    <form onSubmit={submitForm} className="space-y-4 max-w-lg">
      {errors && Object.keys(errors).length > 0 && (
        <Notification variant="error">入力に誤りがあります</Notification>
      )}

      <Controller
        name="customerId"
        control={control}
        render={({ field }) => (
          <Select
            label="顧客"
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            options={[
              { value: '', label: '選択してください' },
              ...customerOptions,
            ]}
            helperText={customersLoading ? '読み込み中...' : undefined}
            readOnly={disableCustomerSelect}
            error={getErrorMessage(errors.customerId)}
          />
        )}
      />

      <TextField
        label="合計金額"
        type="number"
        placeholder="例: 1200"
        {...register('amount')}
        error={getErrorMessage(errors.amount)}
      />

      <TextField
        label="通貨"
        placeholder="JPY"
        {...register('currency')}
        error={getErrorMessage(errors.currency)}
      />

      <TextField
        label="アイテム数"
        type="number"
        {...register('itemsCount')}
        min={1}
        error={getErrorMessage(errors.itemsCount)}
      />

      <Controller
        name="orderChannel"
        control={control}
        render={({ field }) => (
          <Select
            label="注文チャネル"
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            options={[
              { value: 'web', label: 'Web' },
              { value: 'app', label: 'App' },
              { value: 'store', label: 'Store' },
              { value: 'phone', label: 'Phone' },
            ]}
          />
        )}
      />

      <TextField
        label="カテゴリ"
        {...register('category')}
        error={getErrorMessage(errors.category)}
      />

      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <Select
            label="ステータス"
            value={field.value}
            onChange={(e) => field.onChange(e.target.value)}
            options={[
              { value: 'pending', label: 'Pending' },
              { value: 'refunded', label: 'Refunded' },
            ]}
          />
        )}
      />

      <div className="flex gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? '保存中...' : '保存'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          キャンセル
        </Button>
      </div>
    </form>
  );
}
