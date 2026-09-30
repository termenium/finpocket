'use client';

import { useState, useEffect } from 'react';
import { CalculatorLayout } from '@/components/calculator-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClampedNumberInput } from '@/components/clamped-number-input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { calculateLumpSum, formatCurrency, getCurrencySymbol, formatCurrencyCompact } from '@/utils/calculations';
import { useCurrency } from '@/components/currency-provider';
import { LumpSumCalculation } from '@/types/calculator';
import { RotateCcw } from 'lucide-react';
import { InfoTooltip } from '@/components/info-tooltip';
import { ShareDropdown } from '@/components/share-dropdown';

// Default values
const DEFAULT_PRINCIPAL = 100000;
const DEFAULT_ANNUAL_RETURN = 12;
const DEFAULT_YEARS = 10;
const DEFAULT_INFLATION_RATE = 6;

export default function LumpSumCalculator() {
  const { currency } = useCurrency();
  const [principal, setPrincipal] = useState<number>(DEFAULT_PRINCIPAL);
  const [annualReturn, setAnnualReturn] = useState<number>(DEFAULT_ANNUAL_RETURN);
  const [years, setYears] = useState<number>(DEFAULT_YEARS);
  const [showInflationAdjustment, setShowInflationAdjustment] = useState<boolean>(false);
  const [inflationRate, setInflationRate] = useState<number>(DEFAULT_INFLATION_RATE);
  const [result, setResult] = useState<LumpSumCalculation | null>(null);

  const handleReset = () => {
    setPrincipal(DEFAULT_PRINCIPAL);
    setAnnualReturn(DEFAULT_ANNUAL_RETURN);
    setYears(DEFAULT_YEARS);
    setShowInflationAdjustment(false);
    setInflationRate(DEFAULT_INFLATION_RATE);
    setResult(null);
  };

  const getShareText = () => {
    if (!result) return '';

    const inflationText = showInflationAdjustment && result.inflationRate 
      ? `\n🔥 Inflation Rate: ${result.inflationRate}%\n\n📊 Real Values (Inflation-Adjusted):\n• Real Maturity Value: ${formatCurrency(result.realMaturityValue || 0, currency)}\n• Real Total Returns: ${formatCurrency(result.realTotalReturns || 0, currency)}\n`
      : '';

    return `💰 Lump Sum Investment Calculation Results

🎯 Initial Investment: ${formatCurrency(result.principal, currency)}
📈 Expected Annual Return: ${result.annualReturn}%
⏰ Investment Duration: ${result.years} years${inflationText}

📊 Nominal Results:
• Total Returns: ${formatCurrency(result.totalReturns, currency)}
• Maturity Value: ${formatCurrency(result.maturityValue, currency)}
• Growth: ${((result.maturityValue / result.principal - 1) * 100).toFixed(1)}%

Calculated using FinPocket - Professional Financial Calculators`;
  };

  // Auto-calculate when values change
  useEffect(() => {
    if (principal > 0 && annualReturn > 0 && years > 0) {
      const calculation = calculateLumpSum(
        principal, 
        annualReturn, 
        years, 
        showInflationAdjustment ? inflationRate : undefined
      );
      setResult(calculation);
    }
  }, [principal, annualReturn, years, showInflationAdjustment, inflationRate]);

  const handlePrincipalChange = (value: number[]) => {
    setPrincipal(value[0]);
  };

  const handleAnnualReturnChange = (value: number[]) => {
    setAnnualReturn(value[0]);
  };

  const handleYearsChange = (value: number[]) => {
    setYears(value[0]);
  };

  const handleInflationRateChange = (value: number[]) => {
    setInflationRate(value[0]);
  };



  return (
    <CalculatorLayout
      title="Lump Sum Calculator"
      description="Calculate the future value of your one-time investment and see how it grows with compound interest."
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-10">
        {/* Input Form */}
        <Card className="h-fit shadow-enhanced rounded-2xl">
          <CardHeader className="pb-6 sm:pb-8">
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl">Investment Details</CardTitle>
            <CardDescription className="text-base sm:text-lg">
              Use sliders for quick adjustments or input fields for precise values
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 sm:space-y-10">
            {/* Principal Amount */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <Label htmlFor="principal" className="text-base sm:text-lg font-semibold">
                  Investment Amount
                </Label>
                <span className="text-base sm:text-lg font-bold text-primary">
                  {formatCurrency(principal, currency)}
                </span>
              </div>
              
              <Slider
                id="principal-slider"
                min={1000}
                max={10000000}
                step={1000}
                value={[principal]}
                onValueChange={handlePrincipalChange}
                className="w-full"
                aria-label="Investment Amount"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatCurrencyCompact(1000, currency)}</span>
                <span>{formatCurrencyCompact(10000000, currency)}</span>
              </div>
              
              <ClampedNumberInput
                id="principal"
                value={principal}
                onValueChange={setPrincipal}
                placeholder="100000"
                min={1000}
                max={10000000}
                step="1000"
                className="text-base sm:text-lg h-12 sm:h-14 rounded-xl"
              />
            </div>
            
            {/* Annual Return */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <Label htmlFor="return" className="text-base sm:text-lg font-semibold">
                  Expected Annual Return
                </Label>
                <span className="text-base sm:text-lg font-bold text-primary">
                  {annualReturn}%
                </span>
              </div>
              
              <Slider
                id="return-slider"
                min={1}
                max={30}
                step={0.5}
                value={[annualReturn]}
                onValueChange={handleAnnualReturnChange}
                className="w-full"
                aria-label="Expected Annual Return"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>1%</span>
                <span>30%</span>
              </div>
              
              <ClampedNumberInput
                id="return"
                value={annualReturn}
                onValueChange={setAnnualReturn}
                placeholder="12"
                min={1}
                max={30}
                step="0.5"
                className="text-base sm:text-lg h-12 sm:h-14 rounded-xl"
              />
            </div>
            
            {/* Years */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <Label htmlFor="years" className="text-base sm:text-lg font-semibold">
                  Investment Duration
                </Label>
                <span className="text-base sm:text-lg font-bold text-primary">
                  {years} {years === 1 ? 'Year' : 'Years'}
                </span>
              </div>
              
              <Slider
                id="years-slider"
                min={1}
                max={50}
                step={1}
                value={[years]}
                onValueChange={handleYearsChange}
                className="w-full"
                aria-label="Investment Duration"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>1 Year</span>
                <span>50 Years</span>
              </div>
              
              <ClampedNumberInput
                id="years"
                value={years}
                onValueChange={setYears}
                placeholder="10"
                min={1}
                max={50}
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
                  <InfoTooltip text="Shows the real purchasing power of your returns after accounting for inflation" />
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
          <div className="space-y-6 sm:space-y-8" id="lumpsum-results" role="status" aria-live="polite">
            <Card className="shadow-enhanced rounded-2xl">
              <CardHeader className="pb-6 sm:pb-8">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl sm:text-2xl lg:text-3xl">Investment Summary</CardTitle>
                  <ShareDropdown
                    shareText={getShareText()}
                    elementId="lumpsum-results"
                    calculatorType="Lump Sum Calculator"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
                  <div className="space-y-2 p-4 sm:p-6 rounded-xl bg-muted/50">
                    <p className="text-sm sm:text-base text-muted-foreground">Initial Investment</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">
                      {formatCurrency(result.principal, currency)}
                    </p>
                  </div>
                  <div className="space-y-2 p-4 sm:p-6 rounded-xl bg-muted/50">
                    <p className="text-sm sm:text-base text-muted-foreground">Total Returns</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-success">
                      {formatCurrency(result.totalReturns, currency)}
                    </p>
                  </div>
                  <div className="col-span-1 sm:col-span-2 space-y-2 border-t pt-6 p-4 sm:p-6 rounded-xl bg-primary/5">
                    <p className="text-sm sm:text-base text-muted-foreground">Maturity Value</p>
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                      {formatCurrency(result.maturityValue, currency)}
                    </p>
                  </div>
                </div>

                {/* Inflation-Adjusted Values */}
                {showInflationAdjustment && result.realMaturityValue && (
                  <div className="mt-8 pt-6 border-t">
                    <h4 className="text-base font-semibold text-muted-foreground mb-6 text-center">
                      Real Values (Inflation-Adjusted at {result.inflationRate}%)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
                      <div className="space-y-2 p-4 sm:p-6 rounded-xl bg-muted/50">
                        <p className="text-sm sm:text-base text-muted-foreground">Real Total Returns</p>
                        <p className="text-xl sm:text-2xl font-bold text-warning">
                          {formatCurrency(result.realTotalReturns || 0, currency)}
                        </p>
                      </div>
                      <div className="space-y-2 p-4 sm:p-6 rounded-xl bg-muted/50">
                        <p className="text-sm sm:text-base text-muted-foreground">Real Maturity Value</p>
                        <p className="text-xl sm:text-2xl font-bold text-warning">
                          {formatCurrency(result.realMaturityValue || 0, currency)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-enhanced rounded-2xl">
              <CardHeader className="pb-6 sm:pb-8">
                <CardTitle className="text-xl sm:text-2xl lg:text-3xl">Growth Projection</CardTitle>
                <CardDescription className="text-base sm:text-lg">
                  See how your investment grows year over year
                  {showInflationAdjustment && ' (including inflation-adjusted values)'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 sm:h-96 lg:h-[28rem]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={result.yearlyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="year" 
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
                          name === 'value' ? 'Investment Value (Nominal)' : 'Investment Value (Real)'
                        ]}
                        labelFormatter={(year: number) => `Year ${year}`}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Legend />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#18181b" 
                        fill="#18181b" 
                        fillOpacity={0.6}
                        name="value"
                        isAnimationActive={false}
                      />
                      {showInflationAdjustment && (
                        <Area 
                          type="monotone" 
                          dataKey="realValue" 
                          stroke="#71717a" 
                          fill="#71717a" 
                          fillOpacity={0.4}
                          name="realValue"
                          isAnimationActive={false}
                        />
                      )}
                    </AreaChart>
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