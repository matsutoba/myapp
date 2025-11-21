import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button/Button';
import { Stack } from './Stack';

const meta: Meta<typeof Stack> = {
  title: 'Layout/Stack',
  component: Stack,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Stack>;

export const Vertical: Story = {
  args: {
    direction: 'vertical',
    spacing: 'md',
  },
  render: (args) => (
    <Stack {...args}>
      <div className="bg-blue-100 p-4 rounded">Item 1</div>
      <div className="bg-blue-100 p-4 rounded">Item 2</div>
      <div className="bg-blue-100 p-4 rounded">Item 3</div>
    </Stack>
  ),
};

export const Horizontal: Story = {
  args: {
    direction: 'horizontal',
    spacing: 'md',
  },
  render: (args) => (
    <Stack {...args}>
      <div className="bg-blue-100 p-4 rounded">Item 1</div>
      <div className="bg-blue-100 p-4 rounded">Item 2</div>
      <div className="bg-blue-100 p-4 rounded">Item 3</div>
    </Stack>
  ),
};

export const SpacingVariations: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-bold mb-2">Spacing: none</h3>
        <Stack direction="horizontal" spacing="none">
          <div className="bg-blue-100 p-4 rounded">Item 1</div>
          <div className="bg-blue-100 p-4 rounded">Item 2</div>
          <div className="bg-blue-100 p-4 rounded">Item 3</div>
        </Stack>
      </div>
      <div>
        <h3 className="font-bold mb-2">Spacing: xs (4px)</h3>
        <Stack direction="horizontal" spacing="xs">
          <div className="bg-blue-100 p-4 rounded">Item 1</div>
          <div className="bg-blue-100 p-4 rounded">Item 2</div>
          <div className="bg-blue-100 p-4 rounded">Item 3</div>
        </Stack>
      </div>
      <div>
        <h3 className="font-bold mb-2">Spacing: sm (8px)</h3>
        <Stack direction="horizontal" spacing="sm">
          <div className="bg-blue-100 p-4 rounded">Item 1</div>
          <div className="bg-blue-100 p-4 rounded">Item 2</div>
          <div className="bg-blue-100 p-4 rounded">Item 3</div>
        </Stack>
      </div>
      <div>
        <h3 className="font-bold mb-2">Spacing: md (16px)</h3>
        <Stack direction="horizontal" spacing="md">
          <div className="bg-blue-100 p-4 rounded">Item 1</div>
          <div className="bg-blue-100 p-4 rounded">Item 2</div>
          <div className="bg-blue-100 p-4 rounded">Item 3</div>
        </Stack>
      </div>
      <div>
        <h3 className="font-bold mb-2">Spacing: lg (24px)</h3>
        <Stack direction="horizontal" spacing="lg">
          <div className="bg-blue-100 p-4 rounded">Item 1</div>
          <div className="bg-blue-100 p-4 rounded">Item 2</div>
          <div className="bg-blue-100 p-4 rounded">Item 3</div>
        </Stack>
      </div>
      <div>
        <h3 className="font-bold mb-2">Spacing: xl (32px)</h3>
        <Stack direction="horizontal" spacing="xl">
          <div className="bg-blue-100 p-4 rounded">Item 1</div>
          <div className="bg-blue-100 p-4 rounded">Item 2</div>
          <div className="bg-blue-100 p-4 rounded">Item 3</div>
        </Stack>
      </div>
    </div>
  ),
};

