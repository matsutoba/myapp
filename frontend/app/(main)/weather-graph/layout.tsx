'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FeatureTitleBar from '@/components/FeatureTitleBar';

const queryClient = new QueryClient();

export default function WeatherGraphLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col h-full">
        <FeatureTitleBar title="日本の天気" />
        <div className="flex-1 p-4 overflow-auto">{children}</div>
      </div>
    </QueryClientProvider>
  );
}
