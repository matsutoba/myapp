'use client';

export default function FeatureTitleBar({ title }: { title: string }) {
  return (
    <div className="h-10 bg-gray-200 flex items-center px-4 font-semibold">
      {title}
    </div>
  );
}
