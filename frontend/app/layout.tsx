import GlobalMenu from '../components/GlobalMenu';
import TitleBar from '../components/TitleBar';
import '../styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="flex flex-col h-screen">
        <TitleBar user="username" />
        <GlobalMenu />
        <main className="flex-1 overflow-auto">{children}</main>
      </body>
    </html>
  );
}
