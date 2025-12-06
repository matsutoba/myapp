'use client';

import { Card, Container, FeatureTitleBar, useToast } from '@/components/ui';
import { actions } from '@/lib/actions';
import { useRouter, useSearchParams } from 'next/navigation';
import OrderForm from '../OrderForm';

export default function OrderNew() {
  const router = useRouter();
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const customerIdFromQuery = searchParams.get('customerId') ?? undefined;

  const handleCreate = async (data: any) => {
    // data should follow CreateOrderInput shape: { customerId, amount, currency, itemsCount, orderChannel, category, status }
    const res = await actions.order.createOrder(data as any);
    if (res.success && res.data && res.data.id) {
      showToast({
        title: '注文を作成しました',
        message: '',
        variant: 'success',
        duration: 4000,
      });
      router.push(`/orders`);
    } else {
      showToast({
        title: '作成に失敗しました',
        message: res.error?.message || '注文の作成に失敗しました',
        variant: 'error',
        duration: 6000,
      });
    }
  };

  return (
    <div>
      <FeatureTitleBar title="注文管理 > 新規作成" />
      <Container size="sm">
        <Card>
          <OrderForm
            initialValues={{ customerId: customerIdFromQuery }}
            onSubmit={handleCreate}
            onCancel={() => {
              router.back();
            }}
          />
        </Card>
      </Container>
    </div>
  );
}
