import { useState } from 'react';
import Pagination from './Pagination';

export default {
  title: 'UI/Pagination',
  component: Pagination,
};

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
