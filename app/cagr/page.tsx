'use client';

import { useState, useEffect } from 'react';
import { CalculatorLayout } from '@/components/calculator-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { calculateCAGR, formatCurrency, getCurrencySymbol, formatCurrencyCompact } from '@/utils/calculations';
import { useCurrency } from '@/components/currency-provider';
import { CAGRCalculation } from '@/types/calculator';
import { RotateCcw, Info, TrendingUp } from 'lucide-react';
import { ShareDropdown } from '@/components/share-dropdown';

// Default values
const DEFAULT_INITIAL_VALUE = 100000;
const DEFAULT_FINAL_VALUE = 200000;
const DEFAULT_YEARS = 5;
const DEFAULT_INFLATION_RATE = 6;

export default function CAGRCalculator() {
  const { currency } = useCurrency();
  const [initialValue, setInitialValue] = useState<number>(DEFAULT_INITIAL_VALUE);
  const [finalValue, setFinalValue] = useState<number>(DEFAULT_FINAL_VALUE);
  const [years, setYears] = useState<number>(DEFAULT_YEARS);
  const [showInflationAdjustment, setShowInflationAdjustment] = useState<boolean>(false);
  const [inflationRate, setInflationRate] = useState<number>(DEFAULT_INFLATION_RATE);
  const [result, setResult] = useState<CAGRCalculation | null>(null);

  const handleReset = () => {
    setInitialValue(DEFAULT_INITIAL_VALUE);
    setFinalValue(DEFAULT_FINAL_VALUE);
    setYears(DEFAULT_YEARS);
    setShowInflationAdjustment(false);
    setInflationRate(DEFAULT_INFLATION_RATE);
    setResult(null);
  };

  const getShareText = () => {
    if (!result) return '';

    const inflationText = showInflationAdjustment && result.inflationRate 
      ? `\n🔥 Inflation Rate: ${result.inflationRate}%\n\n📊 Real Values (Inflation-Adjusted):\n• Real CAGR: ${result.realCAGR?.toFixed(2)}%\n• Real Final Value: ${formatCurrency(result.realFinalValue || 0, currency)}\n`
      : '';

    return `📈 CAGR Calculation Results

💰 Initial Investment: ${formatCurrency(result.initialValue, currency)}
🎯 Final Value: ${formatCurrency(result.finalValue, currency)}
⏰ Investment Period: ${result.years} years${inflationText}

📊 Results:
• CAGR (Nominal): ${result.cagr.toFixed(2)}%
• Total Growth: ${result.totalGrowthPercent.toFixed(1)}%
• Absolute Returns: ${formatCurrency(result.absoluteReturns, currency)}

Calculated using FinToolkit - Professional Financial Calculators`;
  };

  // Auto-calculate when values change
  useEffect(() => {
    if (initialValue > 0 && finalValue > 0 && years > 0) {
      const calculation = calculateCAGR(
        initialValue, 
        finalValue, 
        years, 
        showInflationAdjustment ? inflationRate : undefined
      );
      setResult(calculation);
    }
  }, [initialValue, finalValue, years, showInflationAdjustment, inflationRate]);

  const handleInitialValueChange = (value: number[]) => {
    setInitialValue(value[0]);
  };

  const handleFinalValueChange = (value: number[]) => {
    setFinalValue(value[0]);
  };

  const handleYearsChange = (value: number[]) => {
    setYears(value[0]);
  };

  const handleInflationRateChange = (value: number[]) => {
    setInflationRate(value[0]);
  };

  const handleInputChange = (field: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    switch (field) {
      case 'initial':
        setInitialValue(Math.max(1000, Math.min(100000000, numValue)));
        break;
      case 'final':
        setFinalValue(Math.max(1000, Math.min(100000000, numValue)));
        break;
      case 'years':
        setYears(Math.max(1, Math.min(50, numValue)));
        break;
      case 'inflation':
        setInflationRate(Math.max(0, Math.min(15, numValue)));
        break;
    }
  };

  return (
    <CalculatorLayout
      title="CAGR Calculator"
      description="Calculate the Compound Annual Growth Rate (CAGR) of your investments and analyze their performance over time."
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        {/* Input Form */}
        <Card className="h-fit">
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl lg:text-2xl">Investment Details</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Use sliders for quick adjustments or input fields for precise values
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 sm:space-y-8">
            {/* Initial Value */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="initial" className="text-sm sm:text-base font-medium">
                  Initial Investment Value
                </Label>
                <span className="text-sm sm:text-base font-bold text-primary">
                  {formatCurrency(initialValue, currency)}
                </span>
              </div>
              
              <Slider
                id="initial-slider"
                min={1000}
                max={100000000}
                step={1000}
                value={[initialValue]}
                onValueChange={handleInitialValueChange}
                className="w-full"
                aria-label="Initial Investment Value"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatCurrencyCompact(1000, currency)}</span>
                <span>{formatCurrencyCompact(100000000, currency)}</span>
              </div>
              
              <Input
                id="initial"
                type="number"
                value={initialValue}
                onChange={(e) => handleInputChange('initial', e.target.value)}
                placeholder="100000"
                min="1000"
                max="100000000"
                step="1000"
                className="text-sm sm:text-base h-10 sm:h-11"
              />
            </div>
            
            {/* Final Value */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="final" className="text-sm sm:text-base font-medium">
                  Final Investment Value
                </Label>
                <span className="text-sm sm:text-base font-bold text-primary">
                  {formatCurrency(finalValue, currency)}
                </span>
              </div>
              
              <Slider
                id="final-slider"
                min={1000}
                max={100000000}
                step={1000}
                value={[finalValue]}
                onValueChange={handleFinalValueChange}
                className="w-full"
                aria-label="Final Investment Value"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatCurrencyCompact(1000, currency)}</span>
                <span>{formatCurrencyCompact(100000000, currency)}</span>
              </div>
              
              <Input
                id="final"
                type="number"
                value={finalValue}
                onChange={(e) => handleInputChange('final', e.target.value)}
                placeholder="200000"
                min="1000"
                max="100000000"
                step="1000"
                className="text-sm sm:text-base h-10 sm:h-11"
              />
            </div>
            
            {/* Years */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="years" className="text-sm sm:text-base font-medium">
                  Investment Period
                </Label>
                <span className="text-sm sm:text-base font-bold text-primary">
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
                aria-label="Investment Period"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1 Year</span>
                <span>50 Years</span>
              </div>
              
              <Input
                id="years"
                type="number"
                value={years}
                onChange={(e) => handleInputChange('years', e.target.value)}
                placeholder="5"
                min="1"
                max="50"
                className="text-sm sm:text-base h-10 sm:h-11"
              />
            </div>

            {/* Inflation Adjustment */}
            <div className="space-y-4 border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label htmlFor="inflation-toggle" className="text-sm sm:text-base font-medium">
                    Adjust for Inflation
                  </Label>
                  <div className="group relative">
                    <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-md shadow-md border opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-64 z-10">
                      Shows the real CAGR after accounting for inflation impact
                    </div>
                  </div>
                </div>
                <Switch
                  id="inflation-toggle"
                  checked={showInflationAdjustment}
                  onCheckedChange={setShowInflationAdjustment}
                />
              </div>

              {showInflationAdjustment && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="inflation" className="text-sm sm:text-base font-medium">
                      Expected Inflation Rate
                    </Label>
                    <span className="text-sm sm:text-base font-bold text-primary">
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
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>15%</span>
                  </div>
                  
                  <Input
                    id="inflation"
                    type="number"
                    value={inflationRate}
                    onChange={(e) => handleInputChange('inflation', e.target.value)}
                    placeholder="6"
                    min="0"
                    max="15"
                    step="0.5"
                    className="text-sm sm:text-base h-10 sm:h-11"
                  />
                </div>
              )}
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                onClick={handleReset} 
                variant="outline" 
                size="lg"
                className="flex items-center gap-2 w-full"
                aria-label="Reset to default values"
              >
                <RotateCcw className="w-4 h-4" />
                Reset to Defaults
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-4 sm:space-y-6" id="cagr-results">
            <Card>
              <CardHeader className="pb-4 sm:pb-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl">CAGR Analysis</CardTitle>
                  <ShareDropdown
                    shareText={getShareText()}
                    elementId="cagr-results"
                    calculatorType="CAGR Calculator"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                  <div className="space-y-1 p-3 sm:p-4 rounded-lg bg-muted/50">
                    <p className="text-xs sm:text-sm text-muted-foreground">CAGR (Nominal)</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600 dark:text-green-400">
                      {result.cagr.toFixed(2)}%
                    </p>
                  </div>
                  <div className="space-y-1 p-3 sm:p-4 rounded-lg bg-muted/50">
                    <p className="text-xs sm:text-sm text-muted-foreground">Total Growth</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {result.totalGrowthPercent.toFixed(1)}%
                    </p>
                  </div>
                  <div className="col-span-1 sm:col-span-2 space-y-1 border-t pt-4 p-3 sm:p-4 rounded-lg bg-primary/5">
                    <p className="text-xs sm:text-sm text-muted-foreground">Absolute Returns</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                      {formatCurrency(result.absoluteReturns, currency)}
                    </p>
                  </div>
                </div>

                {/* Inflation-Adjusted Values */}
                {showInflationAdjustment && result.realCAGR && (
                  <div className="mt-6 pt-4 border-t">
                    <h4 className="text-sm font-medium text-muted-foreground mb-4 text-center">
                      Real Values (Inflation-Adjusted at {result.inflationRate}%)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                      <div className="space-y-1 p-3 sm:p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                        <p className="text-xs sm:text-sm text-muted-foreground">Real CAGR</p>
                        <p className="text-lg sm:text-xl font-bold text-orange-600 dark:text-orange-400">
                          {result.realCAGR.toFixed(2)}%
                        </p>
                        <p className="text-xs text-muted-foreground">
                          (After inflation impact)
                        </p>
                      </div>
                      <div className="space-y-1 p-3 sm:p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                        <p className="text-xs sm:text-sm text-muted-foreground">Real Final Value</p>
                        <p className="text-lg sm:text-xl font-bold text-orange-600 dark:text-orange-400">
                          {formatCurrency(result.realFinalValue || 0, currency)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          (In today's purchasing power)
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl lg:text-2xl">Growth Visualization</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Year-by-year growth projection based on calculated CAGR
                  {showInflationAdjustment && ' (including inflation-adjusted values)'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 sm:h-80 lg:h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={result.yearlyProjection} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
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
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                        name="value"
                      />
                      {showInflationAdjustment && (
                        <Line 
                          type="monotone" 
                          dataKey="realValue" 
                          stroke="#f59e0b" 
                          strokeWidth={3}
                          strokeDasharray="5 5"
                          dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                          name="realValue"
                        />
                      )}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl lg:text-2xl">Annual Returns Breakdown</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Year-over-year absolute returns based on CAGR
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 sm:h-80 lg:h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={result.yearlyProjection.slice(1)} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
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
                        formatter={(value: number) => [formatCurrency(value, currency), 'Annual Returns']}
                        labelFormatter={(year: number) => `Year ${year}`}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Bar 
                        dataKey="annualReturns" 
                        fill="#3b82f6" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
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