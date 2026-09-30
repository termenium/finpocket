import { Currency } from '@/components/currency-provider';

export interface TaxSlab {
  from: number;
  to: number;
  rate: number;
}

export interface TaxDeduction {
  key: string;
  name: string;
  description?: string;
  maxLimit?: number;
  defaultValue?: number;
}

export interface TaxCountry {
  code: string;
  name: string;
  flag: string;
  currency: Currency;
  taxYear: string;
  incomeDescription: string;
  taxSlabs: TaxSlab[];
  deductions: TaxDeduction[];
}

export interface TaxBreakdown {
  from: number;
  to: number;
  rate: number;
  taxableAmount: number;
  taxOnSlab: number;
}

export interface TaxCalculation {
  grossIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  totalTax: number;
  netIncome: number;
  effectiveTaxRate: number;
  deductionsUsed: Record<string, number>;
  taxBreakdown: TaxBreakdown[];
}

export const TAX_COUNTRIES: TaxCountry[] = [
  {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    currency: { code: 'INR', name: 'Indian Rupee', symbol: '₹', locale: 'en-IN' },
    taxYear: '2025-26',
    incomeDescription: 'Annual gross salary including basic pay, allowances, and perquisites',
    taxSlabs: [
      { from: 0, to: 400000, rate: 0 },
      { from: 400000, to: 800000, rate: 5 },
      { from: 800000, to: 1200000, rate: 10 },
      { from: 1200000, to: 1600000, rate: 15 },
      { from: 1600000, to: 2000000, rate: 20 },
      { from: 2000000, to: 2400000, rate: 25 },
      { from: 2400000, to: Infinity, rate: 30 }
    ],
    deductions: [
      {
        key: 'standardDeduction',
        name: 'Standard Deduction',
        description: 'Standard deduction for salaried individuals (new regime)',
        maxLimit: 75000,
        defaultValue: 75000
      },
      {
        key: 'employerNPS',
        name: 'Employer NPS Contribution (Sec 80CCD(2))',
        description: 'Employer contribution to NPS (14% of salary under new regime)',
        defaultValue: 0
      },
      {
        key: 'section80JJAA',
        name: 'New Employment Incentive (Sec 80JJAA)',
        description: 'Deduction for hiring new employees (30% of wages, 3 years)',
        defaultValue: 0
      }
    ]
  },
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    currency: { code: 'USD', name: 'US Dollar', symbol: '$', locale: 'en-US' },
    taxYear: '2025',
    incomeDescription: 'Annual gross income including wages, salary, tips, and other compensation',
    taxSlabs: [
      { from: 0, to: 11925, rate: 10 },
      { from: 11925, to: 48475, rate: 12 },
      { from: 48475, to: 103350, rate: 22 },
      { from: 103350, to: 197300, rate: 24 },
      { from: 197300, to: 250525, rate: 32 },
      { from: 250525, to: 626350, rate: 35 },
      { from: 626350, to: Infinity, rate: 37 }
    ],
    deductions: [
      {
        key: 'standardDeduction',
        name: 'Standard Deduction (Single)',
        description: 'Standard deduction for single filers',
        maxLimit: 15000,
        defaultValue: 15000
      },
      {
        key: 'retirement401k',
        name: '401(k) Contributions',
        description: 'Pre-tax contributions to 401(k) retirement plan',
        maxLimit: 23500,
        defaultValue: 10000
      },
      {
        key: 'healthInsurance',
        name: 'Health Insurance Premiums',
        description: 'Pre-tax health insurance premiums',
        defaultValue: 3000
      },
      {
        key: 'studentLoanInterest',
        name: 'Student Loan Interest',
        description: 'Interest paid on qualified student loans',
        maxLimit: 2500,
        defaultValue: 0
      }
    ]
  },
  {
    code: 'UK',
    name: 'United Kingdom',
    flag: '🇬🇧',
    currency: { code: 'GBP', name: 'British Pound', symbol: '£', locale: 'en-GB' },
    taxYear: '2025-26',
    incomeDescription: 'Annual gross income including salary, wages, and taxable benefits',
    taxSlabs: [
      { from: 0, to: 12570, rate: 0 },
      { from: 12570, to: 50270, rate: 20 },
      { from: 50270, to: 125140, rate: 40 },
      { from: 125140, to: Infinity, rate: 45 }
    ],
    deductions: [
      {
        key: 'personalAllowance',
        name: 'Personal Allowance',
        description: 'Tax-free personal allowance (frozen at £12,570)',
        maxLimit: 12570,
        defaultValue: 12570
      },
      {
        key: 'pensionContributions',
        name: 'Pension Contributions',
        description: 'Contributions to registered pension schemes',
        defaultValue: 5000
      },
      {
        key: 'nationalInsurance',
        name: 'National Insurance',
        description: 'National Insurance contributions (calculated separately)',
        defaultValue: 0
      }
    ]
  },
  {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    currency: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', locale: 'en-CA' },
    taxYear: '2025',
    incomeDescription: 'Annual gross income including employment income and taxable benefits',
    taxSlabs: [
      { from: 0, to: 57375, rate: 15 },
      { from: 57375, to: 114750, rate: 20.5 },
      { from: 114750, to: 177882, rate: 26 },
      { from: 177882, to: 253414, rate: 29 },
      { from: 253414, to: Infinity, rate: 33 }
    ],
    deductions: [
      {
        key: 'basicPersonalAmount',
        name: 'Basic Personal Amount',
        description: 'Basic personal tax credit amount (2025 federal)',
        maxLimit: 16129,
        defaultValue: 16129
      },
      {
        key: 'rrspContributions',
        name: 'RRSP Contributions',
        description: 'Registered Retirement Savings Plan contributions',
        defaultValue: 8000
      },
      {
        key: 'employmentExpenses',
        name: 'Employment Expenses',
        description: 'Deductible employment-related expenses',
        defaultValue: 2000
      }
    ]
  },
  {
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    currency: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', locale: 'en-AU' },
    taxYear: '2025-26',
    incomeDescription: 'Annual gross income including salary, wages, and fringe benefits',
    taxSlabs: [
      { from: 0, to: 18200, rate: 0 },
      { from: 18200, to: 45000, rate: 16 },
      { from: 45000, to: 135000, rate: 30 },
      { from: 135000, to: 190000, rate: 37 },
      { from: 190000, to: Infinity, rate: 45 }
    ],
    deductions: [
      {
        key: 'taxFreeThreshold',
        name: 'Tax-Free Threshold',
        description: 'Tax-free threshold for residents',
        maxLimit: 18200,
        defaultValue: 18200
      },
      {
        key: 'superContributions',
        name: 'Superannuation Contributions',
        description: 'Concessional superannuation contributions',
        maxLimit: 30000,
        defaultValue: 10000
      },
      {
        key: 'workRelatedExpenses',
        name: 'Work-Related Expenses',
        description: 'Deductible work-related expenses',
        defaultValue: 3000
      }
    ]
  }
];

