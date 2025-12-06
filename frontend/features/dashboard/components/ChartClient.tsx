'use client';

import { Card } from '@/components/ui';
import React from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// モックデータを生成（直近30日）
function generateMockData() {
  const data = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    // ランダムな注文数・売上
    const orders = Math.floor(Math.random() * 20);
    const revenue = orders * (500 + Math.floor(Math.random() * 3000));
    data.push({ date: dateStr, orders, revenue });
  }
  return data;
}

type Props = {
  data?: Array<{ date: string; orders: number; revenue: number }>;
};

export default function ChartClient({ data }: Props) {
  const internal = React.useMemo(() => generateMockData(), []);
  const chartData = data && data.length > 0 ? data : internal;

  const formatToYMD = (val: unknown) => {
    try {
      if (typeof val === 'string') {
        // discard time portion if present
        const s = val.split('T')[0].split(' ')[0].slice(0, 10);
        return s.replace(/-/g, '/');
      }
      if (typeof val === 'number') {
        const d = new Date(val);
        return d.toISOString().slice(0, 10).replace(/-/g, '/');
      }
      return String(val);
    } catch (e) {
      return String(val);
    }
  };

  return (
    <Card>
      <h2 className="text-2xl font-semibold mb-4">注文数と売上</h2>
      <div>
        <div className="col-span-1 sm:col-span-2">
          <div className="bg-white rounded-lg shadow p-4">
            <div style={{ width: '100%', height: 340 }}>
              <ResponsiveContainer>
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 40, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(v) => formatToYMD(v)} />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      name === 'revenue' ? `¥${value}` : value,
                      name,
                    ]}
                    labelFormatter={(label) => formatToYMD(label)}
                  />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="orders"
                    stroke="#8884d8"
                    name="注文数"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#82ca9d"
                    name="売上"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
