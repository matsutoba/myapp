import { ThemeProvider } from '../components/ui/theme/ThemeProvider';
import { ErrorProvider } from '../lib/contexts/ErrorContext';
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
          <ErrorProvider>
            {/* ThemeToggle uses useTheme, so must be inside ThemeProvider */}
            {children}
          </ErrorProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
