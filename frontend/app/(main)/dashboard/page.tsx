import { getOrderAnalytics } from '@/features/dashboard/actions/getOrderAnalytics';
import Dashboard from '@/features/dashboard/components/Dashboard';

export default async function DashboardPage() {
  const data = await getOrderAnalytics().catch(() => null);
  return <Dashboard data={data} />;
}
