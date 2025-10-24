'use client';

export default function TitleBar({ user }: { user: string }) {
  return (
    <div className="h-8 bg-gray-800 text-white flex justify-between items-center px-3">
      <div className="font-bold">MyApp</div>
      <div>{user}</div>
    </div>
  );
}
