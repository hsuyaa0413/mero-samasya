import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Mero Samasya - Report Local Issues Easily & Transparently',
  description:
    'Mero Samasya is a citizen-driven local issue reporting platform that connects you with local authorities for faster and transparent resolution of problems like potholes, garbage delays, and more.',
  icons: {
    icon: './favicon.ico',
  },
  keywords: [
    'Mero Samasya',
    'Local Issue Reporting',
    'Nepal',
    'Civic Tech',
    'Garbage Problem',
    'Broken Roads',
    'Community Reporting',
    'Smart City',
    'Problem Solving App',
    'Citizen Platform',
  ],
  authors: [{ name: 'Mero Samasya Team' }],
  robots: 'index, follow',
  openGraph: {
    title: 'Mero Samasya - My Local Problem Solver',
    description:
      'Report local problems like broken roads or garbage collection delays with photos, GPS location, and real-time updates. Empowering citizens through technology.',
    url: 'https://mero-samasya.vercel.app',
    siteName: 'Mero Samasya',
    // images: [
    //   {
    //     url: 'https://yourdomain.com/og-image.png',
    //     width: 1200,
    //     height: 630,
    //     alt: 'Mero Samasya - Community Problem Reporting App',
    //   },
    // ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mero Samasya - My Local Problem Solver',
    description:
      'Connecting citizens with local authorities to solve community problems quickly and transparently.',
    images: ['https://yourdomain.com/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body
        className={cn(
          'font-sans antialiased mx-auto selection:text-darkBlue selection:bg-greyBlue',
          fontSans.variable
        )}
      >
        {children}
      </body>
    </html>
  );
}
