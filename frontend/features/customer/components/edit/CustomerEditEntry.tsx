'use client';

import { Spinner } from '@/components/ui';
import useCustomerEdit from '@/features/customer/hooks/useCustomerEdit';
import { useUsers } from '@/features/user/hooks/useUsers';
import { useParams } from 'next/navigation';
import CustomerEditForm from './CustomerEditForm';
import CustomerEditLayout from './CustomerEditLayout';

type Params = { id: string };

export default function CustomerEditEntry() {
  const params = useParams<Params>();
  const id = parseInt(params.id, 10);

  const { formData, submit, loading, error, isSubmitting, goToList, goBack } =
    useCustomerEdit(id);

  const { users } = useUsers({ take: 1000 });

  if (loading) return <Spinner mask open />;

  return (
    <CustomerEditLayout>
      <CustomerEditForm
        formData={formData}
        onSubmit={submit}
        isSubmitting={isSubmitting}
        error={error}
        onCancel={goBack}
        users={users}
      />
    </CustomerEditLayout>
  );
}
