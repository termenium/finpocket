import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lump Sum Calculator',
  description:
    'Calculate the future value of a one-time investment with compound growth projections and inflation adjustment.',
};

export default function LumpSumLayout({ children }: { children: React.ReactNode }) {
  return children;
}
