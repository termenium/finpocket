import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { CurrencyProvider } from '@/components/currency-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Toaster } from 'sonner';

const geistSans = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist-mono',
});

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument',
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
  metadataBase: new URL('https://finpocket.vercel.app'),
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
};

// Next 14+: viewport config must be a separate export, not part of metadata
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  colorScheme: 'dark light',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" href="/favicon.ico" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <CurrencyProvider>
            <div className="flex min-h-screen flex-col">
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-background focus:shadow-lg"
              >
                Skip to main content
              </a>
              <Navbar />
              <main id="main-content" className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster position="top-right" richColors />
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}