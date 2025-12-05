'use client';

import { Card, FeatureTitleBar, Spinner } from '@/components/ui';
import Table, { Tbody, Td, Th, Tr } from '@/components/ui/Table/Table';
import { actions } from '@/lib/actions';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Params = { id: string };

function formatAmount(amount: unknown, currency?: string) {
  if (amount == null) return '-';
  const num = Number(amount);
  if (Number.isNaN(num)) return String(amount);
  const cur = currency ?? 'JPY';
  if (cur === 'JPY') return `¥${num.toLocaleString()}`;
  return `${num.toLocaleString()} ${cur}`;
}

export default function OrderDetailEntry() {
  const params = useParams<Params>();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await actions.order.getOrderById(id);
        if (!mounted) return;
        if (res.success && res.data) setOrder(res.data);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    void load();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) return <Spinner mask open />;

  if (!order) return <div>注文が見つかりません</div>;

  return (
    <div className="space-y-4">
      <FeatureTitleBar title={`注文管理 > 詳細: 注文 #${order.id}`} />

      <Card className="max-w-lg p-md">
        <Table>
          <Tbody>
            <Tr>
              <Th>顧客</Th>
              <Td>{order.companyName ?? order.customerId ?? '-'}</Td>
            </Tr>

            <Tr>
              <Th>合計</Th>
              <Td>
                {formatAmount(order.amount ?? order.total, order.currency)}
              </Td>
            </Tr>

            <Tr>
              <Th>通貨</Th>
              <Td>{order.currency ?? '-'}</Td>
            </Tr>

            <Tr>
              <Th>アイテム数</Th>
              <Td>{order.itemsCount ?? '-'}</Td>
            </Tr>

            <Tr>
              <Th>注文チャネル</Th>
              <Td>{order.orderChannel ?? '-'}</Td>
            </Tr>

            <Tr>
              <Th>カテゴリ</Th>
              <Td>{order.category ?? '-'}</Td>
            </Tr>

            <Tr>
              <Th>ステータス</Th>
              <Td>{order.status ?? '-'}</Td>
            </Tr>

            <Tr>
              <Th>作成日時</Th>
              <Td>
                {order.createdAt
                  ? new Date(order.createdAt).toLocaleString()
                  : '-'}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Card>
    </div>
  );
}
