import ChartClient from '@/features/dashboard/components/ChartClient';
import KpiCard from '@/features/dashboard/components/KpiCard';
import { formatDate } from '@/lib/date/formatDate';

export default function DashboardServer({ data }: { data: any }) {
  const totalOrders = data?.kpis?.totalOrders ?? 0;
  const totalRevenue = data?.kpis?.totalRevenue ?? 0;
  const avg = data?.kpis?.avgOrderValue ?? 0;

  const nf = new Intl.NumberFormat('ja-JP');
  const currency = new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
  });

  const kpis = [
    { title: '総注文数', value: nf.format(totalOrders) },
    { title: '総売上', value: currency.format(Math.round(totalRevenue)) },
    { title: '平均注文額', value: currency.format(Math.round(avg)) },
  ];

  const times = (data?.timeseries ?? []).map((r: any) => ({
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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
      <KpiCard data={data} periodLabel={periodLabel} />
      <ChartClient data={times} periodLabel={periodLabel} />
    </div>
  );
}
