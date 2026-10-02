import Link from 'next/link';

const calculatorLinks = [
  { name: 'SIP Calculator', href: '/sip' },
  { name: 'Lump Sum', href: '/lumpsum' },
  { name: 'EMI Calculator', href: '/emi' },
  { name: 'CAGR', href: '/cagr' },
  { name: 'XIRR', href: '/xirr' },
  { name: 'Currency Converter', href: '/currency-converter' },
  { name: 'Tax Calculator', href: '/tax-calculator' },
];

export function Footer() {
  return (
    <footer className="border-t bg-background mt-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div className="max-w-xs">
            <Link
              href="/"
              className="group inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-foreground text-background shadow-sm transition-transform duration-300 group-hover:rotate-6">
                <span className="text-[15px] font-black leading-none">F</span>
                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-muted-foreground ring-2 ring-background" />
              </span>
              <span className="text-[17px] font-bold tracking-tight text-foreground">
                FinPocket
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              7 professional-grade calculators for investments, loans, taxes &amp;
              currencies. Free, private, and instant — everything runs in your browser.
            </p>
          </div>

          {/* Links */}
          <nav aria-label="Footer">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Calculators
            </p>
            <div className="grid grid-cols-2 gap-x-12 gap-y-2.5 sm:w-64">
              {calculatorLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-2 border-t pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground" suppressHydrationWarning>
            © {new Date().getFullYear()} FinPocket. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Estimates only, not financial advice · Rates: ECB · Tax: FY 2025-26
          </p>
        </div>
      </div>
    </footer>
  );
}
