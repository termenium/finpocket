'use client';

import { useState, useEffect } from 'react';
import { CalculatorLayout } from '@/components/calculator-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClampedNumberInput } from '@/components/clamped-number-input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { calculateEMI, formatCurrency, getCurrencySymbol, formatCurrencyCompact } from '@/utils/calculations';
import { useCurrency } from '@/components/currency-provider';
import { EMICalculation } from '@/types/calculator';
import { RotateCcw } from 'lucide-react';
import { InfoTooltip } from '@/components/info-tooltip';
import { ShareDropdown } from '@/components/share-dropdown';

// Default values
const DEFAULT_LOAN_AMOUNT = 1000000;
const DEFAULT_INTEREST_RATE = 8.5;
const DEFAULT_TENURE = 20;
const DEFAULT_INFLATION_RATE = 6;

export default function EMICalculator() {
  const { currency } = useCurrency();
  const [showFullSchedule, setShowFullSchedule] = useState<boolean>(false);
  const [loanAmount, setLoanAmount] = useState<number>(DEFAULT_LOAN_AMOUNT);
  const [interestRate, setInterestRate] = useState<number>(DEFAULT_INTEREST_RATE);
  const [tenure, setTenure] = useState<number>(DEFAULT_TENURE);
  const [showInflationAdjustment, setShowInflationAdjustment] = useState<boolean>(false);
  const [inflationRate, setInflationRate] = useState<number>(DEFAULT_INFLATION_RATE);
  const [result, setResult] = useState<EMICalculation | null>(null);

  const handleReset = () => {
    setLoanAmount(DEFAULT_LOAN_AMOUNT);
    setInterestRate(DEFAULT_INTEREST_RATE);
    setTenure(DEFAULT_TENURE);
    setShowInflationAdjustment(false);
    setInflationRate(DEFAULT_INFLATION_RATE);
    setResult(null);
  };

  const getShareText = () => {
    if (!result) return '';

    const inflationText = showInflationAdjustment && result.inflationRate 
      ? `\n🔥 Inflation Rate: ${result.inflationRate}%\n\n📊 Real Values (Inflation-Adjusted):\n• Real EMI Value: ${formatCurrency(result.realEMI || 0, currency)}\n• Real Total Payable: ${formatCurrency(result.realTotalPayable || 0, currency)}\n`
      : '';

    return `🏠 EMI Loan Calculation Results

💰 Loan Amount: ${formatCurrency(result.loanAmount, currency)}
📈 Interest Rate: ${result.interestRate}% per annum
⏰ Loan Tenure: ${result.tenure} years${inflationText}

📊 Results:
• Monthly EMI: ${formatCurrency(result.emi, currency)}
• Total Interest: ${formatCurrency(result.totalInterest, currency)}
• Total Payable: ${formatCurrency(result.totalPayable, currency)}

Calculated using FinPocket - Professional Financial Calculators`;
  };

  // Auto-calculate when values change
  useEffect(() => {
    if (loanAmount > 0 && interestRate >= 0 && tenure > 0) {
      const calculation = calculateEMI(
        loanAmount, 
        interestRate, 
        tenure, 
        showInflationAdjustment ? inflationRate : undefined
      );
      setResult(calculation);
    }
  }, [loanAmount, interestRate, tenure, showInflationAdjustment, inflationRate]);

  const handleLoanAmountChange = (value: number[]) => {
    setLoanAmount(value[0]);
  };

  const handleInterestRateChange = (value: number[]) => {
    setInterestRate(value[0]);
  };

  const handleTenureChange = (value: number[]) => {
    setTenure(value[0]);
  };

  const handleInflationRateChange = (value: number[]) => {
    setInflationRate(value[0]);
  };



  return (
    <CalculatorLayout
      title="EMI Calculator"
      description="Calculate your loan EMI, total interest payable, and get a detailed payment breakdown."
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-10">
        {/* Input Form */}
        <Card className="h-fit shadow-enhanced rounded-2xl">
          <CardHeader className="pb-6 sm:pb-8">
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl">Loan Details</CardTitle>
            <CardDescription className="text-base sm:text-lg">
              Use sliders for quick adjustments or input fields for precise values
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 sm:space-y-10">
            {/* Loan Amount */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <Label htmlFor="amount" className="text-base sm:text-lg font-semibold">
                  Loan Amount
                </Label>
                <span className="text-base sm:text-lg font-bold text-primary">
                  {formatCurrency(loanAmount, currency)}
                </span>
              </div>
              
              <Slider
                id="amount-slider"
                min={10000}
                max={50000000}
                step={10000}
                value={[loanAmount]}
                onValueChange={handleLoanAmountChange}
                className="w-full"
                aria-label="Loan Amount"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatCurrencyCompact(10000, currency)}</span>
                <span>{formatCurrencyCompact(50000000, currency)}</span>
              </div>
              
              <ClampedNumberInput
                id="amount"
                value={loanAmount}
                onValueChange={setLoanAmount}
                placeholder="1000000"
                min={10000}
                max={50000000}
                step="10000"
                className="text-base sm:text-lg h-12 sm:h-14 rounded-xl"
              />
            </div>
            
            {/* Interest Rate */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <Label htmlFor="rate" className="text-base sm:text-lg font-semibold">
                  Interest Rate (per annum)
                </Label>
                <span className="text-base sm:text-lg font-bold text-primary">
                  {interestRate}%
                </span>
              </div>
              
              <Slider
                id="rate-slider"
                min={0}
                max={30}
                step={0.1}
                value={[interestRate]}
                onValueChange={handleInterestRateChange}
                className="w-full"
                aria-label="Interest Rate"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>0%</span>
                <span>30%</span>
              </div>
              
              <ClampedNumberInput
                id="rate"
                value={interestRate}
                onValueChange={setInterestRate}
                placeholder="8.5"
                min={0}
                max={30}
                step="0.1"
                className="text-base sm:text-lg h-12 sm:h-14 rounded-xl"
              />
            </div>
            
            {/* Tenure */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <Label htmlFor="tenure" className="text-base sm:text-lg font-semibold">
                  Loan Tenure
                </Label>
                <span className="text-base sm:text-lg font-bold text-primary">
                  {tenure} {tenure === 1 ? 'Year' : 'Years'}
                </span>
              </div>
              
              <Slider
                id="tenure-slider"
                min={1}
                max={30}
                step={1}
                value={[tenure]}
                onValueChange={handleTenureChange}
                className="w-full"
                aria-label="Loan Tenure"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>1 Year</span>
                <span>30 Years</span>
              </div>
              
              <ClampedNumberInput
                id="tenure"
                value={tenure}
                onValueChange={setTenure}
                placeholder="20"
                min={1}
                max={30}
                step="1"
                className="text-base sm:text-lg h-12 sm:h-14 rounded-xl"
              />
            </div>

            {/* Inflation Adjustment */}
            <div className="space-y-5 border-t pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Label htmlFor="inflation-toggle" className="text-base sm:text-lg font-semibold">
                    Adjust for Inflation
                  </Label>
                  <InfoTooltip text="Shows the real purchasing power of your EMI payments over time" />
                </div>
                <Switch
                  id="inflation-toggle"
                  checked={showInflationAdjustment}
                  onCheckedChange={setShowInflationAdjustment}
                />
              </div>

              {showInflationAdjustment && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="inflation" className="text-base sm:text-lg font-semibold">
                      Expected Inflation Rate
                    </Label>
                    <span className="text-base sm:text-lg font-bold text-primary">
                      {inflationRate}%
                    </span>
                  </div>
                  
                  <Slider
                    id="inflation-slider"
                    min={0}
                    max={15}
                    step={0.5}
                    value={[inflationRate]}
                    onValueChange={handleInflationRateChange}
                    className="w-full"
                    aria-label="Expected Inflation Rate"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>0%</span>
                    <span>15%</span>
                  </div>
                  
                  <ClampedNumberInput
                    id="inflation"
                    value={inflationRate}
                    onValueChange={setInflationRate}
                    placeholder="6"
                    min={0}
                    max={15}
                    step="0.5"
                    className="text-base sm:text-lg h-12 sm:h-14 rounded-xl"
                  />
                </div>
              )}
            </div>
            
            <div className="flex gap-4 pt-6">
              <Button 
                onClick={handleReset} 
                variant="outline" 
                size="lg"
                className="flex items-center gap-2 w-full h-12 sm:h-14 text-base rounded-xl"
                aria-label="Reset to default values"
              >
                <RotateCcw className="w-5 h-5" />
                Reset to Defaults
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-6 sm:space-y-8" id="emi-results" role="status" aria-live="polite">
            <Card className="shadow-enhanced rounded-2xl">
              <CardHeader className="pb-6 sm:pb-8">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl sm:text-2xl lg:text-3xl">Loan Summary</CardTitle>
                  <ShareDropdown
                    shareText={getShareText()}
                    elementId="emi-results"
                    calculatorType="EMI Calculator"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
                  <div className="space-y-2 p-4 sm:p-6 rounded-xl bg-muted/50">
                    <p className="text-sm sm:text-base text-muted-foreground">Monthly EMI</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">
                      {formatCurrency(result.emi, currency)}
                    </p>
                  </div>
                  <div className="space-y-2 p-4 sm:p-6 rounded-xl bg-muted/50">
                    <p className="text-sm sm:text-base text-muted-foreground">Total Interest</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-destructive">
                      {formatCurrency(result.totalInterest, currency)}
                    </p>
                  </div>
                  <div className="col-span-1 sm:col-span-2 space-y-2 border-t pt-6 p-4 sm:p-6 rounded-xl bg-primary/5">
                    <p className="text-sm sm:text-base text-muted-foreground">Total Payable</p>
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                      {formatCurrency(result.totalPayable, currency)}
                    </p>
                  </div>
                </div>

                {/* Inflation-Adjusted Values */}
                {showInflationAdjustment && result.realEMI && (
                  <div className="mt-8 pt-6 border-t">
                    <h4 className="text-base font-semibold text-muted-foreground mb-6 text-center">
                      Real Values (Inflation-Adjusted at {result.inflationRate}%)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
                      <div className="space-y-2 p-4 sm:p-6 rounded-xl bg-warning-soft">
                        <p className="text-sm sm:text-base text-muted-foreground">Real EMI Value</p>
                        <p className="text-xl sm:text-2xl font-bold text-warning">
                          {formatCurrency(result.realEMI || 0, currency)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          (Average purchasing power)
                        </p>
                      </div>
                      <div className="space-y-2 p-4 sm:p-6 rounded-xl bg-warning-soft">
                        <p className="text-sm sm:text-base text-muted-foreground">Real Total Payable</p>
                        <p className="text-xl sm:text-2xl font-bold text-warning">
                          {formatCurrency(result.realTotalPayable || 0, currency)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          (In today's value)
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-enhanced rounded-2xl">
              <CardHeader className="pb-6 sm:pb-8">
                <CardTitle className="text-xl sm:text-2xl lg:text-3xl">Payment Breakdown</CardTitle>
                <CardDescription className="text-base sm:text-lg">
                  Monthly principal vs interest breakdown
                  {showFullSchedule ? ` (all ${result.tenure} years)` : ' (first 5 years)'}
                  {showInflationAdjustment && ' with real EMI purchasing power trend'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {result.tenure > 5 && (
                  <div className="flex justify-end mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFullSchedule(prev => !prev)}
                      className="rounded-lg text-sm"
                    >
                      {showFullSchedule ? 'Show first 5 years' : `Show all ${result.tenure} years`}
                    </Button>
                  </div>
                )}
                <div className="h-80 sm:h-96 lg:h-[28rem]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={
                        showFullSchedule
                          ? result.breakdown // full monthly schedule (aggregation would distort principal/interest split)
                          : result.breakdown.slice(0, 60)
                      }
                      margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="month" 
                        tickFormatter={(value) => `Y${Math.ceil(value / 12)}`}
                        interval={showFullSchedule ? 23 : 11}
                        className="text-muted-foreground"
                        fontSize={12}
                      />
                      <YAxis 
                        tickFormatter={(value) => formatCurrencyCompact(value, currency)}
                        className="text-muted-foreground"
                        fontSize={12}
                      />
                      <Tooltip 
                        formatter={(value: number, name: string) => [
                          formatCurrency(value, currency),
                          name === 'principal' ? 'Principal (Nominal)' : 
                          name === 'interest' ? 'Interest (Nominal)' : 'Real EMI Value'
                        ]}
                        labelFormatter={(month: number) => `Month ${month}`}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="principal" stackId="a" fill="#10b981" name="principal" isAnimationActive={false} />
                      <Bar dataKey="interest" stackId="a" fill="#f59e0b" name="interest" isAnimationActive={false} />
                      {showInflationAdjustment && (
                        <Line 
                          type="monotone" 
                          dataKey="realEMI" 
                          stroke="#f97316" 
                          strokeWidth={3}
                          dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
                          name="realEMI"
                          isAnimationActive={false}
                        />
                      )}
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}