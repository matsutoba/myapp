import { Button, Notification, Stack } from '@/components/ui';
import CustomerEditLayout from './CustomerEditLayout';

type Props = {
  error?: string;
  onBack: () => void;
};

export default function CustomerErrorView({ error, onBack }: Props) {
  return (
    <CustomerEditLayout>
      <Stack spacing="md">
        {error && <Notification variant="error">{error}</Notification>}
        <Button onClick={onBack} variant="secondary">
          一覧に戻る
        </Button>
      </Stack>
    </CustomerEditLayout>
  );
}
