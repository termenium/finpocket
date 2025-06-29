import { CalculatorCard } from '@/components/calculator-card';
import { Calculator, TrendingUp, CreditCard, PiggyBank, CheckCircle, BarChart3, Sparkles, ArrowRight, LineChart, DollarSign, BarChart, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const calculators = [
    {
      title: 'SIP Calculator',
      description: 'Calculate returns on your Systematic Investment Plan. Plan your monthly investments and see how they grow over time with compound interest.',
      icon: <TrendingUp className="w-5 h-5" />,
      href: '/sip'
    },
    {
      title: 'Lump Sum Calculator',
      description: 'Calculate future value of your one-time investment. See how your money grows with compound interest over your investment period.',
      icon: <PiggyBank className="w-5 h-5" />,
      href: '/lumpsum'
    },
    {
      title: 'EMI Calculator',
      description: 'Calculate your loan EMI, total interest payable, and get a detailed amortization schedule for better financial planning.',
      icon: <CreditCard className="w-5 h-5" />,
      href: '/emi'
    },
    {
      title: 'CAGR Calculator',
      description: 'Calculate the Compound Annual Growth Rate of your investments. Analyze performance and compare different investment options.',
      icon: <LineChart className="w-5 h-5" />,
      href: '/cagr'
    },
    {
      title: 'XIRR Calculator',
      description: 'Calculate Extended Internal Rate of Return for investments with irregular cash flows and dates. Perfect for complex investment analysis.',
      icon: <BarChart className="w-5 h-5" />,
      href: '/xirr'
    },
    {
      title: 'Currency Converter',
      description: 'Convert currencies with real-time exchange rates and view historical trends to make informed international financial decisions.',
      icon: <DollarSign className="w-5 h-5" />,
      href: '/currency-converter'
    },
    {
      title: 'Tax Calculator',
      description: 'Calculate income tax across multiple countries with accurate tax slabs, deductions, and exemptions for India, US, UK, Canada, and Australia.',
      icon: <Receipt className="w-5 h-5" />,
      href: '/tax-calculator'
    }
  ];

  const features = [
    {
      icon: <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />,
      title: 'Accurate Calculations',
      description: 'Built with proven financial formulas and validated against industry standards.'
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      title: 'Visual Insights',
      description: 'Interactive charts and graphs to help you visualize your financial growth.'
    },
    {
      icon: <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      title: 'Easy to Use',
      description: 'Clean, intuitive interface designed for both beginners and professionals.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 text-center max-w-7xl above-fold">
        <div className="mb-12 sm:mb-16 lg:mb-20">
          <div className="flex items-center justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Calculator className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground">FinPocket</h1>
          </div>
          <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl text-muted-foreground mb-8 sm:mb-10 max-w-5xl mx-auto leading-relaxed px-4">
            Professional financial calculators for smart investment and loan decisions. 
            Get accurate calculations with beautiful visualizations.
          </p>
          
          {/* Call to Action Button */}
          <div className="mb-10 sm:mb-12">
            <Link href="/sip" prefetch={false}>
              <Button 
                size="lg" 
                className="text-lg sm:text-xl px-8 sm:px-10 py-4 sm:py-5 h-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow-enhanced hover:shadow-xl transition-all duration-300 group rounded-2xl"
              >
                Explore Calculators
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm sm:text-base text-muted-foreground">
            <span className="flex items-center gap-2">
              ✓ Real-time calculations
            </span>
            <span className="flex items-center gap-2">
              ✓ Interactive charts
            </span>
            <span className="flex items-center gap-2">
              ✓ Mobile responsive
            </span>
          </div>
        </div>

        {/* Calculator Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-7 gap-6 sm:gap-8 lg:gap-10 mb-16 sm:mb-20 lazy-load">
          {calculators.map((calculator, index) => (
            <CalculatorCard key={calculator.href} {...calculator} />
          ))}
        </div>

        {/* Features Section */}
        <div className="bg-card rounded-2xl p-8 sm:p-10 shadow-enhanced border lazy-load">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 sm:mb-8">Why Choose FinPocket?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-left">
            {features.map((feature, index) => (
              <div key={feature.title} className="space-y-4">
                <div className="flex items-center gap-3">
                  {feature.icon}
                  <h3 className="font-semibold text-foreground text-base sm:text-lg">{feature.title}</h3>
                </div>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed pl-8">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}