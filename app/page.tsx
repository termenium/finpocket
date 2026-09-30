import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Calculator,
  TrendingUp,
  CreditCard,
  PiggyBank,
  CheckCircle,
  BarChart3,
  Sparkles,
  ArrowRight,
  LineChart,
  DollarSign,
  BarChart,
  Receipt,
  Shield,
  Zap,
  Globe,
  Gauge,
} from 'lucide-react';
import { CalculatorCard } from '@/components/calculator-card';

const calculators = [
  {
    title: 'SIP Calculator',
    description:
      'Plan monthly investments and see exactly how they compound — with inflation-adjusted real values.',
    icon: <TrendingUp className="w-5 h-5" />,
    href: '/sip',
  },
  {
    title: 'Lump Sum Calculator',
    description:
      'Project the future value of a one-time investment with year-by-year growth visualization.',
    icon: <PiggyBank className="w-5 h-5" />,
    href: '/lumpsum',
  },
  {
    title: 'EMI Calculator',
    description:
      'Loan EMI, total interest, and a complete amortization schedule for smarter borrowing.',
    icon: <CreditCard className="w-5 h-5" />,
    href: '/emi',
  },
  {
    title: 'CAGR Calculator',
    description:
      'Measure true annualized growth and compare investments on an equal footing.',
    icon: <LineChart className="w-5 h-5" />,
    href: '/cagr',
  },
  {
    title: 'XIRR Calculator',
    description:
      'Precise returns for irregular cash flows and dates — powered by a dual-solver engine.',
    icon: <BarChart className="w-5 h-5" />,
    href: '/xirr',
  },
  {
    title: 'Currency Converter',
    description:
      'Live ECB reference rates with 30-day historical trends for informed decisions.',
    icon: <DollarSign className="w-5 h-5" />,
    href: '/currency-converter',
  },
  {
    title: 'Tax Calculator',
    description:
      'Current-year slabs and deductions for India, US, UK, Canada, and Australia.',
    icon: <Receipt className="w-5 h-5" />,
    href: '/tax-calculator',
  },
];

const features = [
  {
    icon: <Gauge className="w-5 h-5" />,
    title: 'Instant, live results',
    description:
      'Every slider and keystroke recalculates in real time. No submit buttons, no waiting — charts track your inputs as you drag.',
    className: 'sm:col-span-2',
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: 'Private by design',
    description:
      'All math runs in your browser. No accounts, no servers, no tracking of your numbers.',
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: 'Visual intelligence',
    description:
      'Growth curves, amortization breakdowns, and rate trends that make the numbers intuitive.',
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: 'Global from day one',
    description:
      '10 currencies with locale-aware formatting, real ECB exchange-rate history, and 5 countries of tax rules.',
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Export & share',
    description:
      'Copy results as text or save any calculation as a polished PNG or PDF in one click.',
    className: 'sm:col-span-2',
  },
];

