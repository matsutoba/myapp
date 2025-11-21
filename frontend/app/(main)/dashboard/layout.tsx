import { FeatureTitleBar } from '@/components/ui';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-full">
      <FeatureTitleBar title="ダッシュボード" />
      <div className="flex-1 p-4 overflow-auto">{children}</div>
    </div>
  );
}
