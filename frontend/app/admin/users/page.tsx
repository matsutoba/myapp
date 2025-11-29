import { PAGINATION_DEFAULT_TAKE } from '@/constants';
import UserList from '@/features/user/components/list/UserList';

interface UsersPageProps {
  params?: { skip?: string; take?: string; keyword?: string };
}

export default async function UsersPage({ params }: UsersPageProps) {
  const sp = params ?? {};
  const skip = Number(sp?.skip || 0);
  const take = sp?.take ? Number(sp.take) : PAGINATION_DEFAULT_TAKE;
  const keyword = sp?.keyword || undefined;
  const opts = { skip, take, keyword };

  return <UserList opts={opts} />;
}
