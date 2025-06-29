import { Currency } from '@/components/currency-provider';
import { CashFlow, XIRRCalculation } from '@/types/calculator';

// Memoization cache for expensive calculations
const calculationCache = new Map<string, any>();

function getCacheKey(type: string, params: any[]): string {
  return `${type}-${JSON.stringify(params)}`;
}

export function calculateSIP(
  monthlyInvestment: number,
  annualReturn: number,
  years: number,
  inflationRate?: number
) {
  const cacheKey = getCacheKey('sip', [monthlyInvestment, annualReturn, years, inflationRate]);
  
  if (calculationCache.has(cacheKey)) {
    return calculationCache.get(cacheKey);
  }

  const monthlyRate = annualReturn / 100 / 12;
  const totalMonths = years * 12;
  
  // SIP formula: M * [((1 + r)^n - 1) / r] * (1 + r)
  const maturityValue = monthlyInvestment * 
    (((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * 
    (1 + monthlyRate));
  
  const totalInvested = monthlyInvestment * totalMonths;
  const expectedReturns = maturityValue - totalInvested;
  
  // Calculate inflation-adjusted values if inflation rate is provided
  let realTotalInvested, realExpectedReturns, realMaturityValue;
  let realMonthlyRate;
  
  if (inflationRate !== undefined && inflationRate > 0) {
    // Real rate of return = (1 + nominal rate) / (1 + inflation rate) - 1
    const nominalRate = annualReturn / 100;
    const inflationRateDecimal = inflationRate / 100;
    const realRate = (1 + nominalRate) / (1 + inflationRateDecimal) - 1;
    realMonthlyRate = realRate / 12;
    
    // Calculate real maturity value using real rate
    const realMaturityValueCalc = monthlyInvestment * 
      (((Math.pow(1 + realMonthlyRate, totalMonths) - 1) / realMonthlyRate) * 
      (1 + realMonthlyRate));
    
    // Present value of total invested (considering inflation)
    realTotalInvested = totalInvested / Math.pow(1 + inflationRateDecimal, years);
    realMaturityValue = realMaturityValueCalc;
    realExpectedReturns = realMaturityValue - totalInvested;
  }
  
  // Generate monthly data for chart (optimized - show fewer points for performance)
  const monthlyData = [];
  let runningInvested = 0;
  let runningValue = 0;
  let runningRealValue = 0;
  
  const stepSize = Math.max(1, Math.floor(totalMonths / 50)); // Limit to ~50 data points
  
  for (let month = 1; month <= totalMonths; month += stepSize) {
    runningInvested = monthlyInvestment * month;
    runningValue = monthlyInvestment * 
      (((Math.pow(1 + monthlyRate, month) - 1) / monthlyRate) * 
      (1 + monthlyRate));
    
    // Calculate real value if inflation is considered
    if (inflationRate !== undefined && inflationRate > 0 && realMonthlyRate !== undefined) {
      runningRealValue = monthlyInvestment * 
        (((Math.pow(1 + realMonthlyRate, month) - 1) / realMonthlyRate) * 
        (1 + realMonthlyRate));
    }
    
    monthlyData.push({
      month,
      invested: runningInvested,
      value: runningValue,
      realValue: inflationRate !== undefined && inflationRate > 0 ? runningRealValue : undefined
    });
  }

  const result = {
    monthlyInvestment,
    annualReturn,
    years,
    totalInvested,
    expectedReturns,
    maturityValue,
    inflationRate,
    realTotalInvested,
    realExpectedReturns,
    realMaturityValue,
    monthlyData
  };

  calculationCache.set(cacheKey, result);
  return result;
}

export function calculateLumpSum(
  principal: number,
  annualReturn: number,
  years: number,
  inflationRate?: number
) {
  const cacheKey = getCacheKey('lumpsum', [principal, annualReturn, years, inflationRate]);
  
  if (calculationCache.has(cacheKey)) {
    return calculationCache.get(cacheKey);
  }

  const rate = annualReturn / 100;
  const maturityValue = principal * Math.pow(1 + rate, years);
  const totalReturns = maturityValue - principal;
  
  // Calculate inflation-adjusted values if inflation rate is provided
  let realPrincipal, realMaturityValue, realTotalReturns;
  let realRate;
  
  if (inflationRate !== undefined && inflationRate > 0) {
    // Real rate of return = (1 + nominal rate) / (1 + inflation rate) - 1
    const inflationRateDecimal = inflationRate / 100;
    realRate = (1 + rate) / (1 + inflationRateDecimal) - 1;
    
    realPrincipal = principal;
    realMaturityValue = principal * Math.pow(1 + realRate, years);
    realTotalReturns = realMaturityValue - principal;
  }
  
  // Generate yearly data for chart
  const yearlyData = [];
  for (let year = 0; year <= years; year++) {
    const nominalValue = principal * Math.pow(1 + rate, year);
    const realValue = inflationRate !== undefined && inflationRate > 0 && realRate !== undefined
      ? principal * Math.pow(1 + realRate, year)
      : undefined;
    
    yearlyData.push({
      year,
      value: nominalValue,
      realValue
    });
  }

  const result = {
    principal,
    annualReturn,
    years,
    maturityValue,
    totalReturns,
    inflationRate,
    realPrincipal,
    realMaturityValue,
    realTotalReturns,
    yearlyData
  };

  calculationCache.set(cacheKey, result);
  return result;
}

export function calculateEMI(
  loanAmount: number,
  interestRate: number,
  tenure: number,
  inflationRate?: number
) {
  const cacheKey = getCacheKey('emi', [loanAmount, interestRate, tenure, inflationRate]);
  
  if (calculationCache.has(cacheKey)) {
    return calculationCache.get(cacheKey);
  }

  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = tenure * 12;
  
  // EMI formula: P * r * (1 + r)^n / ((1 + r)^n - 1)
  const emi = loanAmount * monthlyRate * 
    Math.pow(1 + monthlyRate, totalMonths) / 
    (Math.pow(1 + monthlyRate, totalMonths) - 1);
  
  const totalPayable = emi * totalMonths;
  const totalInterest = totalPayable - loanAmount;
  
  // Calculate inflation-adjusted values if inflation rate is provided
  let realEMI, realTotalPayable;
  const monthlyInflationRate = inflationRate !== undefined && inflationRate > 0 
    ? inflationRate / 100 / 12 
    : 0;
  
  if (inflationRate !== undefined && inflationRate > 0) {
    // Real EMI in today's purchasing power at the end of loan tenure
    realEMI = emi / Math.pow(1 + inflationRate / 100, tenure);
    realTotalPayable = totalPayable / Math.pow(1 + inflationRate / 100, tenure);
  }
  
  // Generate amortization schedule (limit to first 5 years for performance)
  const breakdown = [];
  let balance = loanAmount;
  const maxMonths = Math.min(totalMonths, 60); // Show first 5 years
  
  for (let month = 1; month <= maxMonths; month++) {
    const interestComponent = balance * monthlyRate;
    const principalComponent = emi - interestComponent;
    balance -= principalComponent;
    
    // Calculate real values for this month
    const realEMIMonth = inflationRate !== undefined && inflationRate > 0
      ? emi / Math.pow(1 + monthlyInflationRate, month)
      : undefined;
    const realBalanceMonth = inflationRate !== undefined && inflationRate > 0
      ? Math.max(0, balance) / Math.pow(1 + monthlyInflationRate, month)
      : undefined;
    
    breakdown.push({
      month,
      emi: Math.round(emi),
      principal: Math.round(principalComponent),
      interest: Math.round(interestComponent),
      balance: Math.round(Math.max(0, balance)),
      realEMI: realEMIMonth ? Math.round(realEMIMonth) : undefined,
      realBalance: realBalanceMonth ? Math.round(realBalanceMonth) : undefined
    });
  }

  const result = {
    loanAmount,
    interestRate,
    tenure,
    emi: Math.round(emi),
    totalPayable: Math.round(totalPayable),
    totalInterest: Math.round(totalInterest),
    inflationRate,
    realEMI: realEMI ? Math.round(realEMI) : undefined,
    realTotalPayable: realTotalPayable ? Math.round(realTotalPayable) : undefined,
    breakdown
  };

  calculationCache.set(cacheKey, result);
  return result;
}

export function calculateCAGR(
  initialValue: number,
  finalValue: number,
  years: number,
  inflationRate?: number
) {
  const cacheKey = getCacheKey('cagr', [initialValue, finalValue, years, inflationRate]);
  
  if (calculationCache.has(cacheKey)) {
    return calculationCache.get(cacheKey);
  }

  // CAGR formula: (Final Value / Initial Value)^(1/years) - 1
  const cagr = (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;
  const totalGrowthPercent = ((finalValue - initialValue) / initialValue) * 100;
  const absoluteReturns = finalValue - initialValue;
  
  // Calculate inflation-adjusted values if inflation rate is provided
  let realCAGR, realFinalValue;
  
  if (inflationRate !== undefined && inflationRate > 0) {
    // Real CAGR = (1 + nominal CAGR) / (1 + inflation rate) - 1
    const nominalCAGRDecimal = cagr / 100;
    const inflationRateDecimal = inflationRate / 100;
    realCAGR = ((1 + nominalCAGRDecimal) / (1 + inflationRateDecimal) - 1) * 100;
    
    // Real final value in today's purchasing power
    realFinalValue = finalValue / Math.pow(1 + inflationRateDecimal, years);
  }
  
  // Generate yearly projection data for chart
  const yearlyProjection = [];
  const cagrDecimal = cagr / 100;
  const realCAGRDecimal = realCAGR ? realCAGR / 100 : 0;
  
  for (let year = 0; year <= years; year++) {
    const nominalValue = initialValue * Math.pow(1 + cagrDecimal, year);
    const realValue = inflationRate !== undefined && inflationRate > 0 && realCAGR !== undefined
      ? initialValue * Math.pow(1 + realCAGRDecimal, year)
      : undefined;
    
    // Calculate annual returns (difference from previous year)
    const previousValue = year > 0 ? initialValue * Math.pow(1 + cagrDecimal, year - 1) : initialValue;
    const annualReturns = year > 0 ? nominalValue - previousValue : 0;
    
    yearlyProjection.push({
      year,
      value: nominalValue,
      realValue,
      annualReturns
    });
  }

  const result = {
    initialValue,
    finalValue,
    years,
    cagr,
    totalGrowthPercent,
    absoluteReturns,
    inflationRate,
    realCAGR,
    realFinalValue,
    yearlyProjection
  };

  calculationCache.set(cacheKey, result);
  return result;
}

// Helper function to calculate Net Present Value (NPV)
function calculateNPV(cashFlows: CashFlow[], rate: number): number {
  const baseDate = new Date(cashFlows[0].date);
  
  return cashFlows.reduce((npv, cashFlow) => {
    const cashFlowDate = new Date(cashFlow.date);
    const yearsDiff = (cashFlowDate.getTime() - baseDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    const presentValue = cashFlow.amount / Math.pow(1 + rate, yearsDiff);
    return npv + presentValue;
  }, 0);
}

// Helper function to calculate NPV derivative for Newton-Raphson method
function calculateNPVDerivative(cashFlows: CashFlow[], rate: number): number {
  const baseDate = new Date(cashFlows[0].date);
  
  return cashFlows.reduce((derivative, cashFlow) => {
    const cashFlowDate = new Date(cashFlow.date);
    const yearsDiff = (cashFlowDate.getTime() - baseDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    const derivativeValue = (-yearsDiff * cashFlow.amount) / Math.pow(1 + rate, yearsDiff + 1);
    return derivative + derivativeValue;
  }, 0);
}

export function calculateXIRR(cashFlows: CashFlow[]): XIRRCalculation {
  const cacheKey = getCacheKey('xirr', [cashFlows]);
  
  if (calculationCache.has(cacheKey)) {
    return calculationCache.get(cacheKey);
  }

  if (cashFlows.length < 2) {
    throw new Error('At least 2 cash flows are required for XIRR calculation');
  }

  // Sort cash flows by date
  const sortedCashFlows = [...cashFlows].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Validate that we have both positive and negative cash flows
  const hasPositive = sortedCashFlows.some(cf => cf.amount > 0);
  const hasNegative = sortedCashFlows.some(cf => cf.amount < 0);
  
  if (!hasPositive || !hasNegative) {
    throw new Error('XIRR requires both positive and negative cash flows');
  }

  // Newton-Raphson method to find XIRR
  let rate = 0.1; // Initial guess: 10%
  const maxIterations = 100;
  const tolerance = 1e-6;

  for (let i = 0; i < maxIterations; i++) {
    const npv = calculateNPV(sortedCashFlows, rate);
    const npvDerivative = calculateNPVDerivative(sortedCashFlows, rate);
    
    if (Math.abs(npv) < tolerance) {
      break;
    }
    
    if (Math.abs(npvDerivative) < tolerance) {
      throw new Error('Unable to calculate XIRR - derivative too small');
    }
    
    const newRate = rate - npv / npvDerivative;
    
    if (Math.abs(newRate - rate) < tolerance) {
      break;
    }
    
    rate = newRate;
    
    // Prevent extreme values
    if (rate < -0.99 || rate > 10) {
      throw new Error('XIRR calculation did not converge to a reasonable value');
    }
  }

  const xirr = rate * 100; // Convert to percentage

  // Calculate summary statistics
  const totalInvested = sortedCashFlows
    .filter(cf => cf.amount < 0)
    .reduce((sum, cf) => sum + Math.abs(cf.amount), 0);
  
  const totalReturned = sortedCashFlows
    .filter(cf => cf.amount > 0)
    .reduce((sum, cf) => sum + cf.amount, 0);
  
  const netGain = totalReturned - totalInvested;
  const netGainPercent = (netGain / totalInvested) * 100;
  
  // Calculate duration
  const firstDate = new Date(sortedCashFlows[0].date);
  const lastDate = new Date(sortedCashFlows[sortedCashFlows.length - 1].date);
  const duration = (lastDate.getTime() - firstDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
  
  const annualizedReturn = xirr;

  // Generate cumulative data for visualization
  const cumulativeData = [];
  let cumulativeInvestment = 0;
  let cumulativeReturns = 0;
  
  sortedCashFlows.forEach(cashFlow => {
    if (cashFlow.amount < 0) {
      cumulativeInvestment += Math.abs(cashFlow.amount);
    } else {
      cumulativeReturns += cashFlow.amount;
    }
    
    cumulativeData.push({
      date: cashFlow.date,
      cumulativeInvestment,
      cumulativeReturns,
      netPosition: cumulativeReturns - cumulativeInvestment
    });
  });

  const result = {
    cashFlows: sortedCashFlows,
    xirr,
    totalInvested,
    totalReturned,
    netGain,
    netGainPercent,
    duration,
    annualizedReturn,
    cumulativeData
  };

  calculationCache.set(cacheKey, result);
  return result;
}

// Optimized currency formatting with memoization
const formatCache = new Map<string, string>();

export function formatCurrency(amount: number, currency: Currency): string {
  const cacheKey = `${amount}-${currency.code}`;
  
  if (formatCache.has(cacheKey)) {
    return formatCache.get(cacheKey)!;
  }

  let result: string;
  try {
    result = new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch (error) {
    // Fallback for unsupported locales
    result = `${currency.symbol}${formatNumber(amount)}`;
  }

  formatCache.set(cacheKey, result);
  return result;
}

export function getCurrencySymbol(currency: Currency): string {
  return currency.symbol;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(Math.round(num));
}

export function formatCurrencyCompact(amount: number, currency: Currency): string {
  const cacheKey = `compact-${amount}-${currency.code}`;
  
  if (formatCache.has(cacheKey)) {
    return formatCache.get(cacheKey)!;
  }

  let result: string;
  try {
    if (amount >= 10000000) { // 1 crore
      result = `${currency.symbol}${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) { // 1 lakh
      result = `${currency.symbol}${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) { // 1 thousand
      result = `${currency.symbol}${(amount / 1000).toFixed(1)}K`;
    } else {
      result = `${currency.symbol}${amount.toFixed(0)}`;
    }
  } catch (error) {
    result = `${currency.symbol}${formatNumber(amount)}`;
  }

  formatCache.set(cacheKey, result);
  return result;
}

// Clear cache periodically to prevent memory leaks
if (typeof window !== 'undefined') {
  setInterval(() => {
    if (calculationCache.size > 100) {
      calculationCache.clear();
    }
    if (formatCache.size > 200) {
      formatCache.clear();
    }
  }, 300000); // Clear every 5 minutes
}