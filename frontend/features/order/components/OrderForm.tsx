'use client';

import { Button, Select, TextField } from '@/components/ui';
import { actions } from '@/lib/actions';
import React, { useEffect, useState } from 'react';

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
  const [customerId, setCustomerId] = useState<string>(
    initialValues.customerId ? String(initialValues.customerId) : '',
  );
  const [customerOptions, setCustomerOptions] = useState<
    {
      value: string;
      label: string;
    }[]
  >([]);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [amount, setAmount] = useState<number>(initialValues.amount || 0);
  const [currency, setCurrency] = useState<string>(
    initialValues.currency || 'JPY',
  );
  const [itemsCount, setItemsCount] = useState<number>(
    initialValues.itemsCount || 1,
  );
  const [orderChannel, setOrderChannel] = useState<string>(
    initialValues.orderChannel || 'web',
  );
  const [category, setCategory] = useState<string>(
    initialValues.category || '',
  );
  const [status, setStatus] = useState<string>(
    initialValues.status || 'pending',
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      customerId: customerId || undefined,
      amount: Number(amount) || 0,
      currency: currency || undefined,
      itemsCount: Number(itemsCount) || undefined,
      orderChannel: orderChannel || undefined,
      category: category || undefined,
      status: status || undefined,
    });
  };

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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <Select
        label="顧客"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        options={[{ value: '', label: '選択してください' }, ...customerOptions]}
        helperText={customersLoading ? '読み込み中...' : undefined}
        readOnly={disableCustomerSelect}
      />

      <TextField
        label="合計金額"
        type="number"
        placeholder="例: 1200"
        value={String(amount)}
        onChange={(e) => setAmount(Number(e.target.value))}
      />

      <TextField
        label="通貨"
        placeholder="JPY"
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
      />

      <TextField
        label="アイテム数"
        type="number"
        value={String(itemsCount)}
        min={1}
        onChange={(e) => setItemsCount(Number(e.target.value))}
        className="w-32"
      />

      <Select
        label="注文チャネル"
        value={orderChannel}
        onChange={(e) => setOrderChannel(e.target.value)}
        options={[
          { value: 'web', label: 'Web' },
          { value: 'app', label: 'App' },
          { value: 'store', label: 'Store' },
          { value: 'phone', label: 'Phone' },
        ]}
      />

      <TextField
        label="カテゴリ"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <Select
        label="ステータス"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        options={[
          { value: 'pending', label: 'Pending' },
          { value: 'refunded', label: 'Refunded' },
        ]}
      />

      <div className="flex gap-2">
        <Button type="submit">保存</Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          キャンセル
        </Button>
      </div>
    </form>
  );
}
