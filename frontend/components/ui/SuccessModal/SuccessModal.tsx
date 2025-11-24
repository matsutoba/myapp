import { Button } from '../Button/Button';
import { Icon } from '../Icon/Icon';
import { Modal } from '../Modal/Modal';

export interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
  message: string;
  title?: string;
}

/**
 * 成功メッセージを表示するモーダル
 */
export function SuccessModal({
  open,
  onClose,
  message,
  title = '成功',
}: SuccessModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="small"
      footer={
        <div className="flex justify-end">
          <Button onClick={onClose} variant="primary">
            OK
          </Button>
        </div>
      }
    >
      <div className="flex items-start space-x-3">
        {/* 成功アイコン */}
        <div className="flex-shrink-0">
          <Icon name="CheckCircle" size={24} className="text-green-600" />
        </div>
        {/* メッセージ */}
        <div className="flex-1">
          <p className="text-gray-700">{message}</p>
        </div>
      </div>
    </Modal>
  );
}
