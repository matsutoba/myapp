'use client';

import { Spinner } from '@/components/ui';
import useUserEdit from '@/features/user/hooks/useUserEdit';
import { useParams } from 'next/navigation';
import UserEditForm from './UserEditForm';
import UserEditLayout from './UserEditLayout';

type Props = {
  id: string;
};

export default function UserEditEntry() {
  const params = useParams<Props>();
  const userId = parseInt(params.id, 10);

  const {
    formData,
    handleChange,
    handleSubmit,
    loading,
    error,
    isSubmitting,
    goBack,
  } = useUserEdit(userId);

  if (loading) return <Spinner mask open />;

  return (
    <UserEditLayout>
      <UserEditForm
        formData={formData}
        onChange={handleChange}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={error}
        onCancel={goBack}
      />
    </UserEditLayout>
  );
}
