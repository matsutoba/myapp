'use client';

import { Card } from '@/components/ui';
import { apiClient } from '@/lib/api/client';
import { MonthlyNew } from '@/features/dashboard/types';
import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

async function fetchMonthly(opts?: {
  from?: string;
  to?: string;
}): Promise<MonthlyNew[] | null> {
  try {
    const qs = opts
      ? `?from=${encodeURIComponent(opts.from ?? '')}&to=${encodeURIComponent(
          opts.to ?? '',
        )}`
      : '';
    const res = await apiClient<{ success: boolean; data?: MonthlyNew[] }>(
      `/api/dashboard/customers/new-signups${qs}`,
      { method: 'GET', credentials: 'include' },
    );
    if (!res || !res.success) return null;
    return (res.data ?? []) as MonthlyNew[];
  } catch (e) {
    return null;
  }
}

function generateMock(): MonthlyNew[] {
  const now = new Date();
  const arr: MonthlyNew[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const m = d.toISOString().slice(0, 7);
    arr.push({ month: m, newCustomers: 0 });
  }
  return arr;
}

export default function MonthlyNewBarClient({
  from,
  to,
}: {
  from?: string;
  to?: string;
}) {
  const [data, setData] = React.useState<MonthlyNew[] | null>(null);

  React.useEffect(() => {
    let mounted = true;
    fetchMonthly({ from, to }).then((d) => {
      if (!mounted) return;
      if (d && d.length > 0) setData(d);
      else setData(generateMock());
    });
    return () => {
      mounted = false;
    };
  }, [from, to]);

  const chartData = data ?? generateMock();

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-2">新規顧客数（年月）</h3>
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="newCustomers" name="新規顧客" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
