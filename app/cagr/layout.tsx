import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CAGR Calculator',
  description:
    'Calculate the Compound Annual Growth Rate of your investments and analyze performance over time.',
};

export default function CAGRLayout({ children }: { children: React.ReactNode }) {
  return children;
}
