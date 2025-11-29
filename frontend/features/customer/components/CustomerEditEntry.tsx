'use client';

import useCustomerEdit from '@/features/customer/hooks/useCustomerEdit';
import { useUsers } from '@/features/user/hooks/useUsers';
import type { User } from '@/features/user/types';
import { useParams } from 'next/navigation';
import CustomerEditForm from './CustomerEditForm';
import CustomerEditLayout from './CustomerEditLayout';
import CustomerErrorView from './CustomerErrorView';
import CustomerLoadingView from './CustomerLoadingView';

type Params = { id: string };

export default function CustomerEditEntry() {
  const params = useParams<Params>();
  const id = parseInt(params.id, 10);

  const {
    formData,
    handleChange,
    handleSubmit,
    loading,
    error,
    isSubmitting,
    goToList,
    goBack,
  } = useCustomerEdit(id);

  const { users } = useUsers({ take: 1000 });

  if (loading) return <CustomerLoadingView />;

  if (error && !formData.email)
    return <CustomerErrorView error={error} onBack={goToList} />;

  return (
    <CustomerEditLayout>
      <CustomerEditForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={error}
        onCancel={goBack}
        users={users as User[]}
      />
    </CustomerEditLayout>
  );
}
