import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EMI Calculator',
  description:
    'Calculate loan EMI, total interest, and view a detailed amortization schedule for smarter loan planning.',
};

export default function EMILayout({ children }: { children: React.ReactNode }) {
  return children;
}
