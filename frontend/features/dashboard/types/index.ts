/**
 * Dashboard API response types
 * Mirrors backend DTO structure: github.com/matsubara/myapp/internal/dashboard/dto
 */

export interface KPIs {
  totalOrders: number;
  totalRevenue: number;
  avgOrderValue: number;
}

export interface OrderAggregateRow {
  period: string;
  total: number;
  count: number;
  avg: number;
}

export interface DashboardResponse {
  kpis: KPIs;
  timeseries: OrderAggregateRow[];
  from?: string;
  to?: string;
  generatedAt: string;
  cached: boolean;
}

export interface RankCount {
  rank: string;
  count: number;
}

export interface MonthlyNew {
  month: string;
  newCustomers: number;
}