export function calculateIncomeTax(
  country: TaxCountry,
  grossIncome: number,
  deductions: Record<string, number>
): TaxCalculation {
  // Calculate total deductions
  const deductionsUsed: Record<string, number> = {};
  let totalDeductions = 0;

  country.deductions.forEach(deduction => {
    const claimedAmount = deductions[deduction.key] || 0;
    const allowedAmount = deduction.maxLimit 
      ? Math.min(claimedAmount, deduction.maxLimit)
      : claimedAmount;
    
    deductionsUsed[deduction.key] = allowedAmount;
    totalDeductions += allowedAmount;
  });

  // Calculate taxable income
  const taxableIncome = Math.max(0, grossIncome - totalDeductions);

  // Calculate tax using slabs
  const taxBreakdown: TaxBreakdown[] = [];
  let totalTax = 0;

  country.taxSlabs.forEach(slab => {
    const slabStart = slab.from;
    const slabEnd = slab.to === Infinity ? taxableIncome : Math.min(slab.to, taxableIncome);
    
    if (taxableIncome > slabStart) {
      const taxableAmountInSlab = Math.max(0, slabEnd - slabStart);
      const taxOnSlab = (taxableAmountInSlab * slab.rate) / 100;
      
      taxBreakdown.push({
        from: slab.from,
        to: slab.to,
        rate: slab.rate,
        taxableAmount: taxableAmountInSlab,
        taxOnSlab
      });
      
      totalTax += taxOnSlab;
    } else {
      taxBreakdown.push({
        from: slab.from,
        to: slab.to,
        rate: slab.rate,
        taxableAmount: 0,
        taxOnSlab: 0
      });
    }
  });

  // Calculate net income and effective tax rate
  const netIncome = grossIncome - totalTax;
  const effectiveTaxRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;

  return {
    grossIncome,
    totalDeductions,
    taxableIncome,
    totalTax,
    netIncome,
    effectiveTaxRate,
    deductionsUsed,
    taxBreakdown
  };
}

export function formatCurrency(amount: number, currency: Currency): string {
  try {
    return new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch (error) {
    // Fallback for unsupported locales
    return `${currency.symbol}${new Intl.NumberFormat('en-US').format(Math.round(amount))}`;
  }
}