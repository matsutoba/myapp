import type { User } from '@/features/auth/types';
import { cookies } from 'next/headers';
import GlobalMenu from '../../components/GlobalMenu';
import TitleBar from '../../components/TitleBar';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('user')?.value;
  let userName = 'Guest';

  if (userCookie) {
    try {
      const user: User = JSON.parse(userCookie);
      userName = user.name || user.email || 'User';
    } catch {
      // If parsing fails, use default
    }
  }

  return (
    <>
      <TitleBar user={userName} />
      <GlobalMenu />
      <main className="flex-1 overflow-auto">{children}</main>
    </>
  );
}
