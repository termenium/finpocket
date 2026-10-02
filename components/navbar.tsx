'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  TrendingUp,
  CreditCard,
  PiggyBank,
  Menu,
  LineChart,
  DollarSign,
  BarChart3,
  Receipt,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { CurrencySelector } from '@/components/currency-selector';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { DialogTitle } from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const navigation = [
  { name: 'SIP', href: '/sip', icon: TrendingUp },
  { name: 'Lump Sum', href: '/lumpsum', icon: PiggyBank },
  { name: 'EMI', href: '/emi', icon: CreditCard },
  { name: 'CAGR', href: '/cagr', icon: LineChart },
  { name: 'XIRR', href: '/xirr', icon: BarChart3 },
  { name: 'Currency', href: '/currency-converter', icon: DollarSign },
  { name: 'Tax', href: '/tax-calculator', icon: Receipt },
];

/** Wordmark: geometric chip + tracking-tight name */
function Wordmark() {
  return (
    <Link href="/" className="group flex items-center gap-2.5 shrink-0">
      <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-foreground text-background shadow-sm transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105">
        <span className="text-[15px] font-black leading-none">F</span>
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-muted-foreground ring-2 ring-background" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[17px] font-bold tracking-tight text-foreground">
          FinPocket
        </span>
        <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          Calculators
        </span>
      </span>
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full">
        <div className="container mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 pt-3">
          <div className="relative rounded-2xl border border-border/60 bg-background/70 shadow-lg shadow-black/[0.03] backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 dark:shadow-black/20">
            <div className="flex h-14 sm:h-16 items-center justify-between gap-3 px-3 sm:px-5">
              <Wordmark />

              {/* ---------- Desktop pill nav ---------- */}
              <nav
                aria-label="Primary"
                className="absolute left-1/2 hidden -translate-x-1/2 lg:block"
              >
                <div className="flex items-center gap-0.5 rounded-full border border-border/50 bg-muted/60 p-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                          'relative flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[13px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                          isActive
                            ? 'bg-background text-foreground shadow-sm ring-1 ring-border/60'
                            : 'text-muted-foreground hover:text-foreground hover:bg-background/60'
                        )}
                      >
                        <Icon
                          className={cn(
                            'h-3.5 w-3.5 shrink-0 transition-transform duration-200',
                            !isActive && 'group-hover:scale-110'
                          )}
                        />
                        <span className="whitespace-nowrap">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </nav>

              {/* ---------- Right controls ---------- */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Symbol-only chip on phones; expands to symbol + code on sm+ via CSS */}
                <CurrencySelector />

                <ThemeToggle />

                {/* Mobile menu trigger */}
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                  <SheetTrigger asChild className="lg:hidden">
                    <button
                      type="button"
                      aria-label="Open menu"
                      className="flex h-10 w-10 items-center justify-center rounded-xl border border-border/60 bg-background text-foreground transition-colors hover:bg-muted active:scale-95 lg:hidden"
                    >
                      <Menu className="h-4 w-4" />
                      <span className="sr-only">Open menu</span>
                    </button>
                  </SheetTrigger>

                  <SheetContent
                    side="top"
                    className="h-auto max-h-[85dvh] overflow-y-auto overscroll-contain rounded-b-3xl border-x-0 border-t-0 bg-background/95 backdrop-blur-xl p-0"
                  >
                    <DialogTitle className="sr-only">FinPocket navigation</DialogTitle>

                    <div className="px-5 pb-7 pt-5 sm:px-7">
                      {/* Sheet header */}
                      <div className="flex items-center justify-between border-b border-border/60 pb-4">
                        <SheetTitle asChild>
                          <div>
                            <Wordmark />
                          </div>
                        </SheetTitle>
                        <ThemeToggle />
                      </div>

                      {/* Grid of calculator links (2 cols) */}
                      <div className="mt-5 grid grid-cols-2 gap-2">
                        {navigation.map((item) => {
                          const Icon = item.icon;
                          const isActive = pathname === item.href;

                          return (
                            <Link
                              key={item.name}
                              href={item.href}
                              onClick={() => setIsOpen(false)}
                              className={cn(
                                'group flex items-center gap-3 rounded-xl border p-3.5 transition-colors active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                                isActive
                                  ? 'border-foreground/20 bg-muted shadow-sm'
                                  : 'border-border/50 bg-card hover:bg-muted/60'
                              )}
                            >
                              <span
                                className={cn(
                                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors',
                                  isActive
                                    ? 'bg-foreground text-background'
                                    : 'bg-muted text-foreground group-hover:bg-background'
                                )}
                              >
                                <Icon className="h-4 w-4" />
                              </span>
                              <span className="min-w-0">
                                <span className="block truncate text-sm font-semibold text-foreground">
                                  {item.name}
                                </span>
                                <span className="block text-[11px] text-muted-foreground">
                                  Open calculator
                                </span>
                              </span>
                              <ArrowUpRight className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                            </Link>
                          );
                        })}
                      </div>

                      {/* Sheet footer */}
                      <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
                        <span className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                          <Sparkles className="h-3 w-3" />
                          Free · Private · Instant
                        </span>
                        <Link
                          href="/"
                          onClick={() => setIsOpen(false)}
                          className="text-xs font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                        >
                          Home
                        </Link>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
