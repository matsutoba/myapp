import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../Button/Button';
import { Modal } from './Modal';

const meta: Meta<typeof Modal> = {
  title: 'UI/Modal',
  component: Modal,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Modal>;

export const Sizes: Story = {
  render: () => {
    function Example() {
      const [openSmall, setOpenSmall] = useState(false);
      const [openMedium, setOpenMedium] = useState(false);
      const [openLarge, setOpenLarge] = useState(false);

      return (
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={() => setOpenSmall(true)}>Small</Button>
            <Button onClick={() => setOpenMedium(true)}>Medium</Button>
            <Button onClick={() => setOpenLarge(true)}>Large</Button>
          </div>

          <Modal
            open={openSmall}
            onClose={() => setOpenSmall(false)}
            title="Small モーダル"
            size="small"
          >
            <div className="p-2">Small content</div>
          </Modal>

          <Modal
            open={openMedium}
            onClose={() => setOpenMedium(false)}
            title="Medium モーダル"
            size="medium"
          >
            <div className="p-2">Medium content</div>
          </Modal>

          <Modal
            open={openLarge}
            onClose={() => setOpenLarge(false)}
            title="Large モーダル"
            size="large"
          >
            <div className="p-2">Large content</div>
          </Modal>
        </div>
      );
    }

    return <Example />;
  },
};
