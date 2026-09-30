'use client';

import { useState, useEffect } from 'react';
import { CalculatorLayout } from '@/components/calculator-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar, Cell } from 'recharts';
import { calculateXIRR, formatCurrency, formatNumber } from '@/utils/calculations';
import { useCurrency } from '@/components/currency-provider';
import { CashFlow, XIRRCalculation } from '@/types/calculator';
import { RotateCcw, Plus, Trash2, Calculator, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { ShareDropdown } from '@/components/share-dropdown';
import { SignedNumberInput } from '@/components/signed-number-input';
import { toast } from 'sonner';

// Static default dates avoid hydration mismatches: the prerendered HTML and
// the client render must be identical. Dates are relative to 'now' at runtime
// (either server render time or client mount time), not build time.
function getDefaultCashFlows(): CashFlow[] {
  const now = new Date();
  const inOneYear = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
  return [
    {
      id: '1',
      date: now.toISOString().split('T')[0],
      amount: -100000,
      description: 'Initial Investment'
    },
    {
      id: '2',
      date: inOneYear.toISOString().split('T')[0],
      amount: 120000,
      description: 'Final Return'
    }
  ];
}

export default function XIRRCalculator() {
  const { currency } = useCurrency();
  const [cashFlows, setCashFlows] = useState<CashFlow[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [result, setResult] = useState<XIRRCalculation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Initialize date-dependent default state after mount to keep SSR/CSR output identical
  useEffect(() => {
    setCashFlows(getDefaultCashFlows());
    setIsMounted(true);
  }, []);

  const addCashFlow = () => {
    const newCashFlow: CashFlow = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      amount: 0,
      description: ''
    };
    setCashFlows([...cashFlows, newCashFlow]);
  };

  const removeCashFlow = (id: string) => {
    if (cashFlows.length <= 2) {
      toast.error('At least 2 cash flows are required');
      return;
    }
    setCashFlows(cashFlows.filter(cf => cf.id !== id));
  };

  const updateCashFlow = (id: string, field: keyof CashFlow, value: string | number) => {
    setCashFlows(cashFlows.map(cf => 
      cf.id === id ? { ...cf, [field]: value } : cf
    ));
  };

  const calculateResult = async (showSuccessToast = false) => {
    setIsCalculating(true);
    setError(null);
    
    try {
      // Validate cash flows
      const validCashFlows = cashFlows.filter(cf => cf.amount !== 0 && cf.date);
      
      if (validCashFlows.length < 2) {
        throw new Error('At least 2 non-zero cash flows are required');
      }

      const calculation = calculateXIRR(validCashFlows);
      setResult(calculation);
      // Only toast on explicit user action — never on auto-calc while typing
      if (showSuccessToast) {
        toast.success('XIRR calculated successfully!');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to calculate XIRR';
      setError(errorMessage);
      setResult(null);
      toast.error(errorMessage);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setCashFlows(getDefaultCashFlows());
    setResult(null);
    setError(null);
    setIsCalculating(false);
  };

  const getShareText = () => {
    if (!result) return '';

    const cashFlowsText = result.cashFlows
      .map(cf => `• ${new Date(cf.date).toLocaleDateString()}: ${formatCurrency(cf.amount, currency)}`)
      .join('\n');

    return `📊 XIRR Calculation Results

💰 Cash Flows:
${cashFlowsText}

📈 Results:
• XIRR (Annualized Return): ${result.xirr.toFixed(2)}%
• Total Invested: ${formatCurrency(result.totalInvested, currency)}
• Total Returned: ${formatCurrency(result.totalReturned, currency)}
• Net Gain: ${formatCurrency(result.netGain, currency)} (${result.netGainPercent.toFixed(1)}%)
• Investment Duration: ${result.duration.toFixed(1)} years

Calculated using FinPocket - Professional Financial Calculators`;
  };

  // Live calculation, debounced, consistent with the other calculators
  useEffect(() => {
    if (!isMounted) return;
    const validCashFlows = cashFlows.filter(cf => cf.amount !== 0 && cf.date);
    if (validCashFlows.length < 2) return;

    const timeoutId = setTimeout(() => {
      calculateResult(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [cashFlows, isMounted]);

  return (
    <CalculatorLayout
      title="XIRR Calculator"
      description="Calculate the Extended Internal Rate of Return (XIRR) for investments with irregular cash flows and dates."
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-10">
        {/* Input Form */}
        <Card className="h-fit shadow-enhanced rounded-2xl">
          <CardHeader className="pb-6 sm:pb-8">
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl">Cash Flow Details</CardTitle>
            <CardDescription className="text-base sm:text-lg">
              Add your investment cash flows with dates. Use negative values for investments and positive for returns.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Cash Flow Entries */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base sm:text-lg font-semibold">Cash Flows</Label>
                <Button
                  onClick={addCashFlow}
                  size="sm"
                  className="flex items-center gap-2 rounded-xl"
                  disabled={isCalculating}
                >
                  <Plus className="w-4 h-4" />
                  Add Cash Flow
                </Button>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {cashFlows.map((cashFlow, index) => (
                  <div key={cashFlow.id} className="p-4 border rounded-xl bg-muted/20">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium text-muted-foreground">
                        Cash Flow #{index + 1}
                      </span>
                      {cashFlows.length > 2 && (
                        <Button
                          onClick={() => removeCashFlow(cashFlow.id)}
                          size="sm"
                          variant="ghost"
                          className="text-destructive hover:text-destructive rounded-lg"
                          disabled={isCalculating}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`date-${cashFlow.id}`} className="text-sm">Date</Label>
                        <Input
                          id={`date-${cashFlow.id}`}
                          type="date"
                          value={cashFlow.date}
                          onChange={(e) => updateCashFlow(cashFlow.id, 'date', e.target.value)}
                          className="text-sm rounded-lg"
                          disabled={isCalculating}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`amount-${cashFlow.id}`} className="text-sm">
                          Amount ({currency.symbol})
                        </Label>
                        <SignedNumberInput
                          id={`amount-${cashFlow.id}`}
                          value={cashFlow.amount}
                          onValueChange={(v) => updateCashFlow(cashFlow.id, 'amount', v)}
                          placeholder="e.g. -100000 or 120000"
                          className="text-sm rounded-lg"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <Label htmlFor={`desc-${cashFlow.id}`} className="text-sm">Description (Optional)</Label>
                      <Input
                        id={`desc-${cashFlow.id}`}
                        type="text"
                        value={cashFlow.description || ''}
                        onChange={(e) => updateCashFlow(cashFlow.id, 'description', e.target.value)}
                        placeholder="e.g., Initial Investment, Dividend, Sale"
                        className="text-sm rounded-lg"
                        disabled={isCalculating}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Helper Text */}
            <div className="p-4 bg-muted/50 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                <div className="text-sm text-foreground">
                  <p className="font-medium mb-1">Tips for XIRR Calculation:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Use negative values for money going out (investments, purchases)</li>
                    <li>• Use positive values for money coming in (returns, dividends, sales)</li>
                    <li>• Ensure dates are in chronological order for best results</li>
                    <li>• At least one positive and one negative cash flow is required</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button 
                onClick={() => calculateResult(true)} 
                size="lg"
                className="flex items-center gap-2 flex-1 h-12 sm:h-14 text-base rounded-xl"
                disabled={isCalculating}
              >
                {isCalculating ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Calculator className="w-5 h-5" />
                )}
                {isCalculating ? 'Calculating...' : 'Calculate XIRR'}
              </Button>
              <Button 
                onClick={handleReset} 
                variant="outline" 
                size="lg"
                className="flex items-center gap-2 h-12 sm:h-14 text-base rounded-xl"
                disabled={isCalculating}
              >
                <RotateCcw className="w-5 h-5" />
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="space-y-6 sm:space-y-8">
          {error && (
            <Card className="border-destructive bg-destructive/5 shadow-enhanced rounded-2xl">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 text-destructive">
                  <AlertCircle className="w-5 h-5" />
                  <p className="font-medium">{error}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {result && (
            <div id="xirr-results" role="status" aria-live="polite">
              <Card className="shadow-enhanced rounded-2xl">
                <CardHeader className="pb-6 sm:pb-8">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl sm:text-2xl lg:text-3xl">XIRR Analysis</CardTitle>
                    <ShareDropdown
                      shareText={getShareText()}
                      elementId="xirr-results"
                      calculatorType="XIRR Calculator"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
                    <div className="space-y-2 p-4 sm:p-6 rounded-xl bg-muted/50 border">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-success" />
                        <p className="text-sm sm:text-base text-muted-foreground">XIRR (Annualized Return)</p>
                      </div>
                      <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-success">
                        {result.xirr.toFixed(2)}%
                      </p>
                    </div>
                    <div className="space-y-2 p-4 sm:p-6 rounded-xl bg-muted/50">
                      <p className="text-sm sm:text-base text-muted-foreground">Investment Duration</p>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">
                        {result.duration.toFixed(1)} Years
                      </p>
                    </div>
                    <div className="space-y-2 p-4 sm:p-6 rounded-xl bg-muted/50">
                      <p className="text-sm sm:text-base text-muted-foreground">Total Invested</p>
                      <p className="text-lg sm:text-xl font-bold text-destructive">
                        {formatCurrency(result.totalInvested, currency)}
                      </p>
                    </div>
                    <div className="space-y-2 p-4 sm:p-6 rounded-xl bg-muted/50">
                      <p className="text-sm sm:text-base text-muted-foreground">Total Returned</p>
                      <p className="text-lg sm:text-xl font-bold text-success">
                        {formatCurrency(result.totalReturned, currency)}
                      </p>
                    </div>
                    <div className="col-span-1 sm:col-span-2 space-y-2 border-t pt-6 p-4 sm:p-6 rounded-xl bg-primary/5">
                      <p className="text-sm sm:text-base text-muted-foreground">Net Gain</p>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                        {formatCurrency(result.netGain, currency)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ({result.netGainPercent.toFixed(1)}% total return)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-enhanced rounded-2xl">
                <CardHeader className="pb-6 sm:pb-8">
                  <CardTitle className="text-xl sm:text-2xl lg:text-3xl">Cash Flow Timeline</CardTitle>
                  <CardDescription className="text-base sm:text-lg">
                    Cumulative investment vs returns over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 sm:h-96 lg:h-[28rem]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={result.cumulativeData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })}
                          className="text-muted-foreground"
                          fontSize={11}
                          minTickGap={28}
                        />
                        <YAxis 
                          tickFormatter={(value) => formatCurrency(value, currency)}
                          className="text-muted-foreground"
                          fontSize={12}
                        />
                        <Tooltip 
                          formatter={(value: number, name: string) => [
                            formatCurrency(value, currency),
                            name === 'cumulativeInvestment' ? 'Total Invested' :
                            name === 'cumulativeReturns' ? 'Total Returns' : 'Net Position'
                          ]}
                          labelFormatter={(date: string) => new Date(date).toLocaleDateString()}
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
                          dataKey="cumulativeInvestment" 
                          stroke="#3f3f46" 
                          strokeWidth={3}
                          dot={{ fill: '#3f3f46', strokeWidth: 2, r: 4 }}
                          name="cumulativeInvestment"
                          isAnimationActive={false}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="cumulativeReturns" 
                          stroke="#18181b" 
                          strokeWidth={3}
                          dot={{ fill: '#18181b', strokeWidth: 2, r: 4 }}
                          name="cumulativeReturns"
                          isAnimationActive={false}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="netPosition" 
                          stroke="#52525b" 
                          strokeWidth={3}
                          strokeDasharray="5 5"
                          dot={{ fill: '#52525b', strokeWidth: 2, r: 4 }}
                          name="netPosition"
                          isAnimationActive={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-enhanced rounded-2xl">
                <CardHeader className="pb-6 sm:pb-8">
                  <CardTitle className="text-xl sm:text-2xl lg:text-3xl">Cash Flow Summary</CardTitle>
                  <CardDescription className="text-base sm:text-lg">
                    Individual cash flows with dates and amounts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 sm:h-80 lg:h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={result.cashFlows} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: '2-digit' })}
                          className="text-muted-foreground"
                          fontSize={11}
                          minTickGap={28}
                        />
                        <YAxis 
                          tickFormatter={(value) => formatCurrency(value, currency)}
                          className="text-muted-foreground"
                          fontSize={12}
                        />
                        <Tooltip 
                          formatter={(value: number) => [formatCurrency(value, currency), 'Cash Flow']}
                          labelFormatter={(date: string) => new Date(date).toLocaleDateString()}
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            fontSize: '12px'
                          }}
                        />
                        <Bar dataKey="amount" radius={[4, 4, 0, 0]} isAnimationActive={false}>
                          {result.cashFlows.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.amount >= 0 ? '#18181b' : '#3f3f46'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}