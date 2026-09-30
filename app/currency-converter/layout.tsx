import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Currency Converter',
  description:
    'Convert currencies with real-time exchange rates and view historical trends from ECB reference data.',
};

export default function CurrencyConverterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
