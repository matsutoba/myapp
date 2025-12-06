'use client';

type Props = {
  title: string;
  value: string;
};

export default function KpiCard({ title, value }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}
