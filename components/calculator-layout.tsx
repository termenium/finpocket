'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';

interface CalculatorLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function CalculatorLayout({ title, description, children }: CalculatorLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Link href="/">
            <Button variant="outline" size="sm" className="flex items-center gap-2 w-fit rounded-xl">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </Link>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Home className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>/</span>
            <span>{title}</span>
          </div>
        </div>
        
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-3 sm:mb-4">{title}</h1>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
            {description}
          </p>
        </div>

        {children}
      </div>
    </div>
  );
}