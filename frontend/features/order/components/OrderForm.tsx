'use client';

import { Button, Select, TextField } from '@/components/ui';
import React, { useState } from 'react';

type Props = {
  initialValues?: any;
  onSubmit: (data: any) => Promise<void> | void;
  onCancel?: () => void;
};

export default function OrderForm({
  initialValues = {},
  onSubmit,
  onCancel,
}: Props) {
  const [customerId, setCustomerId] = useState<string>(
    initialValues.customerId ? String(initialValues.customerId) : '',
  );
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <TextField
        label="顧客ID"
        placeholder="顧客ID を入力または選択"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
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
          { value: 'completed', label: 'Completed' },
          { value: 'refunded', label: 'Refunded' },
        ]}
      />

      <div className="flex gap-2">
        <Button type="submit">保存</Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            キャンセル
          </Button>
        )}
      </div>
    </form>
  );
}
