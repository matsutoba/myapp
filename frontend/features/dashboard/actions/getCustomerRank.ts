import { apiServer } from '@/lib/api/client';

export type RankRow = {
  rank: string;
  count: number;
};

/**
 * サーバーアクション: 顧客ランク別の構成比を取得
 * サーバー側でクッキーから認証情報を付与して API を呼びます
 */
export async function getCustomerRank(opts?: {
  from?: string;
  to?: string;
}): Promise<RankRow[]> {
  const qs = opts
    ? `?from=${encodeURIComponent(opts.from ?? '')}&to=${encodeURIComponent(
        opts.to ?? '',
      )}`
    : '';

  const res = await apiServer<RankRow[]>(
    `/api/dashboard/customers/by-rank${qs}`,
    {
      method: 'GET',
    },
  );
  if (!res.success) {
    throw new Error(res.error?.message || 'failed to fetch customer ranks');
  }
  return res.data ?? [];
}
