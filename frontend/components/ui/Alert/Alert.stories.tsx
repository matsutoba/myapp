import type { Meta, StoryObj } from '@storybook/react';
import { Notification } from '../Notification/Notification';

const meta: Meta<typeof Notification> = {
  title: 'Layout/Notification',
  component: Notification,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Notification>;

export const Info: Story = {
  args: {
    variant: 'info',
    children: '新しい機能が追加されました',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'ユーザーを正常に作成しました',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'この操作は取り消すことができません',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    children: 'ユーザーの作成に失敗しました',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Notification variant="info">
        これは情報メッセージです。新機能のお知らせなどに使用します。
      </Notification>
      <Notification variant="success">
        これは成功メッセージです。操作が正常に完了したことを示します。
      </Notification>
      <Notification variant="warning">
        これは警告メッセージです。注意が必要な操作の前に表示します。
      </Notification>
      <Notification variant="error">
        これはエラーメッセージです。操作が失敗したことを示します。
      </Alert>
    </div>
  ),
};

export const WithLongMessage: Story = {
  render: () => (
    <Notification variant="error">
      ユーザーの作成に失敗しました。以下の点をご確認ください：
      <ul className="list-disc ml-5 mt-2">
        <li>メールアドレスが正しい形式であること</li>
        <li>パスワードが6文字以上であること</li>
        <li>既に同じメールアドレスが登録されていないこと</li>
      </ul>
    </Alert>
  ),
};

export const InForm: Story = {
  render: () => (
    <div className="max-w-md">
      <form className="space-y-4">
        <Notification variant="error">
          メールアドレスまたはパスワードが正しくありません
        </Notification>
        <div>
          <label className="block font-semibold mb-1">メールアドレス</label>
          <input type="email" className="w-full border rounded p-2" />
        </div>
        <div>
          <label className="block font-semibold mb-1">パスワード</label>
          <input type="password" className="w-full border rounded p-2" />
        </div>
        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded">
          ログイン
        </button>
      </form>
    </div>
  ),
};
