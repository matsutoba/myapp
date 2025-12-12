import type {
  OrderAggregateRow,
  OrderAnalyticsResponse,
} from '@/features/dashboard/actions/getOrderAnalytics';
import MonthlyNewBarClient from '@/features/dashboard/components/customers/MonthlyNewBarClient';
import RankPieClient from '@/features/dashboard/components/customers/RankPieClient';
import ChartClient from '@/features/dashboard/components/order/ChartClient';
import KpiCard from '@/features/dashboard/components/order/KpiCard';
import { formatDate } from '@/lib/date/formatDate';

export default function Dashboard({
  data,
}: {
  data: OrderAnalyticsResponse | null;
}) {
  const times = (data?.timeseries ?? []).map((r: OrderAggregateRow) => ({
    date: r.period,
    orders: r.count,
    revenue: Math.round(r.total),
  }));

  let periodLabel = '';
  if (data?.from && data?.to) {
    const f = formatDate(data.from, { formatStr: 'yyyy/MM/dd' });
    const t = formatDate(data.to, { formatStr: 'yyyy/MM/dd' });
    periodLabel = f === t ? f : `${f} 〜 ${t}`;
  } else if (times.length > 0) {
    const f = formatDate(times[0].date ?? '', { formatStr: 'yyyy/MM/dd' });
    const t = formatDate(times[times.length - 1].date ?? '', {
      formatStr: 'yyyy/MM/dd',
    });
    periodLabel = f === t ? f : `${f} 〜 ${t}`;
  }

  if (!data) {
    return (
      <div>
        <h1 className="text-2xl font-semibold mb-4">ダッシュボード</h1>
        <div className="text-gray-600">データが存在しません。</div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <KpiCard data={data} periodLabel={periodLabel} />
        <ChartClient data={times} periodLabel={periodLabel} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RankPieClient />
        <MonthlyNewBarClient />
      </div>
    </>
  );
}
