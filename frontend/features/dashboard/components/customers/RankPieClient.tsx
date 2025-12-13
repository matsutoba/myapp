'use client';

import { Card } from '@/components/ui';
import { RankCount } from '@/features/dashboard/types';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const COLORS = ['#4f46e5', '#f59e0b', '#10b981', '#ef4444', '#60a5fa'];

export default function RankPieClient({ data }: { data: RankCount[] }) {
  const chartData = data ?? [];

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-2">顧客ランク別構成比</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData as any}
              dataKey="count"
              nameKey="rank"
              cx="50%"
              cy="50%"
              outerRadius={90}
              fill="#8884d8"
              label={({ name, percent }: any) =>
                `${name} ${(Number(percent) * 100).toFixed(0)}%`
              }
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(v: number) => v} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
