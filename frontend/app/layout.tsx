import { ThemeProvider } from '../components/ui/theme/ThemeProvider';
import '../styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="flex flex-col h-screen">
        <ThemeProvider>
          {/* ThemeToggle uses useTheme, so must be inside ThemeProvider */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
