'use client';

import { Card } from '@/components/ui';
import { actions } from '@/lib/actions';
import React from 'react';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

type RankRow = { rank: string; count: number };

const COLORS = ['#4f46e5', '#f59e0b', '#10b981', '#ef4444', '#60a5fa'];

async function fetchRankData(): Promise<RankRow[] | null> {
  try {
    const data = await actions.dashboard.getCustomerRank();
    return data as RankRow[];
  } catch (e) {
    return null;
  }
}

function generateMock(): RankRow[] {
  return [
    { rank: 'vip', count: 12 },
    { rank: 'gold', count: 32 },
    { rank: 'silver', count: 54 },
    { rank: 'bronze', count: 22 },
  ];
}

export default function RankPieClient() {
  const [data, setData] = React.useState<RankRow[] | null>(null);

  React.useEffect(() => {
    let mounted = true;
    fetchRankData().then((d) => {
      if (!mounted) return;
      if (d && d.length > 0) setData(d);
      else setData(generateMock());
    });
    return () => {
      mounted = false;
    };
  }, []);

  const chartData = data ?? generateMock();

  return (
    <Card>
      <h3 className="text-lg font-semibold mb-2">顧客ランク別構成比</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
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
