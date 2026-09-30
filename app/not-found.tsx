import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calculator, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Calculator className="w-10 h-10 text-primary" />
          <span className="text-2xl font-bold text-foreground">FinPocket</span>
        </div>
        <p className="text-7xl sm:text-8xl font-bold text-primary mb-4">404</p>
        <h1 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">
          Page not found
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Head back to the calculators to keep crunching numbers.
        </p>
        <Link href="/">
          <Button size="lg" className="rounded-xl">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
