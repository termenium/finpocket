import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { CalculatorCardProps } from '@/types/calculator';
import { memo } from 'react';

const CalculatorCard = memo(function CalculatorCard({ title, description, icon, href }: CalculatorCardProps) {
  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border bg-gradient-to-br from-card to-muted/20 h-full flex flex-col rounded-2xl">
      <CardHeader className="pb-3 sm:pb-4 flex-1">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
          <div className="p-1.5 sm:p-2 rounded-xl bg-primary text-primary-foreground group-hover:bg-primary/90 transition-colors">
            {icon}
          </div>
          <CardTitle className="text-lg sm:text-xl font-semibold leading-tight">{title}</CardTitle>
        </div>
        <CardDescription className="text-muted-foreground leading-relaxed text-sm sm:text-base">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-4 sm:pb-6">
        <Link href={href} prefetch={false}>
          <Button 
            className="w-full group-hover:bg-primary/90 transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base rounded-xl"
            size="lg"
          >
            Calculate Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
});

export { CalculatorCard };