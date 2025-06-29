import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { CurrencyProvider } from '@/components/currency-provider';
import { Navbar } from '@/components/navbar';
import { Toaster } from 'sonner';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'FinPocket - Professional Financial Calculators',
    template: '%s | FinPocket'
  },
  description: 'Professional financial calculators for SIP, lump sum investments, EMI calculations, CAGR analysis, XIRR calculations, currency conversion, and income tax calculation. Make informed financial decisions with accurate calculations and interactive charts.',
  keywords: ['SIP calculator', 'EMI calculator', 'lump sum calculator', 'CAGR calculator', 'XIRR calculator', 'currency converter', 'exchange rates', 'income tax calculator', 'tax calculator', 'financial planning', 'investment calculator', 'loan calculator', 'internal rate of return'],
  authors: [{ name: 'FinPocket' }],
  creator: 'FinPocket',
  publisher: 'FinPocket',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://finpocket.vercel.app',
    title: 'FinPocket - Professional Financial Calculators',
    description: 'Professional financial calculators for SIP, lump sum investments, EMI calculations, CAGR analysis, XIRR calculations, currency conversion, and income tax calculation.',
    siteName: 'FinPocket',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FinPocket - Professional Financial Calculators',
    description: 'Professional financial calculators for SIP, lump sum investments, EMI calculations, CAGR analysis, XIRR calculations, currency conversion, and income tax calculation.',
    creator: '@finpocket',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CurrencyProvider>
            <Navbar />
            {children}
            <Toaster position="top-right" richColors />
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}