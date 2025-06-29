'use client';

import { useCurrency, SUPPORTED_CURRENCIES } from '@/components/currency-provider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex items-center">
      <Select
        value={currency.code}
        onValueChange={(value) => {
          const selectedCurrency = SUPPORTED_CURRENCIES.find(c => c.code === value);
          if (selectedCurrency) {
            setCurrency(selectedCurrency);
          }
        }}
      >
        <SelectTrigger className="w-auto min-w-[90px] h-9 px-3 py-1 text-sm bg-background border border-border hover:bg-accent hover:text-accent-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2 data-[state=open]:bg-accent transition-colors rounded-xl">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-sm font-medium">{currency.symbol}</span>
            <span className="text-sm font-medium">{currency.code}</span>
          </div>
        </SelectTrigger>
        <SelectContent 
          align="end" 
          className="min-w-[220px] z-[100] bg-popover border border-border shadow-lg rounded-xl"
          sideOffset={4}
        >
          {SUPPORTED_CURRENCIES.map((curr) => (
            <SelectItem 
              key={curr.code} 
              value={curr.code} 
              className="text-sm cursor-pointer hover:bg-accent focus:bg-accent rounded-lg"
            >
              <div className="flex items-center justify-between w-full gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{curr.code}</span>
                </div>
                <span className="text-muted-foreground text-xs truncate">{curr.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}