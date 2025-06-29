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
    taxYear: '2024-25',
    incomeDescription: 'Annual gross salary including basic pay, allowances, and perquisites',
    taxSlabs: [
      { from: 0, to: 300000, rate: 0 },
      { from: 300000, to: 700000, rate: 5 },
      { from: 700000, to: 1000000, rate: 10 },
      { from: 1000000, to: 1200000, rate: 15 },
      { from: 1200000, to: 1500000, rate: 20 },
      { from: 1500000, to: Infinity, rate: 30 }
    ],
    deductions: [
      {
        key: 'section80C',
        name: 'Section 80C (PPF, ELSS, Life Insurance)',
        description: 'Investments in PPF, ELSS, life insurance premiums, etc.',
        maxLimit: 150000,
        defaultValue: 150000
      },
      {
        key: 'section80D',
        name: 'Section 80D (Health Insurance)',
        description: 'Health insurance premiums for self and family',
        maxLimit: 75000,
        defaultValue: 25000
      },
      {
        key: 'hra',
        name: 'HRA (House Rent Allowance)',
        description: 'House rent allowance exemption',
        defaultValue: 100000
      },
      {
        key: 'standardDeduction',
        name: 'Standard Deduction',
        description: 'Standard deduction for salaried individuals',
        maxLimit: 50000,
        defaultValue: 50000
      },
      {
        key: 'section80E',
        name: 'Section 80E (Education Loan Interest)',
        description: 'Interest paid on education loan',
        defaultValue: 0
      }
    ]
  },
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    currency: { code: 'USD', name: 'US Dollar', symbol: '$', locale: 'en-US' },
    taxYear: '2024',
    incomeDescription: 'Annual gross income including wages, salary, tips, and other compensation',
    taxSlabs: [
      { from: 0, to: 11000, rate: 10 },
      { from: 11000, to: 44725, rate: 12 },
      { from: 44725, to: 95375, rate: 22 },
      { from: 95375, to: 182050, rate: 24 },
      { from: 182050, to: 231250, rate: 32 },
      { from: 231250, to: 578125, rate: 35 },
      { from: 578125, to: Infinity, rate: 37 }
    ],
    deductions: [
      {
        key: 'standardDeduction',
        name: 'Standard Deduction (Single)',
        description: 'Standard deduction for single filers',
        maxLimit: 13850,
        defaultValue: 13850
      },
      {
        key: 'retirement401k',
        name: '401(k) Contributions',
        description: 'Pre-tax contributions to 401(k) retirement plan',
        maxLimit: 22500,
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
    taxYear: '2024-25',
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
        description: 'Tax-free personal allowance',
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
    taxYear: '2024',
    incomeDescription: 'Annual gross income including employment income and taxable benefits',
    taxSlabs: [
      { from: 0, to: 53359, rate: 15 },
      { from: 53359, to: 106717, rate: 20.5 },
      { from: 106717, to: 165430, rate: 26 },
      { from: 165430, to: 235675, rate: 29 },
      { from: 235675, to: Infinity, rate: 33 }
    ],
    deductions: [
      {
        key: 'basicPersonalAmount',
        name: 'Basic Personal Amount',
        description: 'Basic personal tax credit amount',
        maxLimit: 15000,
        defaultValue: 15000
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
    taxYear: '2024-25',
    incomeDescription: 'Annual gross income including salary, wages, and fringe benefits',
    taxSlabs: [
      { from: 0, to: 18200, rate: 0 },
      { from: 18200, to: 45000, rate: 19 },
      { from: 45000, to: 120000, rate: 32.5 },
      { from: 120000, to: 180000, rate: 37 },
      { from: 180000, to: Infinity, rate: 45 }
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
        maxLimit: 27500,
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