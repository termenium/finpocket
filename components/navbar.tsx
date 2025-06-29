'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calculator, TrendingUp, CreditCard, PiggyBank, Menu, X, LineChart, DollarSign, BarChart, Receipt } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { CurrencySelector } from '@/components/currency-selector';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DialogTitle } from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navigation = [
  { name: 'Home', href: '/', icon: Calculator },
  { name: 'SIP', href: '/sip', icon: TrendingUp },
  { name: 'Lump Sum', href: '/lumpsum', icon: PiggyBank },
  { name: 'EMI', href: '/emi', icon: CreditCard },
  { name: 'CAGR', href: '/cagr', icon: LineChart },
  { name: 'XIRR', href: '/xirr', icon: BarChart },
  { name: 'Currency', href: '/currency-converter', icon: DollarSign },
  { name: 'Tax', href: '/tax-calculator', icon: Receipt },
];

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8 pt-2 sm:pt-3">
        <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border border-border/40 rounded-xl shadow-sm">
          <div className="flex h-12 sm:h-14 lg:h-16 items-center justify-between px-3 sm:px-4 lg:px-6">
            {/* Logo Section */}
            <div className="flex items-center min-w-0">
              <Link href="/" className="flex items-center space-x-2 sm:space-x-3 shrink-0">
                <Calculator className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                <span className="text-base sm:text-lg lg:text-xl font-bold text-foreground truncate">
                  FinPocket
                </span>
              </Link>
            </div>
            
            {/* Desktop Navigation - Hidden on mobile/tablet */}
            <div className="hidden xl:flex items-center justify-center flex-1 px-8">
              <div className="flex items-center space-x-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  
                  return (
                    <Link key={item.name} href={item.href}>
                      <Button
                        variant={isActive ? 'secondary' : 'ghost'}
                        size="sm"
                        className={cn(
                          'flex items-center space-x-2 rounded-lg text-sm font-medium transition-all duration-200',
                          isActive && 'bg-secondary shadow-sm'
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="hidden 2xl:inline">{item.name}</span>
                      </Button>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right Section - Controls */}
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              {/* Currency Selector - Hidden on small mobile */}
              <div className="hidden xs:block">
                <CurrencySelector />
              </div>
              
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* Mobile/Tablet Navigation */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="xl:hidden">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-8 h-8 sm:w-9 sm:h-9 px-0 rounded-lg"
                  >
                    {isOpen ? (
                      <X className="h-4 w-4 sm:h-5 sm:w-5" />
                    ) : (
                      <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                    )}
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  side="right" 
                  className="w-[280px] sm:w-[320px] rounded-l-xl border-l"
                >
                  <DialogTitle className="sr-only">FinPocket Navigation</DialogTitle>
                  
                  {/* Mobile Header */}
                  <div className="flex flex-col space-y-6 mt-6">
                    <div className="flex items-center space-x-3 px-2">
                      <Calculator className="h-6 w-6 text-primary" />
                      <span className="text-xl font-bold">FinPocket</span>
                    </div>
                    
                    {/* Mobile Currency Selector - Show on small screens */}
                    <div className="xs:hidden px-2">
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="text-sm font-medium">Currency</span>
                        <CurrencySelector />
                      </div>
                    </div>
                    
                    {/* Navigation Links */}
                    <div className="border-t pt-4">
                      <div className="grid gap-1">
                        {navigation.map((item) => {
                          const Icon = item.icon;
                          const isActive = pathname === item.href;
                          
                          return (
                            <Link 
                              key={item.name} 
                              href={item.href} 
                              onClick={() => setIsOpen(false)}
                            >
                              <Button
                                variant={isActive ? 'secondary' : 'ghost'}
                                size="lg"
                                className={cn(
                                  'w-full justify-start space-x-3 h-12 rounded-lg font-medium transition-all duration-200',
                                  isActive && 'bg-secondary shadow-sm'
                                )}
                              >
                                <Icon className="h-5 w-5" />
                                <span className="text-base">{item.name}</span>
                              </Button>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                    
                    {/* Mobile Footer Info */}
                    <div className="border-t pt-4 px-2">
                      <div className="text-xs text-muted-foreground text-center">
                        Professional Financial Calculators
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}