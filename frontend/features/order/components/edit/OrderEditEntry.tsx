'use client';

import { Card, Container, FeatureTitleBar, Spinner } from '@/components/ui';
import OrderForm from '@/features/order/components/OrderForm';
import { useOrderEdit } from '@/features/order/hooks/useOrderEdit';
import { useParams } from 'next/navigation';

type Params = { id: string };

export default function OrderEditEntry() {
  const params = useParams<Params>();
  const id = params.id;

  const { formData, submit, loading, error, isSubmitting, goBack } =
    useOrderEdit(id);

  if (loading) return <Spinner mask open />;

  return (
    <div>
      <FeatureTitleBar title="注文管理 > 編集" />
      <Container size="sm">
        <Card>
          <OrderForm
            initialValues={formData}
            onSubmit={async (data) => await submit(data)}
            onCancel={goBack}
          />
        </Card>
      </Container>
    </div>
  );
}
