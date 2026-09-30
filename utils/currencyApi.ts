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
  } catch (primaryError) {
    console.error('Primary exchange rate API failed, trying fallback:', primaryError);

    // Fallback: Frankfurter API (ECB reference rates, no API key).
    // Convert its { amount, base, rates } shape into our ExchangeRateResponse shape.
    try {
      const response = await fetch(`https://api.frankfurter.app/latest?base=${baseCurrency}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = (await response.json()) as { base: string; date: string; rates: Record<string, number> };
      const result: ExchangeRateResponse = {
        base: data.base,
        date: data.date,
        // Include the base currency itself at 1:1 for same-currency lookups
        rates: { ...data.rates, [data.base]: 1 },
      };

      rateCache.set(cacheKey, { data: result, timestamp: Date.now() });
      return result;
    } catch (fallbackError) {
      console.error('Fallback exchange rate API also failed:', fallbackError);
      throw new Error('Failed to fetch exchange rates. Please try again later.');
    }
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

// Real historical exchange rates from the Frankfurter API (ECB reference rates).
// Free, no API key required. Note: ECB publishes rates on business days only,
// so weekends/holidays are absent from the result.
const HISTORICAL_BASE_URL = 'https://api.frankfurter.app';
const historicalCache = new Map<string, { data: HistoricalRate[]; timestamp: number }>();
const HISTORICAL_CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours

export async function getHistoricalRates(
  fromCurrency: string,
  toCurrency: string,
  days: number = 30
): Promise<HistoricalRate[]> {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);

  const toISODate = (d: Date) => d.toISOString().split('T')[0];
  const cacheKey = `${fromCurrency}-${toCurrency}-${toISODate(start)}`;
  const cached = historicalCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < HISTORICAL_CACHE_DURATION) {
    return cached.data;
  }

  const url = `${HISTORICAL_BASE_URL}/${toISODate(start)}..${toISODate(end)}?from=${fromCurrency}&to=${toCurrency}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch historical rates (HTTP ${response.status})`);
  }

  const data: { rates: Record<string, Record<string, number>> } = await response.json();

  const historicalRates: HistoricalRate[] = Object.entries(data.rates)
    .map(([date, rates]) => ({ date, rate: rates[toCurrency] }))
    .filter((entry): entry is HistoricalRate => typeof entry.rate === 'number')
    .sort((a, b) => a.date.localeCompare(b.date));

  if (historicalRates.length === 0) {
    throw new Error(`No historical data available for ${fromCurrency}/${toCurrency}`);
  }

  historicalCache.set(cacheKey, { data: historicalRates, timestamp: Date.now() });
  return historicalRates;
}

export function formatExchangeRate(rate: number): string {
  if (rate >= 1) {
    return rate.toFixed(4);
  } else {
    return rate.toFixed(6);
  }
}