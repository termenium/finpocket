import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'XIRR Calculator',
  description:
    'Calculate Extended Internal Rate of Return for investments with irregular cash flows and dates.',
};

export default function XIRRLayout({ children }: { children: React.ReactNode }) {
  return children;
}
