import { Modal } from '@/components/ui';
import type { ApiErrorDetail } from '@/lib/api/client';

export interface ErrorModalProps {
  open: boolean;
  onClose: () => void;
  error?: ApiErrorDetail;
  title?: string;
}

export function ErrorModal({
  open,
  onClose,
  error,
  title = 'エラー',
}: ErrorModalProps) {
  const errorMessage = error?.message || '予期しないエラーが発生しました。';

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="medium"
      overlay={true}
      overlayOpacity={0.5}
      footer={
        <button
          onClick={onClose}
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
