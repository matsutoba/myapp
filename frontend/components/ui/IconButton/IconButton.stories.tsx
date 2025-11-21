import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './IconButton';

const meta: Meta<typeof IconButton> = {
  title: 'UI/IconButton',
  component: IconButton,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'text',
      description: 'lucide-react icon name',
    },
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Edit: Story = {
  args: {
    icon: 'Pencil',
    'aria-label': '編集',
  },
};

export const Delete: Story = {
  args: {
    icon: 'Trash',
    'aria-label': '削除',
  },
};

export const Add: Story = {
  args: {
    icon: 'Plus',
    'aria-label': '追加',
  },
};

export const Close: Story = {
  args: {
    icon: 'X',
    'aria-label': '閉じる',
  },
};

export const Search: Story = {
  args: {
    icon: 'Search',
    'aria-label': '検索',
  },
};

export const Settings: Story = {
  args: {
    icon: 'Settings',
    'aria-label': '設定',
  },
};

export const Small: Story = {
  args: {
    icon: 'Heart',
    size: 'sm',
    'aria-label': 'いいね',
  },
};

export const Medium: Story = {
  args: {
    icon: 'Heart',
    size: 'md',
    'aria-label': 'いいね',
  },
};

export const Large: Story = {
  args: {
    icon: 'Heart',
    size: 'lg',
    'aria-label': 'いいね',
  },
};

export const CommonIcons: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <IconButton icon="Pencil" aria-label="編集" />
      <IconButton icon="Trash" aria-label="削除" />
      <IconButton icon="Plus" aria-label="追加" />
      <IconButton icon="X" aria-label="閉じる" />
      <IconButton icon="Search" aria-label="検索" />
      <IconButton icon="Settings" aria-label="設定" />
      <IconButton icon="Download" aria-label="ダウンロード" />
      <IconButton icon="Upload" aria-label="アップロード" />
      <IconButton icon="Eye" aria-label="表示" />
      <IconButton icon="EyeOff" aria-label="非表示" />
      <IconButton icon="Heart" aria-label="いいね" />
      <IconButton icon="Share" aria-label="共有" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex gap-2 items-center">
      <IconButton icon="Heart" size="sm" aria-label="Small" />
      <IconButton icon="Heart" size="md" aria-label="Medium" />
      <IconButton icon="Heart" size="lg" aria-label="Large" />
    </div>
  ),
};

export const InTable: Story = {
  render: () => (
    <table className="min-w-full border">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-4 py-2 text-left">名前</th>
          <th className="px-4 py-2 text-left">メール</th>
          <th className="px-4 py-2 text-left">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-t">
          <td className="px-4 py-2">山田太郎</td>
          <td className="px-4 py-2">yamada@example.com</td>
          <td className="px-4 py-2">
            <div className="flex gap-2">
              <IconButton icon="Pencil" size="md" aria-label="編集" />
              <IconButton icon="Trash" size="md" aria-label="削除" />
            </div>
          </td>
        </tr>
        <tr className="border-t">
          <td className="px-4 py-2">佐藤花子</td>
          <td className="px-4 py-2">sato@example.com</td>
          <td className="px-4 py-2">
            <div className="flex gap-2">
              <IconButton icon="Pencil" size="md" aria-label="編集" />
              <IconButton icon="Trash" size="md" aria-label="削除" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  ),
};
