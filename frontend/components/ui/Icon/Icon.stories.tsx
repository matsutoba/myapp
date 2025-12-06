import type { Meta, StoryObj } from '@storybook/react';
import { Icon, type IconName } from './Icon';

const meta = {
  title: 'Components/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: [
        'User',
        'Settings',
        'Home',
        'Search',
        'Bell',
        'Mail',
        'Heart',
        'Star',
        'Check',
        'X',
        'ChevronRight',
        'ChevronLeft',
        'AlertCircle',
        'Info',
        'Trash',
        'Edit',
        'Download',
        'Upload',
        'Calendar',
        'Clock',
      ],
    },
    size: {
      control: { type: 'range', min: 12, max: 64, step: 4 },
    },
    strokeWidth: {
      control: { type: 'range', min: 1, max: 4, step: 0.5 },
    },
    color: {
      control: 'color',
    },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'User',
    size: 24,
  },
};

export const Small: Story = {
  args: {
    name: 'Heart',
    size: 16,
  },
};

export const Large: Story = {
  args: {
    name: 'Star',
    size: 48,
  },
};

export const CustomColor: Story = {
  args: {
    name: 'AlertCircle',
    size: 32,
    color: '#ef4444',
  },
};

export const ThickStroke: Story = {
  args: {
    name: 'Check',
    size: 32,
    strokeWidth: 3,
  },
};

export const WithTailwindClass: Story = {
  args: {
    name: 'Mail',
    size: 32,
    className: 'text-blue-500',
  },
};
export const IconGallery = {
  render: () => (
    <div className="grid grid-cols-6 gap-4">
      {(
        [
          'User',
          'Settings',
          'Home',
          'Search',
          'Bell',
          'Mail',
          'Heart',
          'Star',
          'Check',
          'X',
          'ChevronRight',
          'ChevronLeft',
          'AlertCircle',
          'Info',
          'Trash',
          'Edit',
          'Download',
          'Upload',
          'Calendar',
          'Clock',
          'Menu',
          'LogOut',
          'Save',
          'Share',
        ] as IconName[]
      ).map((iconName) => (
        <div
          key={iconName}
          className="flex flex-col items-center gap-2 p-4 border rounded hover:bg-gray-50"
        >
          <Icon name={iconName} size={24} />
          <span className="text-xs text-gray-600">{iconName}</span>
        </div>
      ))}
    </div>
  ),
};
