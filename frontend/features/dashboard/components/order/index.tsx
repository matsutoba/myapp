'use client';

import { DashboardResponse } from '@/features/dashboard/types';
import ChartClient from './ChartClient';
import KpiCard from './KpiCard';

type Props = {
  data: Partial<DashboardResponse>;
};

export default function OrderSection({ data }: Props) {
  // build times array for ChartClient
  const times = (data?.timeseries ?? []).map((r) => ({
    date: r.period,
    orders: r.count,
    revenue: Math.round(r.total),
  }));

  return (
    <>
      <KpiCard data={data as DashboardResponse} />
      <ChartClient data={times} />
    </>
  );
}
