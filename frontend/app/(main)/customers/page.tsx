import { PAGINATION_DEFAULT_TAKE } from '@/constants';
import CustomerList from '@/features/customer/components/list/CustomerList';

interface CustomersPageProps {
  params?: { skip?: string; take?: string; keyword?: string };
}

export default function CustomersPage({ params }: CustomersPageProps) {
  const sp = params ?? {};
  const skip = sp?.skip ? Number(sp.skip) : undefined;
  const take = sp?.take ? Number(sp.take) : PAGINATION_DEFAULT_TAKE;
  const keyword = sp?.keyword || undefined;
  const opts = { skip, take, keyword } as const;

  return <CustomerList opts={opts} />;
}
