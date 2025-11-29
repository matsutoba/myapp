'use client';

import { PAGINATION_DEFAULT_TAKE } from '@/constants';
import { useRouter, useSearchParams } from 'next/navigation';

type UsePaginationOpts = {
  takeFromHook?: number;
  total?: number;
  defaultTake?: number;
  basePath?: string;
};

export default function usePagination({
  takeFromHook,
  total,
  defaultTake = PAGINATION_DEFAULT_TAKE,
  basePath = '/admin/users',
}: UsePaginationOpts) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const takeVal = Number(
    searchParams.get('take') || takeFromHook || defaultTake,
  );
  const skipVal = Number(searchParams.get('skip') || 0);
  const currentPage = Math.floor(skipVal / takeVal) + 1;
  const totalPages = Math.max(
    1,
    Math.ceil((total || 0) / (takeVal || defaultTake)),
  );

  const handlePageChange = (p: number) => {
    const newSkip = (p - 1) * takeVal;
    const pageQuery =
      newSkip > 0 ? `?skip=${newSkip}&take=${takeVal}` : `?take=${takeVal}`;
    router.push(`${basePath}${pageQuery}`);
  };

  return {
    takeVal,
    skipVal,
    currentPage,
    totalPages,
    handlePageChange,
    searchParams,
  };
}
