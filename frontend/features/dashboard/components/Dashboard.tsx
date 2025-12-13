'use client';

import {
  getDashboardDataWithoutSummary,
  getDashboardSummary,
  type DashboardDataWithoutSummary,
} from '@/features/dashboard/actions/getDashboardData';
import MonthlyNewBarClient from '@/features/dashboard/components/customers/MonthlyNewBarClient';
import RankPieClient from '@/features/dashboard/components/customers/RankPieClient';
import DashboardSummary from '@/features/dashboard/components/DashboardSummary';
import OrderSection from '@/features/dashboard/components/order';
import { formatDate } from '@/lib/date/formatDate';
import React, { useTransition } from 'react';

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
  const [data, setData] = React.useState<DashboardDataWithoutSummary | null>(
    null,
  );
  const [summary, setSummary] = React.useState<string>('');
  const [isPending, startTransition] = useTransition();
  const [isSummaryLoading, setIsSummaryLoading] = React.useState(false);

  // Summary データを非同期で取得
  const fetchSummary = async (fromDate: string, toDate: string) => {
    setIsSummaryLoading(true);
    try {
      const summaryData = await getDashboardSummary(fromDate, toDate, 'ja');
      setSummary(summaryData);
    } catch (error) {
      console.error('Error fetching summary:', error);
    } finally {
      setIsSummaryLoading(false);
    }
  };

  // 初回ロード：summary 以外を先に取得
  React.useEffect(() => {
    startTransition(async () => {
      const result = await getDashboardDataWithoutSummary(from, to);
      setData(result);
    });

    // summary は別途非同期で取得（ローディング中に他のデータを表示）
    void fetchSummary(from, to);
  }, []);

  // 日付変更時にデータ再取得
  const handleDateChange = (newFrom: string, newTo: string) => {
    setFrom(newFrom);
    setTo(newTo);

    // summary 以外のデータを先に取得
    startTransition(async () => {
      const result = await getDashboardDataWithoutSummary(newFrom, newTo);
      setData(result);
    });

    // summary は別途非同期で取得
    void fetchSummary(newFrom, newTo);
  };

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
              onChange={(e) => handleDateChange(e.target.value, to)}
              className="border rounded px-2 py-1"
              disabled={isPending || isSummaryLoading}
            />
            <label className="text-sm text-gray-500">To</label>
            <input
              type="date"
              value={to}
              min={from}
              onChange={(e) => handleDateChange(from, e.target.value)}
              className="border rounded px-2 py-1"
              disabled={isPending || isSummaryLoading}
            />
          </div>
        </div>
      </div>

      {/* AI 要約パネル */}
      {data && (
        <DashboardSummary summary={summary} isLoading={isSummaryLoading} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {data && <OrderSection data={data.analytics} />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {data && <RankPieClient data={data.rankDistribution} />}
        {data && <MonthlyNewBarClient data={data.monthlyNewCustomers} />}
      </div>
    </>
  );
}
