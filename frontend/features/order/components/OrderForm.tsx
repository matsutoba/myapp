'use client';

import React, { useState } from 'react';

type Props = {
  initialValues?: any;
  onSubmit: (data: any) => Promise<void> | void;
};

export default function OrderForm({ initialValues = {}, onSubmit }: Props) {
  const [customerId, setCustomerId] = useState(initialValues.customerId || '');
  const [product, setProduct] = useState(initialValues.product || '');
  const [quantity, setQuantity] = useState(initialValues.quantity || 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ customerId, product, quantity });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm font-medium">顧客ID</label>
        <input
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="mt-1 block w-full rounded border px-2 py-1"
          placeholder="顧客ID を入力または選択"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">商品</label>
        <input
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="mt-1 block w-full rounded border px-2 py-1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">数量</label>
        <input
          type="number"
          value={quantity}
          min={1}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="mt-1 block w-32 rounded border px-2 py-1"
        />
      </div>

      <div className="flex gap-2">
        <button
          className="rounded bg-blue-600 text-white px-3 py-1"
          type="submit"
        >
          保存
        </button>
      </div>
    </form>
  );
}
