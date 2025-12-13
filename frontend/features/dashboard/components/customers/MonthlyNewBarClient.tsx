'use client';

import { Card } from '@/components/ui';
import { MonthlyNew } from '@/features/dashboard/types';
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

export default function MonthlyNewBarClient({ data }: { data: MonthlyNew[] }) {
  const chartData = data ?? [];

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
