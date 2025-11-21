import type { Meta, StoryObj } from '@storybook/react';
import { HamburgerButton } from './HamburgerButton';

const meta: Meta<typeof HamburgerButton> = {
  title: 'UI/HamburgerButton',
  component: HamburgerButton,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof HamburgerButton>;

export const Default: Story = {
  args: {},
};

export const OnDarkBackground: Story = {
  args: {},
  decorators: [
    (Story) => (
      <div className="bg-gray-800 text-white p-4 inline-block rounded">
        <Story />
      </div>
    ),
  ],
};

export const InHeader: Story = {
  render: () => (
    <div className="bg-indigo-900 text-white h-12 flex items-center px-4 justify-between">
      <HamburgerButton />
      <div className="font-bold">MyApp</div>
      <div className="w-8" /> {/* Spacer for alignment */}
    </div>
  ),
};
