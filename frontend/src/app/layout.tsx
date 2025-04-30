import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { NavBar } from '@/components/NavBar';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Mero Samasya',
  description: 'Report and resolve local issues',
  icons: {
    icon: './favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'font-sans antialiased mx-auto selection:text-darkBlue selection:bg-greyBlue',
          fontSans.variable
        )}
      >
        <NavBar />
        {children}
      </body>
    </html>
  );
}
