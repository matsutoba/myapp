'use client';

import { Spinner } from '@/components/ui';
import { actions } from '@/lib/actions';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Params = { id: string };

export default function OrderDetailEntry() {
  const params = useParams<Params>();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const res = await actions.order.getOrderById(id);
      if (res.success && res.data) setOrder(res.data);
      setLoading(false);
    };
    void load();
  }, [id]);

  if (loading) return <Spinner mask open />;

  if (!order) return <div>注文が見つかりません</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">注文 #{order.id}</h2>
      </div>

      <div className="space-y-2">
        <p>
          <strong>顧客 ID:</strong> {order.customerId ?? '-'}
        </p>
        <p>
          <strong>合計:</strong>{' '}
          {order.total != null ? `¥${order.total.toLocaleString()}` : '-'}
        </p>
        <p>
          <strong>ステータス:</strong> {order.status ?? '-'}
        </p>
      </div>
    </div>
  );
}
