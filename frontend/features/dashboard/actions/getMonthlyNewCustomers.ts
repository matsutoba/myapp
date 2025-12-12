import { apiServer } from '@/lib/api/client';

export type MonthlyRow = {
  month: string; // YYYY-MM
  newCustomers: number;
};

/**
 * サーバーアクション: 月次の新規顧客数を取得
 * opts は省略可能（from/to を YYYY-MM-DD で渡せます）
 */
export async function getMonthlyNewCustomers(opts?: {
  from?: string;
  to?: string;
}) {
  const qs = opts
    ? `?from=${encodeURIComponent(opts.from ?? '')}&to=${encodeURIComponent(
        opts.to ?? '',
      )}`
    : '';

  const res = await apiServer<MonthlyRow[]>(
    `/api/dashboard/customers/new-signups${qs}`,
    { method: 'GET' },
  );
  if (!res.success) {
    throw new Error(
      res.error?.message || 'failed to fetch monthly new customers',
    );
  }
  return res.data ?? [];
}
