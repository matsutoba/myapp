import MonthlyNewBarClient from '@/features/dashboard/components/customers/MonthlyNewBarClient';
import RankPieClient from '@/features/dashboard/components/customers/RankPieClient';
import OrderSection from '@/features/dashboard/components/order';
import { formatDate } from '@/lib/date/formatDate';

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

  const periodLabel = `${formatDate(new Date(defaultFrom), {
    formatStr: 'yyyy/MM/dd',
  })} 〜 ${formatDate(new Date(defaultTo), { formatStr: 'yyyy/MM/dd' })}`;

  const effectiveFrom = defaultFrom;
  const effectiveTo = defaultTo;

  return (
    <>
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">ダッシュボード</h1>
        <div className="text-sm text-gray-600">
          集計期間:{' '}
          {periodLabel ||
            `${formatDate(new Date(effectiveFrom), {
              formatStr: 'yyyy/MM/dd',
            })} 〜 ${formatDate(new Date(effectiveTo), {
              formatStr: 'yyyy/MM/dd',
            })}`}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <OrderSection from={defaultFrom} to={defaultTo} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RankPieClient from={effectiveFrom} to={effectiveTo} />
        <MonthlyNewBarClient from={effectiveFrom} to={effectiveTo} />
      </div>
    </>
  );
}
