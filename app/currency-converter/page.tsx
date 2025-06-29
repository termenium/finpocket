'use client';

import { useState, useEffect } from 'react';
import { CalculatorLayout } from '@/components/calculator-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { convertCurrency, getExchangeRates, generateHistoricalRates, formatExchangeRate, ConversionResult, HistoricalRate } from '@/utils/currencyApi';
import { SUPPORTED_CURRENCIES, useCurrency } from '@/components/currency-provider';
import { RotateCcw, ArrowRightLeft, TrendingUp, Clock, RefreshCw, AlertCircle } from 'lucide-react';
import { ShareDropdown } from '@/components/share-dropdown';
import { toast } from 'sonner';

// Popular currency pairs for quick access
const POPULAR_PAIRS = [
  { from: 'USD', to: 'EUR', label: 'USD/EUR' },
  { from: 'USD', to: 'GBP', label: 'USD/GBP' },
  { from: 'USD', to: 'JPY', label: 'USD/JPY' },
  { from: 'EUR', to: 'GBP', label: 'EUR/GBP' },
  { from: 'USD', to: 'INR', label: 'USD/INR' },
  { from: 'EUR', to: 'INR', label: 'EUR/INR' },
];

export default function CurrencyConverter() {
  const { currency } = useCurrency();
  const [amount, setAmount] = useState<number>(1000);
  const [fromCurrency, setFromCurrency] = useState<string>(currency.code);
  const [toCurrency, setToCurrency] = useState<string>('USD');
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [historicalRates, setHistoricalRates] = useState<HistoricalRate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const handleConvert = async () => {
    if (amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const conversionResult = await convertCurrency(amount, fromCurrency, toCurrency);
      setResult(conversionResult);
      setLastUpdated(new Date().toLocaleString());

      // Generate historical data for chart
      const historical = generateHistoricalRates(fromCurrency, toCurrency, conversionResult.rate);
      setHistoricalRates(historical);

      toast.success('Currency converted successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to convert currency';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleQuickPair = (from: string, to: string) => {
    setFromCurrency(from);
    setToCurrency(to);
  };

  const handleReset = () => {
    setAmount(1000);
    setFromCurrency(currency.code);
    setToCurrency('USD');
    setResult(null);
    setHistoricalRates([]);
    setError(null);
    setLastUpdated('');
  };

  const getShareText = () => {
    if (!result) return '';

    return `💱 Currency Conversion Results

💰 Amount: ${amount.toLocaleString()} ${result.from}
🎯 Converted: ${result.convertedAmount.toLocaleString()} ${result.to}
📊 Exchange Rate: 1 ${result.from} = ${formatExchangeRate(result.rate)} ${result.to}
🕒 Last Updated: ${lastUpdated}

Calculated using FinToolkit - Professional Financial Calculators`;
  };

  // Auto-convert when values change
  useEffect(() => {
    if (amount > 0 && fromCurrency && toCurrency) {
      const timeoutId = setTimeout(() => {
        handleConvert();
      }, 500); // Debounce API calls

      return () => clearTimeout(timeoutId);
    }
  }, [amount, fromCurrency, toCurrency]);

  // Set initial currencies based on user's preference
  useEffect(() => {
    setFromCurrency(currency.code);
  }, [currency.code]);

  return (
    <CalculatorLayout
      title="Currency Converter"
      description="Convert currencies with real-time exchange rates and view historical trends to make informed financial decisions."
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 lg:gap-10">
        {/* Input Form */}
        <Card className="h-fit shadow-enhanced rounded-2xl">
          <CardHeader className="pb-6 sm:pb-8">
            <CardTitle className="text-xl sm:text-2xl lg:text-3xl">Currency Conversion</CardTitle>
            <CardDescription className="text-base sm:text-lg">
              Enter amount and select currencies for real-time conversion
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 sm:space-y-10">
            {/* Amount Input */}
            <div className="space-y-4">
              <Label htmlFor="amount" className="text-base sm:text-lg font-semibold">
                Amount to Convert
              </Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                placeholder="1000"
                min="0"
                step="0.01"
                className="text-base sm:text-lg h-12 sm:h-14 rounded-xl"
              />
            </div>

            {/* Currency Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Label htmlFor="from-currency" className="text-base sm:text-lg font-semibold">
                  From Currency
                </Label>
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="h-12 sm:h-14 text-base rounded-xl">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {SUPPORTED_CURRENCIES.map((curr) => (
                      <SelectItem key={curr.code} value={curr.code} className="rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{curr.code}</span>
                          <span className="text-muted-foreground">({curr.symbol})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label htmlFor="to-currency" className="text-base sm:text-lg font-semibold">
                  To Currency
                </Label>
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger className="h-12 sm:h-14 text-base rounded-xl">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {SUPPORTED_CURRENCIES.map((curr) => (
                      <SelectItem key={curr.code} value={curr.code} className="rounded-lg">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{curr.code}</span>
                          <span className="text-muted-foreground">({curr.symbol})</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleSwapCurrencies}
                variant="outline"
                size="lg"
                className="flex items-center gap-2 rounded-xl"
                disabled={isLoading}
              >
                <ArrowRightLeft className="w-5 h-5" />
                Swap Currencies
              </Button>
            </div>

            {/* Popular Pairs */}
            <div className="space-y-4">
              <Label className="text-base sm:text-lg font-semibold">Popular Currency Pairs</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {POPULAR_PAIRS.map((pair) => (
                  <Button
                    key={pair.label}
                    onClick={() => handleQuickPair(pair.from, pair.to)}
                    variant="outline"
                    size="sm"
                    className="text-xs sm:text-sm rounded-lg"
                    disabled={isLoading}
                  >
                    {pair.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6">
              <Button 
                onClick={handleConvert} 
                size="lg"
                className="flex items-center gap-2 flex-1 h-12 sm:h-14 text-base rounded-xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <TrendingUp className="w-5 h-5" />
                )}
                {isLoading ? 'Converting...' : 'Convert Now'}
              </Button>
              <Button 
                onClick={handleReset} 
                variant="outline" 
                size="lg"
                className="flex items-center gap-2 h-12 sm:h-14 text-base rounded-xl"
                disabled={isLoading}
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
            <div id="currency-results">
              <Card className="shadow-enhanced rounded-2xl">
                <CardHeader className="pb-6 sm:pb-8">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl sm:text-2xl lg:text-3xl">Conversion Result</CardTitle>
                    <ShareDropdown
                      shareText={getShareText()}
                      elementId="currency-results"
                      calculatorType="Currency Converter"
                    />
                  </div>
                  {lastUpdated && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      Last updated: {lastUpdated}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Main Conversion Display */}
                    <div className="text-center p-6 sm:p-8 rounded-xl bg-gradient-to-br from-primary/5 to-primary/10 border">
                      <div className="space-y-2">
                        <p className="text-lg sm:text-xl text-muted-foreground">
                          {amount.toLocaleString()} {result.from}
                        </p>
                        <div className="flex items-center justify-center gap-3">
                          <ArrowRightLeft className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                          {result.convertedAmount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })} {result.to}
                        </p>
                      </div>
                    </div>

                    {/* Exchange Rate Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-muted/50 text-center">
                        <p className="text-sm text-muted-foreground mb-1">Exchange Rate</p>
                        <p className="text-lg font-bold">
                          1 {result.from} = {formatExchangeRate(result.rate)} {result.to}
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-muted/50 text-center">
                        <p className="text-sm text-muted-foreground mb-1">Inverse Rate</p>
                        <p className="text-lg font-bold">
                          1 {result.to} = {formatExchangeRate(1 / result.rate)} {result.from}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Historical Chart */}
              {historicalRates.length > 0 && (
                <Card className="shadow-enhanced rounded-2xl">
                  <CardHeader className="pb-6 sm:pb-8">
                    <CardTitle className="text-xl sm:text-2xl lg:text-3xl">
                      30-Day Rate Trend
                    </CardTitle>
                    <CardDescription className="text-base sm:text-lg">
                      Historical exchange rate for {result.from}/{result.to}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80 sm:h-96 lg:h-[28rem]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={historicalRates} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={(value) => new Date(value).toLocaleDateString()}
                            className="text-muted-foreground"
                            fontSize={12}
                          />
                          <YAxis 
                            tickFormatter={(value) => formatExchangeRate(value)}
                            className="text-muted-foreground"
                            fontSize={12}
                          />
                          <Tooltip 
                            formatter={(value: number) => [formatExchangeRate(value), 'Exchange Rate']}
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
                            dataKey="rate" 
                            stroke="#10b981" 
                            strokeWidth={3}
                            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                            name={`${result.from}/${result.to} Rate`}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
    </CalculatorLayout>
  );
}