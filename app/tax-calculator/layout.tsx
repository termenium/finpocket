import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Income Tax Calculator',
  description:
    'Calculate income tax across multiple countries with accurate tax slabs, deductions, and exemptions.',
};

export default function TaxCalculatorLayout({ children }: { children: React.ReactNode }) {
  return children;
}
