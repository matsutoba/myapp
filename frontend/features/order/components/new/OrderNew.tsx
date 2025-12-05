'use client';

import {
  Button,
  Card,
  Container,
  FeatureTitleBar,
  Stack,
  useToast,
} from '@/components/ui';
import { actions } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import OrderForm from '../OrderForm';

export default function OrderNew() {
  const router = useRouter();
  const { showToast } = useToast();

  const handleCreate = async (data: any) => {
    // data: { customerId, product, quantity }
    const payload = {
      customerId: data.customerId || undefined,
      product: data.product,
      quantity: Number(data.quantity) || 1,
    };

    const res = await actions.order.createOrder(payload as any);
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
          <form>
            <Stack spacing="md">
              <OrderForm initialValues={{}} onSubmit={handleCreate} />

              <Stack direction="horizontal" spacing="sm">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.back()}
                >
                  キャンセル
                </Button>
              </Stack>
            </Stack>
          </form>
        </Card>
      </Container>
    </div>
  );
}
