'use client';

import { apiClient } from '@/lib/api/client';
import { DashboardResponse } from '@/features/dashboard/types';
import React from 'react';
import ChartClient from './ChartClient';
import KpiCard from './KpiCard';

type Props = {
  from?: string;
  to?: string;
};

export default function OrderSection({ from, to }: Props) {
  const [data, setData] = React.useState<DashboardResponse | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const mountedRef = React.useRef(true);

  const fetchData = React.useCallback(async () => {
    try {
      const qs = `?group_by=day&from=${encodeURIComponent(
        from ?? '',
      )}&to=${encodeURIComponent(to ?? '')}`;
      const res = await apiClient<DashboardResponse>(`/api/dashboard${qs}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!mountedRef.current) return;
      setData(res.success && res.data ? res.data : null);
    } catch (e) {
      if (!mountedRef.current) return;
      setData(null);
    } finally {
      if (!mountedRef.current) return;
      setLoading(false);
    }
  }, [from, to]);

  React.useEffect(() => {
    mountedRef.current = true;
    setLoading(true);
    void fetchData();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchData]);

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
