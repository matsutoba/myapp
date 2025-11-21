import type { Meta, StoryObj } from '@storybook/react';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  args: {
    label: '選択してください',
    options: [
      { value: 'option1', label: 'オプション 1' },
      { value: 'option2', label: 'オプション 2' },
      { value: 'option3', label: 'オプション 3' },
    ],
  },
};

export const WithValue: Story = {
  args: {
    label: 'ロール',
    value: 'admin',
    options: [
      { value: 'admin', label: '管理者' },
      { value: 'user', label: '一般ユーザー' },
    ],
  },
};

export const Required: Story = {
  args: {
    label: 'ロール',
    required: true,
    options: [
      { value: '', label: '選択してください' },
      { value: 'admin', label: '管理者' },
      { value: 'user', label: '一般ユーザー' },
    ],
  },
};

export const WithHelperText: Story = {
  args: {
    label: '通知頻度',
    helperText: '通知を受け取る頻度を選択してください',
    options: [
      { value: 'realtime', label: 'リアルタイム' },
      { value: 'hourly', label: '毎時' },
      { value: 'daily', label: '毎日' },
      { value: 'weekly', label: '毎週' },
    ],
  },
};

export const WithError: Story = {
  args: {
    label: 'カテゴリ',
    error: 'カテゴリを選択してください',
    options: [
      { value: '', label: '選択してください' },
      { value: 'electronics', label: '電子機器' },
      { value: 'books', label: '書籍' },
      { value: 'clothing', label: '衣類' },
    ],
  },
};

export const Disabled: Story = {
  args: {
    label: '無効な選択',
    disabled: true,
    value: 'disabled',
    options: [
      { value: 'disabled', label: '編集できません' },
      { value: 'other', label: 'その他' },
    ],
  },
};

export const Countries: Story = {
  args: {
    label: '国',
    options: [
      { value: '', label: '国を選択' },
      { value: 'jp', label: '日本' },
      { value: 'us', label: 'アメリカ' },
      { value: 'uk', label: 'イギリス' },
      { value: 'fr', label: 'フランス' },
      { value: 'de', label: 'ドイツ' },
      { value: 'cn', label: '中国' },
      { value: 'kr', label: '韓国' },
    ],
  },
};

export const FormExample: Story = {
  render: () => (
    <div className="max-w-md space-y-4">
      <Select
        label="ロール"
        required
        options={[
          { value: '', label: '選択してください' },
          { value: 'admin', label: '管理者' },
          { value: 'user', label: '一般ユーザー' },
          { value: 'guest', label: 'ゲスト' },
        ]}
      />
      <Select
        label="部署"
        required
        options={[
          { value: '', label: '選択してください' },
          { value: 'sales', label: '営業部' },
          { value: 'engineering', label: '技術部' },
          { value: 'marketing', label: 'マーケティング部' },
          { value: 'hr', label: '人事部' },
        ]}
      />
      <Select
        label="通知設定"
        helperText="メール通知の頻度を選択してください"
        options={[
          { value: 'realtime', label: 'リアルタイム' },
          { value: 'daily', label: '毎日' },
          { value: 'weekly', label: '毎週' },
          { value: 'never', label: '受け取らない' },
        ]}
      />
    </div>
  ),
};
