import { useToast } from '@/components/ui';
import type { UpdateUserRequest } from '@/features/user/types';
import type { UserEditForm } from '@/features/user/validation';
import { userActions } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type FormData = UserEditForm & { isActive?: boolean | null };

export function useUserEdit(userId: number) {
  const router = useRouter();
  const { showToast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadUser(userId);
    setLoading(false);
  }, [userId]);

  const loadUser = async (id: number) => {
    setLoading(true);
    try {
      const result = await userActions.getUserById(id);
      if (result.success && result.data) {
        setFormData({
          name: result.data.name || '',
          email: result.data.email,
          password: '',
          role: (result.data.role as 'user' | 'admin') ?? 'user',
          isActive: result.data.isActive,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // フォームからバリデート済みの値を受け取り API 呼び出しを行う
  const submit = async (values: FormData) => {
    if (!userId) return;
    setError('');
    setIsSubmitting(true);

    try {
      const updateData: UpdateUserRequest = {
        name: values.name,
        email: values.email,
        role: values.role,
      };

      if (values.password) updateData.password = values.password;
      if (typeof values.isActive !== 'undefined')
        updateData.isActive = values.isActive;

      const result = await userActions.updateUser(userId, updateData);

      if (result.success) {
        showToast({
          title: 'ユーザーを更新しました',
          message: '',
          variant: 'success',
          duration: 4000,
        });
        router.push('/admin/users');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToList = () => router.push('/admin/users');
  const goBack = () => router.back();

  return {
    formData,
    submit,
    loading,
    error,
    isSubmitting,
    goToList,
    goBack,
  } as const;
}
