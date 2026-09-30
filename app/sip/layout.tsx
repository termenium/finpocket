import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SIP Calculator',
  description:
    'Calculate the future value of your Systematic Investment Plan with interactive growth charts and inflation adjustment.',
};

export default function SIPLayout({ children }: { children: React.ReactNode }) {
  return children;
}
