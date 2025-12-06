import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../Button/Button';
import { ErrorModal } from './ErrorModal';

const meta: Meta<typeof ErrorModal> = {
  title: 'UI/ErrorModal',
  component: ErrorModal,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ErrorModal>;

export const WithApiError: Story = {
  render: () => {
    function Example() {
      const [open, setOpen] = useState(false);
      const error = { code: 4001, message: 'API キーが無効です' } as const;

      return (
        <div>
          <Button onClick={() => setOpen(true)}>エラーモーダルを開く</Button>
          <ErrorModal
            open={open}
            onClose={() => setOpen(false)}
            error={error}
          />
        </div>
      );
    }

    return <Example />;
  },
};
