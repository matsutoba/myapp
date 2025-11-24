import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Button } from '../Button/Button';
import { ToastProvider, useToast } from './ToastContext';

const Demo: React.FC = () => {
  const { showToast } = useToast();

  return (
    <div className="p-4">
      <Button
        onClick={() =>
          showToast({
            title: '保存しました',
            message: 'データが正常に保存されました。',
            variant: 'success',
            duration: 4000,
          })
        }
      >
        Show Success Toast
      </Button>
      <div className="mt-2">
        <Button
          onClick={() =>
            showToast({
              title: 'エラー',
              message: '保存に失敗しました',
              variant: 'error',
              duration: 6000,
            })
          }
        >
          Show Error Toast
        </Button>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: 'UI/Toast',
  component: Demo,
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Demo>;

export const Playground: Story = {};
