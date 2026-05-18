import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { AuthProvider } from '@/components/providers/auth-provider';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'AlphaPanel — Modern Hosting Control',
  description: 'Self-hosted hosting panel by AlphaPanel. No license. Full control.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans min-h-screen bg-background`}>
        <ThemeProvider>
          <AuthProvider>
            <div className="fixed inset-0 -z-10 bg-alpha-mesh pointer-events-none" />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
