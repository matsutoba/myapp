import { apiServer } from '@/lib/api/client';

export type RankRow = {
  rank: string;
  count: number;
};

/**
 * サーバーアクション: 顧客ランク別の構成比を取得
 * サーバー側でクッキーから認証情報を付与して API を呼びます
 */
export async function getCustomerRank(): Promise<RankRow[]> {
  const res = await apiServer<RankRow[]>('/api/dashboard/customers/by-rank', {
    method: 'GET',
  });
  if (!res.success) {
    throw new Error(res.error?.message || 'failed to fetch customer ranks');
  }
  return res.data ?? [];
}
