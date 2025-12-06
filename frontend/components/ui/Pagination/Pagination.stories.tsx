import type { Meta } from '@storybook/react';
import { useState } from 'react';
import Pagination from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'UI/Pagination',
  component: Pagination,
};

export default meta;

export const Default = () => {
  const [page, setPage] = useState<number>(1);
  return (
    <div className="p-8">
      <Pagination
        page={page}
        totalPages={12}
        onPageChange={(p: number) => setPage(p)}
      />
    </div>
  );
};
