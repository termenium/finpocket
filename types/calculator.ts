export interface SIPCalculation {
  monthlyInvestment: number;
  annualReturn: number;
  years: number;
  totalInvested: number;
  expectedReturns: number;
  maturityValue: number;
  inflationRate?: number;
  realTotalInvested?: number;
  realExpectedReturns?: number;
  realMaturityValue?: number;
  monthlyData: Array<{
    month: number;
    invested: number;
    value: number;
    realValue?: number;
  }>;
}

export interface LumpSumCalculation {
  principal: number;
  annualReturn: number;
  years: number;
  maturityValue: number;
  totalReturns: number;
  inflationRate?: number;
  realPrincipal?: number;
  realMaturityValue?: number;
  realTotalReturns?: number;
  yearlyData: Array<{
    year: number;
    value: number;
    realValue?: number;
  }>;
}

export interface EMICalculation {
  loanAmount: number;
  interestRate: number;
  tenure: number;
  emi: number;
  totalPayable: number;
  totalInterest: number;
  inflationRate?: number;
  realEMI?: number;
  realTotalPayable?: number;
  breakdown: Array<{
    month: number;
    emi: number;
    principal: number;
    interest: number;
    balance: number;
    realEMI?: number;
    realBalance?: number;
  }>;
}

export interface CAGRCalculation {
  initialValue: number;
  finalValue: number;
  years: number;
  cagr: number;
  totalGrowthPercent: number;
  absoluteReturns: number;
  inflationRate?: number;
  realCAGR?: number;
  realFinalValue?: number;
  yearlyProjection: Array<{
    year: number;
    value: number;
    realValue?: number;
    annualReturns: number;
  }>;
}

export interface CashFlow {
  id: string;
  date: string;
  amount: number;
  description?: string;
}

export interface XIRRCalculation {
  cashFlows: CashFlow[];
  xirr: number;
  totalInvested: number;
  totalReturned: number;
  netGain: number;
  netGainPercent: number;
  duration: number; // in years
  annualizedReturn: number;
  cumulativeData: Array<{
    date: string;
    cumulativeInvestment: number;
    cumulativeReturns: number;
    netPosition: number;
  }>;
}

export interface TaxCalculation {
  grossIncome: number;
  totalDeductions: number;
  taxableIncome: number;
  totalTax: number;
  netIncome: number;
  effectiveTaxRate: number;
  deductionsUsed: Record<string, number>;
  taxBreakdown: Array<{
    from: number;
    to: number;
    rate: number;
    taxableAmount: number;
    taxOnSlab: number;
  }>;
}

export interface CalculatorCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}