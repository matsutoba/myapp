import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MyApp',
  description: 'MyApp',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