export const AlignmentVariations: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-bold mb-2">Align: start</h3>
        <Stack direction="horizontal" spacing="md" align="start">
          <div className="bg-blue-100 p-4 rounded h-20">Tall Item</div>
          <div className="bg-blue-100 p-4 rounded">Short</div>
          <div className="bg-blue-100 p-4 rounded">Short</div>
        </Stack>
      </div>
      <div>
        <h3 className="font-bold mb-2">Align: center</h3>
        <Stack direction="horizontal" spacing="md" align="center">
          <div className="bg-blue-100 p-4 rounded h-20">Tall Item</div>
          <div className="bg-blue-100 p-4 rounded">Short</div>
          <div className="bg-blue-100 p-4 rounded">Short</div>
        </Stack>
      </div>
      <div>
        <h3 className="font-bold mb-2">Align: end</h3>
        <Stack direction="horizontal" spacing="md" align="end">
          <div className="bg-blue-100 p-4 rounded h-20">Tall Item</div>
          <div className="bg-blue-100 p-4 rounded">Short</div>
          <div className="bg-blue-100 p-4 rounded">Short</div>
        </Stack>
      </div>
      <div>
        <h3 className="font-bold mb-2">Align: stretch</h3>
        <Stack direction="horizontal" spacing="md" align="stretch">
          <div className="bg-blue-100 p-4 rounded h-20">Tall Item</div>
          <div className="bg-blue-100 p-4 rounded">Short</div>
          <div className="bg-blue-100 p-4 rounded">Short</div>
        </Stack>
      </div>
    </div>
  ),
};

export const JustifyVariations: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-bold mb-2">Justify: start</h3>
        <Stack
          direction="horizontal"
          spacing="md"
          justify="start"
          className="border p-4"
        >
          <div className="bg-blue-100 p-4 rounded">Item 1</div>
          <div className="bg-blue-100 p-4 rounded">Item 2</div>
        </Stack>
      </div>
      <div>
        <h3 className="font-bold mb-2">Justify: center</h3>
        <Stack
          direction="horizontal"
          spacing="md"
          justify="center"
          className="border p-4"
        >
          <div className="bg-blue-100 p-4 rounded">Item 1</div>
          <div className="bg-blue-100 p-4 rounded">Item 2</div>
        </Stack>
      </div>
      <div>
        <h3 className="font-bold mb-2">Justify: end</h3>
        <Stack
          direction="horizontal"
          spacing="md"
          justify="end"
          className="border p-4"
        >
          <div className="bg-blue-100 p-4 rounded">Item 1</div>
          <div className="bg-blue-100 p-4 rounded">Item 2</div>
        </Stack>
      </div>
      <div>
        <h3 className="font-bold mb-2">Justify: between</h3>
        <Stack
          direction="horizontal"
          spacing="md"
          justify="between"
          className="border p-4"
        >
          <div className="bg-blue-100 p-4 rounded">Item 1</div>
          <div className="bg-blue-100 p-4 rounded">Item 2</div>
        </Stack>
      </div>
      <div>
        <h3 className="font-bold mb-2">Justify: around</h3>
        <Stack
          direction="horizontal"
          spacing="md"
          justify="around"
          className="border p-4"
        >
          <div className="bg-blue-100 p-4 rounded">Item 1</div>
          <div className="bg-blue-100 p-4 rounded">Item 2</div>
        </Stack>
      </div>
    </div>
  ),
};

export const ButtonGroup: Story = {
  render: () => (
    <Stack direction="horizontal" spacing="sm">
      <Button>保存</Button>
      <Button variant="secondary">キャンセル</Button>
      <Button variant="danger">削除</Button>
    </Stack>
  ),
};

export const FormLayout: Story = {
  render: () => (
    <Stack spacing="md">
      <div className="space-y-2">
        <label className="font-semibold">名前</label>
        <input
          type="text"
          className="w-full border rounded p-2"
          placeholder="山田太郎"
        />
      </div>
      <div className="space-y-2">
        <label className="font-semibold">メールアドレス</label>
        <input
          type="email"
          className="w-full border rounded p-2"
          placeholder="user@example.com"
        />
      </div>
      <Stack direction="horizontal" spacing="sm">
        <Button>保存</Button>
        <Button variant="secondary">キャンセル</Button>
      </Stack>
    </Stack>
  ),
};
