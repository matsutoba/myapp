import type { Meta, StoryObj } from '@storybook/react';
import { FeatureTitleBar } from './FeatureTitleBar';

const meta: Meta<typeof FeatureTitleBar> = {
  title: 'UI/FeatureTitleBar',
  component: FeatureTitleBar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FeatureTitleBar>;

export const Default: Story = {
  args: {
    title: 'ページタイトル',
  },
};

export const LongTitle: Story = {
  args: {
    title: 'ユーザー管理 > 編集 > プロフィール設定',
  },
};

export const WithPage: Story = {
  render: () => (
    <div>
      <FeatureTitleBar title="ユーザー管理" />
      <div className="p-4">
        <p>ページのコンテンツがここに表示されます</p>
      </div>
    </div>
  ),
};

export const MultipleSections: Story = {
  render: () => (
    <div className="space-y-4">
      <FeatureTitleBar title="ダッシュボード" />
      <div className="p-4 bg-gray-50">
        <p>ダッシュボードのコンテンツ</p>
      </div>
      <FeatureTitleBar title="設定" />
      <div className="p-4 bg-gray-50">
        <p>設定のコンテンツ</p>
      </div>
    </div>
  ),
};
