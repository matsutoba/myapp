import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { Modal } from '../Modal/Modal';

export interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
}

/**
 * 確認ダイアログモーダル
 */
export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title = '確認',
  message,
  confirmText = 'OK',
  cancelText = 'キャンセル',
  variant = 'default',
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="small"
      footer={
        <div className="flex justify-end space-x-2">
          <Button onClick={onClose} variant="secondary">
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            variant={variant === 'danger' ? 'danger' : 'primary'}
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      <div className="flex items-start space-x-3">
        {/* アイコン */}
        {variant === 'danger' && (
          <div className="flex-shrink-0">
            <Icon name="AlertTriangle" className="text-red-600" size={24} />
          </div>
        )}
        {variant === 'default' && (
          <div className="flex-shrink-0">
            <Icon name="Info" className="text-blue-600" size={24} />
          </div>
        )}
        {/* メッセージ */}
        <div className="flex-1">
          <p className="text-gray-700">{message}</p>
        </div>
      </div>
    </Modal>
  );
}
