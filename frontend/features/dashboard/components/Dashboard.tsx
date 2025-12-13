'use client';

import MonthlyNewBarClient from '@/features/dashboard/components/customers/MonthlyNewBarClient';
import RankPieClient from '@/features/dashboard/components/customers/RankPieClient';
import DashboardSummary from '@/features/dashboard/components/DashboardSummary';
import OrderSection from '@/features/dashboard/components/order';
import { formatDate } from '@/lib/date/formatDate';
import React from 'react';

export default function Dashboard() {
  // compute default period: today and 6 months ago (YYYY-MM-DD)
  const now = new Date();
  const sixMonthsAgo = new Date(
    now.getFullYear(),
    now.getMonth() - 6,
    now.getDate(),
  );
  const defaultFrom = formatDate(sixMonthsAgo, { formatStr: 'yyyy-MM-dd' });
  const defaultTo = formatDate(now, { formatStr: 'yyyy-MM-dd' });

  const [from, setFrom] = React.useState<string>(defaultFrom);
  const [to, setTo] = React.useState<string>(defaultTo);

  return (
    <>
      <div className="mb-4">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-semibold">ダッシュボード</h1>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-500">From</label>
            <input
              type="date"
              value={from}
              max={to}
              onChange={(e) => setFrom(e.target.value)}
              className="border rounded px-2 py-1"
            />
            <label className="text-sm text-gray-500">To</label>
            <input
              type="date"
              value={to}
              min={from}
              onChange={(e) => setTo(e.target.value)}
              className="border rounded px-2 py-1"
            />
          </div>
        </div>
      </div>

      {/* AI 要約パネル */}
      <DashboardSummary from={from} to={to} language="ja" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <OrderSection from={from} to={to} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RankPieClient from={from} to={to} />
        <MonthlyNewBarClient from={from} to={to} />
      </div>
    </>
  );
}
