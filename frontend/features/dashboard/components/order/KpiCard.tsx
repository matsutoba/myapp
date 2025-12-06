'use client';

import { Card } from '@/components/ui';
import type { OrderAnalyticsResponse } from '@/features/dashboard/actions/getOrderAnalytics';

export default function KpiCard({
  data,
  periodLabel,
}: {
  data?: OrderAnalyticsResponse | null;
  periodLabel?: string;
}) {
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

  return (
    <Card>
      <h2 className="text-2xl font-semibold mb-2">注文KPI</h2>
      {periodLabel ? (
        <div className="text-sm text-gray-500 mb-4">
          集計期間：{periodLabel}
        </div>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {kpis.map((k) => (
          <div key={k.title}>
            <div className="bg-white rounded-lg shadow p-4 flex flex-col">
              <div className="text-sm text-gray-500">{k.title}</div>
              <div className="mt-2 text-2xl font-semibold">{k.value}</div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
