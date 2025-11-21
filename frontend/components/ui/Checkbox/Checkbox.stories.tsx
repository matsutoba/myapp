import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: 'チェックボックス',
  },
};

export const WithHelperText: Story = {
  args: {
    label: '利用規約に同意する',
    helperText: '続行するには利用規約に同意する必要があります',
  },
};

export const WithError: Story = {
  args: {
    label: '必須項目',
    error: 'この項目をチェックしてください',
  },
};

export const Disabled: Story = {
  args: {
    label: '無効なチェックボックス',
    disabled: true,
  },
};

export const Checked: Story = {
  args: {
    label: 'チェック済み',
    defaultChecked: true,
  },
};

export const MultipleCheckboxes: Story = {
  render: () => (
    <div className="space-y-4">
      <Checkbox label="オプション 1" />
      <Checkbox label="オプション 2" />
      <Checkbox label="オプション 3" defaultChecked />
      <Checkbox label="オプション 4（無効）" disabled />
    </div>
  ),
};

export const InForm: Story = {
  render: () => (
    <div className="max-w-md border p-4 rounded">
      <h3 className="font-bold mb-4">通知設定</h3>
      <div className="space-y-3">
        <Checkbox
          label="メール通知を受け取る"
          helperText="新しいメッセージやアップデートをメールで受け取ります"
          defaultChecked
        />
        <Checkbox
          label="プッシュ通知を受け取る"
          helperText="ブラウザでプッシュ通知を表示します"
        />
        <Checkbox
          label="マーケティングメールを受け取る"
          helperText="新機能やキャンペーン情報をお届けします"
        />
      </div>
    </div>
  ),
};
