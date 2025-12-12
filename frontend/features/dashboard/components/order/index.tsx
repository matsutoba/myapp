import { getOrderAnalytics } from '@/features/dashboard/actions/getOrderAnalytics';
import ChartClient from './ChartClient';
import KpiCard from './KpiCard';

type Props = {
  from?: string;
  to?: string;
};

export default async function OrderSection({ from, to }: Props) {
  // call server action to get analytics for provided range (or defaults)
  let data;
  try {
    data = await getOrderAnalytics({ from, to, groupBy: 'day' });
  } catch (e) {
    data = null;
  }

  // build times array for ChartClient
  const times = (data?.timeseries ?? []).map((r) => ({
    date: r.period,
    orders: r.count,
    revenue: Math.round(r.total),
  }));

  return (
    <>
      <KpiCard data={data} />
      <ChartClient data={times} />
    </>
  );
}