const faqs = [
  {
    q: 'Is FinPocket really free?',
    a: 'Yes — every calculator is completely free with no sign-up, no paywalls, and no usage limits.',
  },
  {
    q: 'How accurate are the calculations?',
    a: 'We use standard financial formulas (compound interest, annuity-due EMI, XIRR via Newton-Raphson with a bisection fallback). Tax slabs are updated to FY 2025-26 / tax year 2025 as published by each country.',
  },
  {
    q: 'Where do exchange rates come from?',
    a: 'Live rates come from exchangerate-api.com with an automatic European Central Bank (Frankfurter) fallback. Historical trends use ECB daily reference rates.',
  },
  {
    q: 'Do you store my financial data?',
    a: 'No. Everything is computed locally in your browser. Nothing you type is ever sent to or stored on a server.',
  },
  {
    q: 'Is this financial advice?',
    a: 'No. Results are estimates for planning and education. Always verify with a qualified advisor before making financial decisions.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* ================= HERO ================= */}
      <section className="relative">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 lg:pt-28 pb-16 text-center">
          <Badge
            variant="outline"
            className="mb-6 rounded-full bg-muted px-4 py-1.5 text-sm text-foreground gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Free forever · No sign-up required
          </Badge>

          <h1 className="mx-auto max-w-4xl text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
            Financial clarity,{' '}
            <span className="text-muted-foreground">
              one calculation
            </span>{' '}
            away
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
            Seven professional-grade calculators for investments, loans, taxes, and
            currencies — with live results, beautiful charts, and real-world data.
            Everything runs privately in your browser.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/sip">
              <Button
                size="lg"
                className="text-base px-8 h-12 rounded-2xl font-semibold hover:-translate-y-0.5 transition-all duration-300"
              >
                Start calculating
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/tax-calculator">
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 h-12 rounded-2xl bg-background"
              >
                <Receipt className="w-4 h-4 mr-2" />
                Try the tax calculator
              </Button>
            </Link>
          </div>

          {/* Trust row */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {['No accounts', 'No tracking', '100% client-side'].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-primary" />
                {item}
              </span>
            ))}
          </div>

          {/* Stats band */}
          <div className="mx-auto mt-14 max-w-3xl grid grid-cols-2 sm:grid-cols-4 divide-x divide-border rounded-2xl border bg-card shadow-sm">
            {[
              { value: '7', label: 'Calculators' },
              { value: '5', label: 'Tax jurisdictions' },
              { value: '10', label: 'Currencies' },
              { value: '<1ms', label: 'Per calculation' },
            ].map((stat) => (
              <div key={stat.label} className="py-6 px-2">
                <p className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CALCULATORS ================= */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <Badge variant="outline" className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground mb-4">
            The toolkit
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Seven calculators, one workspace
          </h2>
          <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
            From your first SIP to cross-border tax planning — pick a tool and get an
            answer in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {/* Featured SIP card spanning 2 columns */}
          <div className="sm:col-span-2">
            <Link href="/sip" className="group block h-full">
              <div className="relative h-full overflow-hidden rounded-2xl border bg-foreground p-8 text-background shadow-sm transition-all duration-300 hover:-translate-y-1">
                <div className="relative">
                  <div className="mb-5 inline-flex rounded-xl bg-background text-foreground p-2.5">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <Badge variant="outline" className="mb-3 rounded-full border-background/30 text-background">
                    Most popular
                  </Badge>
                  <h3 className="text-2xl font-bold mb-2">SIP Calculator</h3>
                  <p className="leading-relaxed max-w-md mb-6 opacity-80">
                    Plan monthly investments and watch them compound — with real
                    purchasing-power values so you know what your money will actually be
                    worth.
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-semibold">
                    Open calculator
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {calculators.slice(1).map((calculator) => (
            <CalculatorCard key={calculator.href} {...calculator} />
          ))}
        </div>
      </section>

      {/* ================= FEATURES (bento) ================= */}
      <section className="border-y bg-muted/30">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center mb-12">
            <Badge variant="outline" className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground mb-4">
              Why FinPocket
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Built like a product, not a form
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className={`group rounded-2xl border bg-card p-6 sm:p-7 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${feature.className ?? ''}`}
              >
                <div className="mb-4 inline-flex rounded-xl bg-muted p-2.5 text-foreground transition-colors group-hover:bg-foreground group-hover:text-background">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1.5">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section className="container mx-auto max-w-3xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-10">
          <Badge variant="outline" className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground mb-4">
            FAQ
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Questions, answered
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-base sm:text-lg font-medium">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="rounded-3xl border bg-foreground px-6 py-14 sm:px-16 sm:py-20 text-center text-background">
          <div className="relative">
            <div className="mb-5 inline-flex rounded-2xl bg-background text-foreground p-3">
              <Calculator className="w-7 h-7" />
            </div>
            <h2 className="mx-auto max-w-2xl text-3xl sm:text-4xl font-bold tracking-tight">
              Your next financial decision deserves real numbers
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg opacity-75">
              Free, instant, and private. Pick a calculator and see the difference in
              under a minute.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/sip">
                <Button size="lg" variant="secondary" className="text-base px-8 rounded-2xl font-semibold">
                  Start calculating
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/currency-converter">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-base px-8 rounded-2xl border-background/30 bg-transparent text-background hover:bg-background/10 hover:text-background"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Convert a currency
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
