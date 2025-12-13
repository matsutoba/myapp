'use client';

import { apiClient } from '@/lib/api/client';
import { useCallback, useEffect, useState } from 'react';

type DashboardSummaryResponse = {
  summary: string;
};

type DashboardSummaryProps = {
  from: string;
  to: string;
  language?: string;
};

export default function DashboardSummary({
  from,
  to,
  language = 'ja',
}: DashboardSummaryProps) {
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // AI要約を取得
  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        from,
        to,
        language,
      });

      const result = await apiClient<DashboardSummaryResponse>(
        `/api/dashboard/summary?${params.toString()}`,
      );

      if (!result.success || !result.data) {
        setError(result.error?.message || 'Failed to fetch summary');
        setSummary('');
        return;
      }

      setSummary(result.data.summary || '');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(`Failed to fetch summary: ${message}`);
      setSummary('');
    } finally {
      setLoading(false);
    }
  }, [from, to, language]);

  // 期間が変わったら要約を再取得
  useEffect(() => {
    fetchSummary();
  }, [from, to, language, fetchSummary]);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-6">
      <div className="flex items-start gap-4">
        {/* アイコン */}
        <div className="flex-shrink-0">
          <svg
            className="w-6 h-6 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>

        {/* コンテンツ */}
        <div className="flex-grow">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            📊 ダッシュボード分析要約
          </h2>

          {loading ? (
            <div className="flex items-center gap-2 text-gray-600">
              <svg
                className="animate-spin h-4 w-4 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="text-sm">AI が分析中...</span>
            </div>
          ) : error ? (
            <div className="text-red-700 text-sm bg-red-50 p-3 rounded border border-red-200">
              {error}
            </div>
          ) : summary ? (
            <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap">
              {summary}
            </p>
          ) : (
            <p className="text-gray-500 text-sm italic">
              要約データはありません
            </p>
          )}

          {/* 更新ボタン */}
          {!loading && (
            <button
              onClick={fetchSummary}
              className="mt-3 text-xs text-blue-600 hover:text-blue-800 underline"
            >
              🔄 再取得
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
