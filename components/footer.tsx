import Link from 'next/link';
import { Calculator } from 'lucide-react';

const calculatorLinks = [
  { name: 'SIP', href: '/sip' },
  { name: 'Lump Sum', href: '/lumpsum' },
  { name: 'EMI', href: '/emi' },
  { name: 'CAGR', href: '/cagr' },
  { name: 'XIRR', href: '/xirr' },
  { name: 'Currency', href: '/currency-converter' },
  { name: 'Tax', href: '/tax-calculator' },
];

export function Footer() {
  return (
    <footer className="border-t bg-background mt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-5 h-5 text-primary" />
              <span className="text-lg font-bold text-foreground">FinPocket</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Professional financial calculators for smart investment and loan decisions.
              Free, private, and instant — everything runs in your browser.
            </p>
          </div>

          {/* Calculators */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Calculators</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-2">
              {calculatorLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Disclaimer</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Results are estimates for educational and planning purposes only and do not
              constitute financial advice. Tax rules and exchange rates may change without
              notice — verify with a qualified advisor before making financial decisions.
            </p>
          </div>
        </div>

        <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} FinPocket. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Exchange rates from the European Central Bank · Tax data for FY 2025-26
          </p>
        </div>
      </div>
    </footer>
  );
}
