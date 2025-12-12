'use client';

import { Modal } from '@/components/ui';
import type { ApiErrorDetail } from '@/lib/api/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export interface ErrorModalProps {
  open: boolean;
  onClose: () => void;
  error?: ApiErrorDetail;
  title?: string;
  isSessionInvalid?: boolean;
}

export function ErrorModal({
  open,
  onClose,
  error,
  title = 'エラー',
  isSessionInvalid = false,
}: ErrorModalProps) {
  const router = useRouter();
  const errorMessage = error?.message || '予期しないエラーが発生しました。';

  // モーダルがクローズされたら、セッション無効の場合はログイン画面へ遷移
  useEffect(() => {
    if (!open && isSessionInvalid) {
      router.replace('/login');
    }
  }, [open, isSessionInvalid, router]);

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={title}
      size="medium"
      overlay={true}
      overlayOpacity={0.5}
      footer={
        <button
          onClick={handleClose}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          閉じる
        </button>
      }
    >
      <div className="text-gray-700">
        <p>{errorMessage}</p>
        {error?.code && (
          <p className="mt-2 text-sm text-gray-500">
            エラーコード: {error.code}
          </p>
        )}
      </div>
    </Modal>
  );
}
