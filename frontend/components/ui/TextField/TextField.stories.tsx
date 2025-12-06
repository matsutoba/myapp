import { IconButton, type IconName } from '@/components/ui';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import TextField from './TextField';

const meta: Meta<typeof TextField> = {
  title: 'UI/TextField',
  component: TextField,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TextField>;

export const Default: Story = {
  args: {
    placeholder: '検索',
    value: '',
  },
};

export const WithValue: Story = {
  render: () => {
    function Example() {
      const [value, setValue] = useState('山田太郎');

      return (
        <div className="p-4">
          <TextField
            placeholder="検索"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onEnter={() => console.log('enter', value)}
            onClear={() => {
              console.log('cleared');
              setValue('');
            }}
          />
        </div>
      );
    }

    return <Example />;
  },
};

export const Interactive: Story = {
  render: () => {
    function Wrapper() {
      const [value, setValue] = useState('');
      return (
        <div className="p-4">
          <TextField
            placeholder="名前 or メールで検索"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onEnter={() => console.log('search:', value)}
            onClear={() => {
              console.log('clear');
              setValue('');
            }}
          />
        </div>
      );
    }

    return <Wrapper />;
  },
};

export const WithTrailing: Story = {
  render: () => {
    function Wrapper() {
      const [value, setValue] = useState('');
      return (
        <div className="p-4">
          <TextField
            placeholder="名前 or メールで検索 (trailingあり)"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onEnter={() => console.log('search:', value)}
            onClear={() => {
              console.log('clear');
              setValue('');
            }}
            trailing={
              value && value !== '' ? (
                <IconButton
                  icon={'X' as IconName}
                  onClick={() => {
                    setValue('');
                  }}
                  aria-label="検索条件をクリア"
                />
              ) : (
                <IconButton
                  icon={'Search' as IconName}
                  onClick={() => console.log('search click')}
                  aria-label="検索"
                />
              )
            }
          />
        </div>
      );
    }

    return <Wrapper />;
  },
};
