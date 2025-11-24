import type { Meta, StoryObj } from '@storybook/react';
import { Notification } from './Notification';

const meta: Meta<typeof Notification> = {
  title: 'UI/Notification',
  component: Notification,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Notification>;

export const Info: Story = { args: { variant: 'info', children: '情報メッセージです' } };
export const Success: Story = { args: { variant: 'success', children: '成功しました' } };
export const Warning: Story = { args: { variant: 'warning', children: '注意: 確認してください' } };
export const Error: Story = { args: { variant: 'error', children: 'エラーが発生しました' } };
