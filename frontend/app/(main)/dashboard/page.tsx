import { getOrderAnalytics } from '@/features/dashboard/actions/getOrderAnalytics';
import DashboardServer from '@/features/dashboard/components/DashboardServer';

export default async function DashboardPage() {
  const data = await getOrderAnalytics().catch(() => null);
  return <DashboardServer data={data} />;
}
