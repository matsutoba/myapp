import type { Meta, StoryObj } from '@storybook/react';
import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Layout/Card',
  component: Card,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    padding: 'md',
  },
  render: (args) => (
    <Card {...args}>
      <h2 className="text-xl font-bold mb-2">カードタイトル</h2>
      <p>
        これはカード内のコンテンツです。白背景、影付き、角丸のデザインです。
      </p>
    </Card>
  ),
};

export const PaddingVariations: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="font-bold mb-2">Padding: none</h3>
        <Card padding="none">
          <div className="bg-blue-50 p-4">
            パディングなし - テーブルやリストに最適
          </div>
        </Card>
      </div>
      <div>
        <h3 className="font-bold mb-2">Padding: sm (16px)</h3>
        <Card padding="sm">小さいパディング - コンパクトなカード</Card>
      </div>
      <div>
        <h3 className="font-bold mb-2">Padding: md (24px)</h3>
        <Card padding="md">標準のパディング - デフォルト</Card>
      </div>
      <div>
        <h3 className="font-bold mb-2">Padding: lg (32px)</h3>
        <Card padding="lg">大きいパディング - 余裕のあるレイアウト</Card>
      </div>
    </div>
  ),
};

export const WithTable: Story = {
  render: () => (
    <Card padding="none">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              名前
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              メール
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              ロール
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          <tr>
            <td className="px-6 py-4">山田太郎</td>
            <td className="px-6 py-4">yamada@example.com</td>
            <td className="px-6 py-4">管理者</td>
          </tr>
          <tr>
            <td className="px-6 py-4">佐藤花子</td>
            <td className="px-6 py-4">sato@example.com</td>
            <td className="px-6 py-4">一般ユーザー</td>
          </tr>
        </tbody>
      </table>
    </Card>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Card>
      <h2 className="text-xl font-bold mb-4">ログイン</h2>
      <form className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">メールアドレス</label>
          <input
            type="email"
            className="w-full border rounded p-2"
            placeholder="user@example.com"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">パスワード</label>
          <input type="password" className="w-full border rounded p-2" />
        </div>
        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded">
          ログイン
        </button>
      </form>
    </Card>
  ),
};

export const MultipleCards: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <Card>
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600">150</div>
          <div className="text-gray-600 mt-1">ユーザー数</div>
        </div>
      </Card>
      <Card>
        <div className="text-center">
          <div className="text-4xl font-bold text-green-600">89%</div>
          <div className="text-gray-600 mt-1">稼働率</div>
        </div>
      </Card>
      <Card>
        <div className="text-center">
          <div className="text-4xl font-bold text-orange-600">24</div>
          <div className="text-gray-600 mt-1">通知</div>
        </div>
      </Card>
    </div>
  ),
};
