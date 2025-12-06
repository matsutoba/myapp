import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../Button/Button';
import { SuccessModal } from './SuccessModal';

const meta: Meta<typeof SuccessModal> = {
  title: 'UI/SuccessModal',
  component: SuccessModal,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SuccessModal>;

export const Default: Story = {
  render: () => {
    function Example() {
      const [open, setOpen] = useState(false);
      return (
        <div>
          <Button onClick={() => setOpen(true)}>成功モーダルを開く</Button>
          <SuccessModal
            open={open}
            onClose={() => setOpen(false)}
            message="操作が成功しました"
          />
        </div>
      );
    }

    return <Example />;
  },
};
