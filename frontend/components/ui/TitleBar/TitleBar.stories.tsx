import type { Meta, StoryObj } from '@storybook/react';
import { TitleBar } from './TitleBar';

const meta: Meta<typeof TitleBar> = {
  title: 'UI/TitleBar',
  component: TitleBar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TitleBar>;

export const Admin: Story = {
  args: {
    user: {
      name: '山田太郎',
      email: 'yamada@example.com',
      role: 'admin',
    },
    onLogout: () => alert('ログアウト'),
  },
};

export const User: Story = {
  args: {
    user: {
      name: '佐藤花子',
      email: 'sato@example.com',
      role: 'user',
    },
    onLogout: () => alert('ログアウト'),
  },
};

export const WithEmailOnly: Story = {
  args: {
    user: {
      email: 'user@example.com',
      role: 'user',
    },
    onLogout: () => alert('ログアウト'),
  },
};

export const CustomAppName: Story = {
  args: {
    appName: 'カスタムアプリ',
    user: {
      name: '鈴木一郎',
      email: 'suzuki@example.com',
      role: 'user',
    },
    onLogout: () => alert('ログアウト'),
  },
};

export const NoUser: Story = {
  args: {
    user: null,
  },
};

export const WithPage: Story = {
  render: () => (
    <div>
      <TitleBar
        user={{
          name: '管理者',
          email: 'admin@example.com',
          role: 'admin',
        }}
        onLogout={() => alert('ログアウト')}
      />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">ページコンテンツ</h1>
        <p>タイトルバーの下にコンテンツが表示されます</p>
      </div>
    </div>
  ),
};

export const AdminAndUser: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold mb-2 px-4">管理者</h3>
        <TitleBar
          user={{
            name: '管理者',
            email: 'admin@example.com',
            role: 'admin',
          }}
          onLogout={() => alert('ログアウト')}
        />
      </div>
      <div>
        <h3 className="text-sm font-bold mb-2 px-4">一般ユーザー</h3>
        <TitleBar
          user={{
            name: '一般ユーザー',
            email: 'user@example.com',
            role: 'user',
          }}
          onLogout={() => alert('ログアウト')}
        />
      </div>
    </div>
  ),
};
