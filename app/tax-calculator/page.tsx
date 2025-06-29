'use client';

import { useState, useEffect } from 'react';
import { CalculatorLayout } from '@/components/calculator-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { calculateIncomeTax, formatCurrency, TAX_COUNTRIES, TaxCountry } from '@/utils/taxCalculations';
import { TaxCalculation } from '@/types/calculator';
import { RotateCcw, Calculator, Info, FileText, Globe, RefreshCw } from 'lucide-react';
import { ShareDropdown } from '@/components/share-dropdown';
import { toast } from 'sonner';

export default function TaxCalculator() {
  const [selectedCountry, setSelectedCountry] = useState<TaxCountry>(TAX_COUNTRIES[0]); // Default to India
  const [grossIncome, setGrossIncome] = useState<number>(1200000);
  const [deductions, setDeductions] = useState<Record<string, number>>({});
  const [result, setResult] = useState<TaxCalculation | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Initialize deductions when country changes
  useEffect(() => {
    const initialDeductions: Record<string, number> = {};
    selectedCountry.deductions.forEach(deduction => {
      initialDeductions[deduction.key] = deduction.defaultValue || 0;
    });
    setDeductions(initialDeductions);
  }, [selectedCountry]);

  const handleCountryChange = (countryCode: string) => {
    const country = TAX_COUNTRIES.find(c => c.code === countryCode);
    if (country) {
      setSelectedCountry(country);
      setResult(null);
    }
  };

  const handleDeductionChange = (key: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setDeductions(prev => ({
      ...prev,
      [key]: Math.max(0, numValue)
    }));
  };

  const calculateTax = async () => {
    setIsCalculating(true);
    try {
      // Add a small delay to show loading state for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const calculation = calculateIncomeTax(selectedCountry, grossIncome, deductions);
      setResult(calculation);
      toast.success('Tax calculated successfully!');
    } catch (error) {
      toast.error('Failed to calculate tax. Please check your inputs.');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setGrossIncome(selectedCountry.code === 'IN' ? 1200000 : selectedCountry.code === 'US' ? 75000 : 50000);
    const initialDeductions: Record<string, number> = {};
    selectedCountry.deductions.forEach(deduction => {
      initialDeductions[deduction.key] = deduction.defaultValue || 0;
    });
    setDeductions(initialDeductions);
    setResult(null);
  };

  const getShareText = () => {
    if (!result) return '';

    const deductionsText = Object.entries(result.deductionsUsed)
      .filter(([_, value]) => value > 0)
      .map(([key, value]) => {
        const deduction = selectedCountry.deductions.find(d => d.key === key);
        return `• ${deduction?.name || key}: ${formatCurrency(value, selectedCountry.currency)}`;
      })
      .join('\n');

    const slabsText = result.taxBreakdown
      .filter(slab => slab.taxOnSlab > 0)
      .map(slab => `• ${slab.rate}% on ${formatCurrency(slab.from, selectedCountry.currency)} - ${slab.to === Infinity ? 'above' : formatCurrency(slab.to, selectedCountry.currency)}: ${formatCurrency(slab.taxOnSlab, selectedCountry.currency)}`)
      .join('\n');

    return `🏛️ Income Tax Calculation - ${selectedCountry.name}

💰 Gross Income: ${formatCurrency(result.grossIncome, selectedCountry.currency)}
📉 Total Deductions: ${formatCurrency(result.totalDeductions, selectedCountry.currency)}
💵 Taxable Income: ${formatCurrency(result.taxableIncome, selectedCountry.currency)}

${deductionsText ? `📋 Deductions Used:\n${deductionsText}\n\n` : ''}📊 Tax Breakdown:
${slabsText}

💸 Total Tax: ${formatCurrency(result.totalTax, selectedCountry.currency)}
💰 Net Income: ${formatCurrency(result.netIncome, selectedCountry.currency)}
📈 Effective Tax Rate: ${result.effectiveTaxRate.toFixed(2)}%

Calculated using FinPocket - Professional Financial Calculators`;
  };

  // Auto-calculate when values change
  useEffect(() => {
    if (grossIncome > 0) {
      const timeoutId = setTimeout(() => {
        calculateTax();
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [grossIncome, deductions, selectedCountry]);

  const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <CalculatorLayout
      title="Income Tax Calculator"
      description="Calculate your income tax across multiple countries with accurate tax slabs, deductions, and exemptions."
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-10">
        {/* Input Form */}
        <Card className="h-fit shadow-enhanced rounded-2xl">
          <CardHeader className="pb-6 sm:pb-8">
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl flex items-center gap-3">
              <Globe className="w-6 h-6 text-primary" />
              Tax Details
            </CardTitle>
            <CardDescription className="text-base sm:text-lg">
              Select your country and enter your income details for accurate tax calculation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 sm:space-y-10">
            {/* Country Selection */}
            <div className="space-y-4">
              <Label htmlFor="country" className="text-base sm:text-lg font-semibold">
                Country / Tax Jurisdiction
              </Label>
              <Select value={selectedCountry.code} onValueChange={handleCountryChange}>
                <SelectTrigger className="h-12 sm:h-14 text-base rounded-xl">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {TAX_COUNTRIES.map((country) => (
                    <SelectItem key={country.code} value={country.code} className="rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{country.flag}</span>
                        <div>
                          <div className="font-medium">{country.name}</div>
                          <div className="text-sm text-muted-foreground">Tax Year {country.taxYear}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Gross Income */}
            <div className="space-y-4">
              <Label htmlFor="gross-income" className="text-base sm:text-lg font-semibold">
                Annual Gross Income ({selectedCountry.currency.symbol})
              </Label>
              <Input
                id="gross-income"
                type="number"
                value={grossIncome}
                onChange={(e) => setGrossIncome(parseFloat(e.target.value) || 0)}
                placeholder="Enter your annual gross income"
                min="0"
                step="1000"
                className="text-base sm:text-lg h-12 sm:h-14 rounded-xl"
                disabled={isCalculating}
              />
              <div className="text-sm text-muted-foreground">
                {selectedCountry.incomeDescription}
              </div>
            </div>

            {/* Deductions */}
            {selectedCountry.deductions.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Label className="text-base sm:text-lg font-semibold">
                    Deductions & Exemptions
                  </Label>
                  <div className="group relative">
                    <Info className="w-5 h-5 text-muted-foreground cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-popover text-popover-foreground text-xs rounded-md shadow-md border opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-64 z-10">
                      Enter the amounts you're eligible to claim as deductions
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {selectedCountry.deductions.map((deduction) => (
                    <div key={deduction.key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={deduction.key} className="text-sm font-medium">
                          {deduction.name}
                        </Label>
                        {deduction.maxLimit && (
                          <span className="text-xs text-muted-foreground">
                            Max: {formatCurrency(deduction.maxLimit, selectedCountry.currency)}
                          </span>
                        )}
                      </div>
                      <Input
                        id={deduction.key}
                        type="number"
                        value={deductions[deduction.key] || 0}
                        onChange={(e) => handleDeductionChange(deduction.key, e.target.value)}
                        placeholder="0"
                        min="0"
                        max={deduction.maxLimit}
                        className="text-sm rounded-lg"
                        disabled={isCalculating}
                      />
                      {deduction.description && (
                        <div className="text-xs text-muted-foreground">
                          {deduction.description}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <Button 
                onClick={calculateTax} 
                size="lg"
                className="flex items-center gap-2 flex-1 h-12 sm:h-14 text-base rounded-xl"
                disabled={isCalculating}
              >
                {isCalculating ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Calculator className="w-5 h-5" />
                )}
                {isCalculating ? 'Calculating...' : 'Calculate Tax'}
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
        {result && (
          <div className="space-y-6 sm:space-y-8" id="tax-results">
            <Card className="shadow-enhanced rounded-2xl">
              <CardHeader className="pb-6 sm:pb-8">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl sm:text-2xl lg:text-3xl flex items-center gap-3">
                    <FileText className="w-6 h-6 text-primary" />
                    Tax Summary
                  </CardTitle>
                  <ShareDropdown
                    shareText={getShareText()}
                    elementId="tax-results"
                    calculatorType="Income Tax Calculator"
                  />
                </div>
                <CardDescription className="text-base sm:text-lg">
                  {selectedCountry.name} - Tax Year {selectedCountry.taxYear}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-center">
                  <div className="space-y-2 p-4 sm:p-6 rounded-xl bg-blue-50 dark:bg-blue-950/20">
                    <p className="text-sm sm:text-base text-muted-foreground">Gross Income</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(result.grossIncome, selectedCountry.currency)}
                    </p>
                  </div>
                  <div className="space-y-2 p-4 sm:p-6 rounded-xl bg-green-50 dark:bg-green-950/20">
                    <p className="text-sm sm:text-base text-muted-foreground">Total Deductions</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(result.totalDeductions, selectedCountry.currency)}
                    </p>
                  </div>
                  <div className="space-y-2 p-4 sm:p-6 rounded-xl bg-orange-50 dark:bg-orange-950/20">
                    <p className="text-sm sm:text-base text-muted-foreground">Taxable Income</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-600 dark:text-orange-400">
                      {formatCurrency(result.taxableIncome, selectedCountry.currency)}
                    </p>
                  </div>
                  <div className="space-y-2 p-4 sm:p-6 rounded-xl bg-red-50 dark:bg-red-950/20">
                    <p className="text-sm sm:text-base text-muted-foreground">Total Tax</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(result.totalTax, selectedCountry.currency)}
                    </p>
                  </div>
                  <div className="col-span-1 sm:col-span-2 space-y-2 border-t pt-6 p-4 sm:p-6 rounded-xl bg-primary/5">
                    <p className="text-sm sm:text-base text-muted-foreground">Net Income (Take Home)</p>
                    <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                      {formatCurrency(result.netIncome, selectedCountry.currency)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Effective Tax Rate: {result.effectiveTaxRate.toFixed(2)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tax Breakdown Chart */}
            <Card className="shadow-enhanced rounded-2xl">
              <CardHeader className="pb-6 sm:pb-8">
                <CardTitle className="text-xl sm:text-2xl lg:text-3xl">Tax Slab Breakdown</CardTitle>
                <CardDescription className="text-base sm:text-lg">
                  Tax calculation across different income slabs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 sm:h-96 lg:h-[28rem]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={result.taxBreakdown.filter(slab => slab.taxOnSlab > 0)} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis 
                        dataKey="rate"
                        tickFormatter={(value) => `${value}%`}
                        className="text-muted-foreground"
                        fontSize={12}
                      />
                      <YAxis 
                        tickFormatter={(value) => formatCurrency(value, selectedCountry.currency)}
                        className="text-muted-foreground"
                        fontSize={12}
                      />
                      <Tooltip 
                        formatter={(value: number) => [formatCurrency(value, selectedCountry.currency), 'Tax Amount']}
                        labelFormatter={(rate: number) => `${rate}% Tax Slab`}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                      <Bar 
                        dataKey="taxOnSlab" 
                        fill="#ef4444" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Income Distribution Pie Chart */}
            <Card className="shadow-enhanced rounded-2xl">
              <CardHeader className="pb-6 sm:pb-8">
                <CardTitle className="text-xl sm:text-2xl lg:text-3xl">Income Distribution</CardTitle>
                <CardDescription className="text-base sm:text-lg">
                  Breakdown of your income after tax and deductions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 sm:h-96 lg:h-[28rem]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Net Income', value: result.netIncome, color: CHART_COLORS[0] },
                          { name: 'Tax Paid', value: result.totalTax, color: CHART_COLORS[1] },
                          { name: 'Deductions', value: result.totalDeductions, color: CHART_COLORS[2] }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[
                          { name: 'Net Income', value: result.netIncome, color: CHART_COLORS[0] },
                          { name: 'Tax Paid', value: result.totalTax, color: CHART_COLORS[1] },
                          { name: 'Deductions', value: result.totalDeductions, color: CHART_COLORS[2] }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number) => [formatCurrency(value, selectedCountry.currency), '']}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          fontSize: '12px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Breakdown */}
            <Card className="shadow-enhanced rounded-2xl">
              <CardHeader className="pb-6 sm:pb-8">
                <CardTitle className="text-xl sm:text-2xl lg:text-3xl">Detailed Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Deductions Used */}
                {Object.entries(result.deductionsUsed).some(([_, value]) => value > 0) && (
                  <div>
                    <h4 className="text-lg font-semibold mb-4">Deductions Applied</h4>
                    <div className="space-y-3">
                      {Object.entries(result.deductionsUsed)
                        .filter(([_, value]) => value > 0)
                        .map(([key, value]) => {
                          const deduction = selectedCountry.deductions.find(d => d.key === key);
                          return (
                            <div key={key} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                              <span className="font-medium">{deduction?.name || key}</span>
                              <span className="font-bold text-green-600 dark:text-green-400">
                                {formatCurrency(value, selectedCountry.currency)}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                <Separator />

                {/* Tax Slabs */}
                <div>
                  <h4 className="text-lg font-semibold mb-4">Tax Calculation by Slabs</h4>
                  <div className="space-y-3">
                    {result.taxBreakdown.map((slab, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                        <div>
                          <span className="font-medium">
                            {slab.rate}% on {formatCurrency(slab.from, selectedCountry.currency)} - {slab.to === Infinity ? 'above' : formatCurrency(slab.to, selectedCountry.currency)}
                          </span>
                          <div className="text-sm text-muted-foreground">
                            Taxable: {formatCurrency(slab.taxableAmount, selectedCountry.currency)}
                          </div>
                        </div>
                        <span className="font-bold text-red-600 dark:text-red-400">
                          {formatCurrency(slab.taxOnSlab, selectedCountry.currency)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </CalculatorLayout>
  );
}