'use client';

import {
  Badge,
  Button,
  Card,
  ConfirmModal,
  Container,
  FeatureTitleBar,
  Spinner,
  useToast,
} from '@/components/ui';
import type { BadgeVariant } from '@/components/ui/Badge/Badge';
import Table, { Tbody, Td, Th, Tr } from '@/components/ui/Table/Table';
import type { Order } from '@/features/order/actions/getOrders';
import { actions } from '@/lib/actions';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type Params = { id: string };

function formatAmount(
  amount: number | string | null | undefined,
  currency?: string,
) {
  if (amount == null) return '-';
  const num = typeof amount === 'number' ? amount : Number(amount);
  if (Number.isNaN(num)) return String(amount);
  const cur = currency ?? 'JPY';
  if (cur === 'JPY') return `¥${num.toLocaleString()}`;
  return `${num.toLocaleString()} ${cur}`;
}

export default function OrderDetailEntry() {
  const params = useParams<Params>();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

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
    <div>
      <FeatureTitleBar title={`注文管理 > 詳細: 注文 #${order.id}`} />
      <Container size="sm">
        <Card className="max-w-lg p-md">
          <Table>
            <Tbody>
              <Tr>
                <Th>注文番号</Th>
                <Td>{order.id ?? '-'}</Td>
              </Tr>

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
                <Td>
                  {order.status
                    ? (() => {
                        const s = String(order.status).toLowerCase();
                        const map: Record<string, BadgeVariant> = {
                          pending: 'warning',
                          processing: 'primary',
                          completed: 'success',
                          refunded: 'danger',
                          cancelled: 'danger',
                        };
                        const variant = map[s] ?? 'default';
                        return <Badge variant={variant}>{order.status}</Badge>;
                      })()
                    : '-'}
                </Td>
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
        <div className="flex gap-2 mt-4">
          <Button onClick={() => router.push(`/orders/${order.id}/edit`)}>
            編集
          </Button>

          <Button
            variant="danger"
            onClick={() => setShowConfirmModal(true)}
            disabled={isDeleting}
          >
            {isDeleting ? '削除中...' : '削除'}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => router.push('/orders')}
            disabled={isDeleting}
          >
            キャンセル
          </Button>
        </div>
      </Container>
      <ConfirmModal
        open={showConfirmModal}
        title="削除確認"
        message="この注文を本当に削除しますか？"
        confirmText="削除"
        cancelText="キャンセル"
        variant="danger"
        onClose={() => setShowConfirmModal(false)}
        onConfirm={async () => {
          if (!order?.id) return;
          setIsDeleting(true);
          try {
            const res = await actions.order.deleteOrder(Number(order.id));
            if (res && res.success) {
              showToast({
                title: '削除しました',
                message: '注文を削除しました',
                variant: 'success',
                duration: 4000,
              });
              router.push('/orders');
            } else {
              showToast({
                title: '削除に失敗しました',
                message: res?.error?.message || '',
                variant: 'error',
                duration: 6000,
              });
            }
          } finally {
            setIsDeleting(false);
            setShowConfirmModal(false);
          }
        }}
      />
    </div>
  );
}
