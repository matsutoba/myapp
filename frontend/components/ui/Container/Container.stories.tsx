import type { Meta, StoryObj } from '@storybook/react';
import { Card } from '../Card/Card';
import { Container } from './Container';

const meta: Meta<typeof Container> = {
  title: 'Layout/Container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {
  args: {
    size: 'full',
    padding: 'md',
  },
  render: (args) => (
    <div className="bg-gray-100 min-h-screen">
      <Container {...args}>
        <div className="bg-white p-4 rounded shadow">
          <h1 className="text-2xl font-bold">コンテンツ</h1>
          <p className="mt-2">これはコンテナ内のコンテンツです。</p>
        </div>
      </Container>
    </div>
  ),
};

export const SizeVariations: Story = {
  render: () => (
    <div className="bg-gray-100 min-h-screen space-y-8 py-8">
      <div>
        <h3 className="text-center font-bold mb-2">Size: sm (672px)</h3>
        <Container size="sm">
          <Card>
            <p>Small container - フォーム向け</p>
          </Card>
        </Container>
      </div>
      <div>
        <h3 className="text-center font-bold mb-2">Size: md (896px)</h3>
        <Container size="md">
          <Card>
            <p>Medium container - 標準的なコンテンツ</p>
          </Card>
        </Container>
      </div>
      <div>
        <h3 className="text-center font-bold mb-2">Size: lg (1152px)</h3>
        <Container size="lg">
          <Card>
            <p>Large container - 広いコンテンツ</p>
          </Card>
        </Container>
      </div>
      <div>
        <h3 className="text-center font-bold mb-2">Size: xl (1280px)</h3>
        <Container size="xl">
          <Card>
            <p>Extra large container - ダッシュボード向け</p>
          </Card>
        </Container>
      </div>
      <div>
        <h3 className="text-center font-bold mb-2">Size: full (100%)</h3>
        <Container size="full">
          <Card>
            <p>Full width container</p>
          </Card>
        </Container>
      </div>
    </div>
  ),
};

export const PaddingVariations: Story = {
  render: () => (
    <div className="bg-gray-100 min-h-screen space-y-8 py-8">
      <div>
        <h3 className="text-center font-bold mb-2">Padding: none</h3>
        <Container size="md" padding="none" className="bg-blue-100">
          <Card>
            <p>パディングなし</p>
          </Card>
        </Container>
      </div>
      <div>
        <h3 className="text-center font-bold mb-2">Padding: sm (8px)</h3>
        <Container size="md" padding="sm" className="bg-blue-100">
          <Card>
            <p>小さいパディング</p>
          </Card>
        </Container>
      </div>
      <div>
        <h3 className="text-center font-bold mb-2">Padding: md (16px)</h3>
        <Container size="md" padding="md" className="bg-blue-100">
          <Card>
            <p>標準のパディング</p>
          </Card>
        </Container>
      </div>
      <div>
        <h3 className="text-center font-bold mb-2">Padding: lg (24px)</h3>
        <Container size="md" padding="lg" className="bg-blue-100">
          <Card>
            <p>大きいパディング</p>
          </Card>
        </Container>
      </div>
    </div>
  ),
};

export const FormPage: Story = {
  render: () => (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-gray-200 h-10 flex items-center px-4 font-semibold">
        ユーザー作成
      </div>
      <Container size="sm">
        <Card>
          <h2 className="text-xl font-bold mb-4">新規ユーザー</h2>
          <form className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">名前</label>
              <input type="text" className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block font-semibold mb-1">メールアドレス</label>
              <input type="email" className="w-full border rounded p-2" />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded">
                保存
              </button>
              <button className="px-4 py-2 bg-gray-200 rounded">
                キャンセル
              </button>
            </div>
          </form>
        </Card>
      </Container>
    </div>
  ),
};
