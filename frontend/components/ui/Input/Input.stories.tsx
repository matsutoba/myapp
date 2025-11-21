import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: 'ラベル',
    placeholder: 'プレースホルダー',
  },
};

export const WithValue: Story = {
  args: {
    label: '名前',
    value: '山田太郎',
  },
};

export const Required: Story = {
  args: {
    label: 'メールアドレス',
    type: 'email',
    required: true,
    placeholder: 'user@example.com',
  },
};

export const WithHelperText: Story = {
  args: {
    label: 'パスワード',
    type: 'password',
    helperText: '最低6文字以上で設定してください',
    placeholder: 'パスワードを入力',
  },
};

export const WithError: Story = {
  args: {
    label: 'メールアドレス',
    type: 'email',
    value: 'invalid-email',
    error: '正しいメールアドレスを入力してください',
  },
};

export const Disabled: Story = {
  args: {
    label: '無効な入力',
    value: '編集できません',
    disabled: true,
  },
};

export const Password: Story = {
  args: {
    label: 'パスワード',
    type: 'password',
    placeholder: 'パスワードを入力',
  },
};

export const Number: Story = {
  args: {
    label: '年齢',
    type: 'number',
    placeholder: '20',
  },
};

export const Email: Story = {
  args: {
    label: 'メールアドレス',
    type: 'email',
    placeholder: 'user@example.com',
  },
};

export const FormExample: Story = {
  render: () => (
    <div className="max-w-md space-y-4">
      <Input label="名前" required placeholder="山田太郎" />
      <Input
        label="メールアドレス"
        type="email"
        required
        placeholder="user@example.com"
      />
      <Input
        label="パスワード"
        type="password"
        required
        helperText="最低6文字以上で設定してください"
      />
      <Input label="電話番号" type="tel" placeholder="090-1234-5678" />
      <Input
        label="自己紹介"
        helperText="任意入力です"
        placeholder="あなたについて教えてください"
      />
    </div>
  ),
};
