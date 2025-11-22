import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'UI/Spinner',
  component: Spinner,
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: {
    open: true,
    message: '読み込み中...',
    blockInteraction: true,
  },
};

export const Small: Story = {
  args: {
    open: true,
    message: '小サイズ',
    size: 'sm',
    blockInteraction: false,
  },
};

export const Large: Story = {
  args: {
    open: true,
    message: '大サイズ',
    size: 'lg',
    blockInteraction: true,
  },
};

export const NonBlocking: Story = {
  args: {
    open: true,
    message: 'バックグラウンドで処理中（操作可能）',
    blockInteraction: false,
  },
};

export const Masked: Story = {
  args: {
    open: true,
    message: '全画面マスク表示',
    blockInteraction: true,
    mask: true,
  },
};

export const MaskedWithOverlay: Story = {
  args: {
    open: true,
    message: '全画面マスク（薄い黒半透明）',
    blockInteraction: true,
    mask: true,
    overlay: true,
    overlayOpacity: 0.2,
  },
};

export const InlineInContainer: Story = {
  render: (args) => (
    <div
      style={{
        width: 400,
        height: 200,
        border: '1px solid #ddd',
        position: 'relative',
        padding: 16,
      }}
    >
      <p>親コンテナの中身（下層の要素）</p>
      <Spinner {...args} />
    </div>
  ),
  args: {
    open: true,
    message: '親コンテナ内で表示',
    blockInteraction: false,
    mask: false,
  },
};
