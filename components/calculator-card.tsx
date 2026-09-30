import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CalculatorCardProps } from '@/types/calculator';
import { memo } from 'react';

const CalculatorCard = memo(function CalculatorCard({ title, description, icon, href }: CalculatorCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
        <div className="mb-4 inline-flex w-fit rounded-xl bg-primary/10 p-2.5 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-1.5">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed flex-1">{description}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
          Open calculator
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
});

export { CalculatorCard };
