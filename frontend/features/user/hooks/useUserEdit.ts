import { useToast } from '@/components/ui';
import type { UpdateUserRequest } from '@/features/user/types';
import { userActions } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type FormData = UpdateUserRequest & { isActive?: boolean | null };

export default function useUserEdit(userId: number) {
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
          role: result.data.role || 'user',
          isActive: result.data.isActive,
        });
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError(String(err ?? 'エラーが発生しました'));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const name = e.target.name;
    let value: any = e.target.value;
    if (name === 'isActive') {
      value = value === 'true';
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    setError('');
    setIsSubmitting(true);

    try {
      const updateData: UpdateUserRequest = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
      };

      if (formData.password) updateData.password = formData.password;
      if (typeof formData.isActive !== 'undefined')
        updateData.isActive = formData.isActive;

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
    } catch (err) {
      console.error('Unexpected error:', err);
      setError(String(err ?? 'エラーが発生しました'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const goToList = () => router.push('/admin/users');
  const goBack = () => router.back();

  return {
    formData,
    handleChange,
    handleSubmit,
    loading,
    error,
    isSubmitting,
    goToList,
    goBack,
  } as const;
}
