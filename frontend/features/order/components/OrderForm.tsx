'use client';

import { Button, TextField } from '@/components/ui';
import React, { useState } from 'react';

type Props = {
  initialValues?: any;
  onSubmit: (data: any) => Promise<void> | void;
  onCancel: () => void;
};

export default function OrderForm({
  initialValues = {},
  onSubmit,
  onCancel,
}: Props) {
  const [customerId, setCustomerId] = useState<string>(
    initialValues.customerId || '',
  );
  const [product, setProduct] = useState<string>(initialValues.product || '');
  const [quantity, setQuantity] = useState<number>(initialValues.quantity || 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ customerId, product, quantity });
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
        label="商品"
        value={product}
        onChange={(e) => setProduct(e.target.value)}
      />

      <TextField
        label="数量"
        type="number"
        value={String(quantity)}
        min={1}
        onChange={(e) => setQuantity(Number(e.target.value))}
        className="w-32"
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
