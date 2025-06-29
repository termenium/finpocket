// Using exchangerate-api.com which provides free tier without API key requirement
const BASE_URL = 'https://api.exchangerate-api.com/v4/latest';

export interface ExchangeRateResponse {
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface ConversionResult {
  from: string;
  to: string;
  amount: number;
  convertedAmount: number;
  rate: number;
  lastUpdated: string;
}

export interface HistoricalRate {
  date: string;
  rate: number;
}

// Cache for exchange rates to avoid excessive API calls
const rateCache = new Map<string, { data: ExchangeRateResponse; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export async function getExchangeRates(baseCurrency: string = 'USD'): Promise<ExchangeRateResponse> {
  const cacheKey = baseCurrency;
  const cached = rateCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  try {
    const response = await fetch(`${BASE_URL}/${baseCurrency}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ExchangeRateResponse = await response.json();
    
    // Cache the result
    rateCache.set(cacheKey, { data, timestamp: Date.now() });
    
    return data;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    throw new Error('Failed to fetch exchange rates. Please try again later.');
  }
}

export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<ConversionResult> {
  if (fromCurrency === toCurrency) {
    return {
      from: fromCurrency,
      to: toCurrency,
      amount,
      convertedAmount: amount,
      rate: 1,
      lastUpdated: new Date().toISOString()
    };
  }

  try {
    const rates = await getExchangeRates(fromCurrency);
    const rate = rates.rates[toCurrency];
    
    if (!rate) {
      throw new Error(`Exchange rate not found for ${fromCurrency} to ${toCurrency}`);
    }

    const convertedAmount = amount * rate;

    return {
      from: fromCurrency,
      to: toCurrency,
      amount,
      convertedAmount,
      rate,
      lastUpdated: rates.date
    };
  } catch (error) {
    console.error('Error converting currency:', error);
    throw error;
  }
}

// Generate mock historical data for demonstration
// In a real app, you'd use a service like Alpha Vantage or similar
export function generateHistoricalRates(
  fromCurrency: string,
  toCurrency: string,
  currentRate: number,
  days: number = 30
): HistoricalRate[] {
  const historicalRates: HistoricalRate[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate realistic rate fluctuation (±5% from current rate)
    const fluctuation = (Math.random() - 0.5) * 0.1; // ±5%
    const rate = currentRate * (1 + fluctuation);
    
    historicalRates.push({
      date: date.toISOString().split('T')[0],
      rate: parseFloat(rate.toFixed(6))
    });
  }
  
  return historicalRates;
}

export function formatExchangeRate(rate: number): string {
  if (rate >= 1) {
    return rate.toFixed(4);
  } else {
    return rate.toFixed(6);
  }
}