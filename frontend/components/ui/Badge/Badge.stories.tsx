import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    variant: 'default',
    children: 'Badge',
  },
};

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Danger',
  },
};

export const Admin: Story = {
  args: {
    variant: 'admin',
    children: '管理者',
  },
};

export const User: Story = {
  args: {
    variant: 'user',
    children: '一般ユーザー',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="admin">管理者</Badge>
      <Badge variant="user">一般ユーザー</Badge>
    </div>
  ),
};

export const InTable: Story = {
  render: () => (
    <table className="min-w-full border">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-2 text-left">ユーザー</th>
          <th className="px-4 py-2 text-left">ロール</th>
          <th className="px-4 py-2 text-left">ステータス</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-t">
          <td className="px-4 py-2">山田太郎</td>
          <td className="px-4 py-2">
            <Badge variant="admin">管理者</Badge>
          </td>
          <td className="px-4 py-2">
            <Badge variant="success">アクティブ</Badge>
          </td>
        </tr>
        <tr className="border-t">
          <td className="px-4 py-2">佐藤花子</td>
          <td className="px-4 py-2">
            <Badge variant="user">一般ユーザー</Badge>
          </td>
          <td className="px-4 py-2">
            <Badge variant="success">アクティブ</Badge>
          </td>
        </tr>
        <tr className="border-t">
          <td className="px-4 py-2">鈴木一郎</td>
          <td className="px-4 py-2">
            <Badge variant="user">一般ユーザー</Badge>
          </td>
          <td className="px-4 py-2">
            <Badge variant="danger">非アクティブ</Badge>
          </td>
        </tr>
      </tbody>
    </table>
  ),
};
