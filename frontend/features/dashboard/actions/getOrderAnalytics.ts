import { apiServer } from '@/lib/api/client';

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export type GetOrderAnalyticsOptions = {
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
  groupBy?: 'day' | 'week' | 'month';
};

export type OrderAggregateRow = {
  period: string; // e.g. '2023-11-01'
  total: number; // revenue sum
  count: number; // orders count
  avg?: number; // average order value
};

export type DashboardKPIs = {
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue?: number;
};

export type OrderAnalyticsResponse = {
  kpis?: DashboardKPIs;
  timeseries?: OrderAggregateRow[];
  generatedAt?: string;
  cached?: boolean;
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
};

/**
 * サーバーアクション: 注文分析情報を取得して返す
 * デフォルト: `to` = today, `from` = 6ヶ月前, `group_by` = day
 */
export async function getOrderAnalytics(
  opts?: GetOrderAnalyticsOptions,
): Promise<OrderAnalyticsResponse> {
  const now = new Date();
  const to = opts?.to ?? formatDate(now);

  const past = new Date(now);
  past.setMonth(past.getMonth() - 12);
  const from = opts?.from ?? formatDate(past);

  const groupBy = opts?.groupBy ?? 'day';

  const qs = `?group_by=${encodeURIComponent(
    groupBy,
  )}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;

  const res = await apiServer(`/api/dashboard${qs}`, { method: 'GET' });
  if (!res.success) {
    throw new Error(res.error?.message || 'failed to fetch dashboard');
  }
  return res.data as OrderAnalyticsResponse;
}
