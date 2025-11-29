'use client';

import useUserEdit from '@/features/user/hooks/useUserEdit';
import { useParams } from 'next/navigation';
import ErrorView from './ErrorView';
import LoadingView from './LoadingView';
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
    goToList,
    goBack,
  } = useUserEdit(userId);

  if (loading) return <LoadingView />;

  if (error && !formData.email)
    return <ErrorView error={error} onBack={goToList} />;

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
