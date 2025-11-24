import { Story } from '@storybook/react';
import { useState } from 'react';
import Pagination from './Pagination';

export default {
  title: 'UI/Pagination',
  component: Pagination,
};

const Template: Story = () => {
  const [page, setPage] = useState(1);
  return (
    <div className="p-8">
      <Pagination
        page={page}
        totalPages={12}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
};

export const Default = Template.bind({});
