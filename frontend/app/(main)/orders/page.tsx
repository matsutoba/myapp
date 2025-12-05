import { PAGINATION_DEFAULT_TAKE } from '@/constants';

interface OrdersPageProps {
  params?: { skip?: string; take?: string; keyword?: string };
}

export default function OrdersPage({ params }: OrdersPageProps) {
  const sp = params ?? {};
  const skip = sp?.skip ? Number(sp.skip) : undefined;
  const take = sp?.take ? Number(sp.take) : PAGINATION_DEFAULT_TAKE;
  const keyword = sp?.keyword || undefined;
  const opts = { skip, take, keyword } as const;

  return <p>Order Management Page - Under Construction</p>;
}
