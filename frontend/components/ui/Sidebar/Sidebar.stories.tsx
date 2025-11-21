import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Sidebar, SidebarItem } from './Sidebar';

const meta: Meta<typeof Sidebar> = {
  title: 'UI/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

const menuItems: SidebarItem[] = [
  { title: 'ホーム', href: '/' },
  { title: 'ダッシュボード', href: '/dashboard' },
  { title: 'ユーザー管理', href: '/admin/users' },
  { title: '設定', href: '/settings' },
];

export const Closed: Story = {
  args: {
    isOpen: false,
    items: menuItems,
    onClose: () => {},
  },
};

export const Open: Story = {
  args: {
    isOpen: true,
    items: menuItems,
    onClose: () => {},
  },
};

export const WithIcons: Story = {
  args: {
    isOpen: true,
    items: [
      { title: 'ホーム', href: '/', icon: 'Home' },
      { title: 'ダッシュボード', href: '/dashboard', icon: 'LayoutDashboard' },
      { title: 'ユーザー', href: '/users', icon: 'Users' },
      { title: '設定', href: '/settings', icon: 'Settings' },
      { title: 'ログアウト', href: '/logout', icon: 'LogOut' },
    ],
    onClose: () => {},
  },
};

export const Interactive: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="h-screen bg-gray-100">
        <div className="bg-indigo-900 text-white h-12 flex items-center px-4">
          <button
            onClick={() => setIsOpen(true)}
            className="hover:bg-indigo-800 p-2 rounded"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="ml-4 font-bold">MyApp</div>
        </div>
        <div className="p-4">
          <p>ハンバーガーメニューをクリックしてサイドバーを開いてください</p>
        </div>
        <Sidebar
          isOpen={isOpen}
          items={[
            { title: 'ホーム', href: '/', icon: 'Home' },
            {
              title: 'ダッシュボード',
              href: '/dashboard',
              icon: 'LayoutDashboard',
            },
            { title: 'ユーザー管理', href: '/users', icon: 'Users' },
            { title: 'レポート', href: '/reports', icon: 'FileText' },
            { title: '設定', href: '/settings', icon: 'Settings' },
          ]}
          onClose={() => setIsOpen(false)}
        />
      </div>
    );
  },
};

export const LongMenu: Story = {
  args: {
    isOpen: true,
    items: [
      { title: 'ホーム', href: '/', icon: 'Home' },
      { title: 'ダッシュボード', href: '/dashboard', icon: 'LayoutDashboard' },
      { title: 'ユーザー管理', href: '/users', icon: 'Users' },
      { title: 'プロジェクト', href: '/projects', icon: 'Folder' },
      { title: 'タスク', href: '/tasks', icon: 'CheckSquare' },
      { title: 'カレンダー', href: '/calendar', icon: 'Calendar' },
      { title: 'メッセージ', href: '/messages', icon: 'MessageSquare' },
      { title: 'レポート', href: '/reports', icon: 'FileText' },
      { title: '分析', href: '/analytics', icon: 'BarChart' },
      { title: '通知', href: '/notifications', icon: 'Bell' },
      { title: '設定', href: '/settings', icon: 'Settings' },
      { title: 'ヘルプ', href: '/help', icon: 'HelpCircle' },
      { title: 'ログアウト', href: '/logout', icon: 'LogOut' },
    ],
    onClose: () => {},
  },
};
