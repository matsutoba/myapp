'use server';

import { apiServer } from '@/lib/api/client';

// === 全体型定義 ===

export type DashboardDataWithoutSummary = Omit<
  {
    summary: string;
    analytics: {
      totalOrders: number;
      totalRevenue: number;
      avgOrderValue: number;
      timeseries: Array<{
        period: string;
        total: number;
        count: number;
        avg: number;
      }>;
      kpis: {
        totalOrders: number;
        totalRevenue: number;
        avgOrderValue: number;
      };
    };
    rankDistribution: Array<{
      rank: string;
      count: number;
    }>;
    monthlyNewCustomers: Array<{
      month: string;
      newCustomers: number;
    }>;
  },
  'summary'
>;

// === API レスポンス型 ===

type SummaryApiResponse = {
  summary: string;
};

type AnalyticsApiResponse = {
  kpis: {
    totalOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
  };
  timeseries: Array<{
    period: string;
    total: number;
    count: number;
    avg: number;
  }>;
};

type RankApiResponse = Array<{
  rank: string;
  count: number;
}>;

type MonthlyApiResponse = Array<{
  month: string;
  newCustomers: number;
}>;

// === ヘルパー関数 ===

/**
 * analytics データを DashboardDataWithoutSummary の analytics 形式に変換
 */
function transformAnalyticsData(
  data: AnalyticsApiResponse | undefined,
): DashboardDataWithoutSummary['analytics'] {
  if (!data) {
    return {
      totalOrders: 0,
      totalRevenue: 0,
      avgOrderValue: 0,
      timeseries: [],
      kpis: {
        totalOrders: 0,
        totalRevenue: 0,
        avgOrderValue: 0,
      },
    };
  }

  return {
    totalOrders: data.kpis?.totalOrders || 0,
    totalRevenue: data.kpis?.totalRevenue || 0,
    avgOrderValue: data.kpis?.avgOrderValue || 0,
    timeseries: data.timeseries || [],
    kpis: {
      totalOrders: data.kpis?.totalOrders || 0,
      totalRevenue: data.kpis?.totalRevenue || 0,
      avgOrderValue: data.kpis?.avgOrderValue || 0,
    },
  };
}

// === Server Actions ===

/**
 * Summary 以外のダッシュボードデータを取得（高速）
 * analytics, rankDistribution, monthlyNewCustomers を並列取得
 */
export async function getDashboardDataWithoutSummary(
  from: string,
  to: string,
): Promise<DashboardDataWithoutSummary | null> {
  try {
    const [analyticsRes, rankRes, monthlyRes] = await Promise.all([
      apiServer<AnalyticsApiResponse>(
        `/api/dashboard?group_by=day&from=${encodeURIComponent(
          from,
        )}&to=${encodeURIComponent(to)}`,
      ),
      apiServer<RankApiResponse>(
        `/api/dashboard/customers/by-rank?from=${encodeURIComponent(
          from,
        )}&to=${encodeURIComponent(to)}`,
      ),
      apiServer<MonthlyApiResponse>(
        `/api/dashboard/customers/new-signups?from=${encodeURIComponent(
          from,
        )}&to=${encodeURIComponent(to)}`,
      ),
    ]);

    if (!analyticsRes.success || !rankRes.success || !monthlyRes.success) {
      console.error('Failed to fetch dashboard data (without summary)');
      return null;
    }

    const analyticsData = analyticsRes.data as AnalyticsApiResponse | undefined;
    const rankData = rankRes.data as RankApiResponse | undefined;
    const monthlyData = monthlyRes.data as MonthlyApiResponse | undefined;

    return {
      analytics: transformAnalyticsData(analyticsData),
      rankDistribution: rankData || [],
      monthlyNewCustomers: monthlyData || [],
    };
  } catch (error) {
    console.error('Error fetching dashboard data (without summary):', error);
    return null;
  }
}

/**
 * Summary データを取得（低速 - AI 分析）
 */
export async function getDashboardSummary(
  from: string,
  to: string,
  language: string = 'ja',
): Promise<string> {
  try {
    const summaryRes = await apiServer<SummaryApiResponse>(
      `/api/dashboard/summary?from=${encodeURIComponent(
        from,
      )}&to=${encodeURIComponent(to)}&language=${encodeURIComponent(language)}`,
    );

    if (!summaryRes.success) {
      console.error('Failed to fetch summary');
      return '';
    }

    const summaryData = summaryRes.data as SummaryApiResponse | undefined;
    return summaryData?.summary || '';
  } catch (error) {
    console.error('Error fetching summary:', error);
    return '';
  }
}
