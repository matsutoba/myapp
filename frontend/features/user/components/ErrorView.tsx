import { Button, Notification, Stack } from '@/components/ui';
import UserEditLayout from './UserEditLayout';

type Props = {
  error?: string;
  onBack: () => void;
};

export default function ErrorView({ error, onBack }: Props) {
  return (
    <UserEditLayout>
      <Stack spacing="md">
        {error && <Notification variant="error">{error}</Notification>}
        <Button onClick={onBack} variant="secondary">
          一覧に戻る
        </Button>
      </Stack>
    </UserEditLayout>
  );
}
