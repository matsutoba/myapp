import { ToastProvider } from '../components/ui';
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
            <ToastProvider>
              {/* ThemeToggle uses useTheme, so must be inside ThemeProvider */}
              {children}
            </ToastProvider>
          </ErrorProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
