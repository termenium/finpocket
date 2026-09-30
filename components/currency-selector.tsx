'use client';

import { useCurrency, SUPPORTED_CURRENCIES } from '@/components/currency-provider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function CurrencySelector({ compact = false }: { compact?: boolean }) {
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
        <SelectTrigger className="h-9 gap-1 rounded-xl border-border/60 bg-background px-2.5 text-sm hover:bg-muted focus:ring-2 focus:ring-ring focus:ring-offset-1 data-[state=open]:bg-muted transition-colors">
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold">{currency.symbol}</span>
            <span className={compact ? 'text-sm font-medium' : 'hidden text-sm font-medium sm:inline'}>
              {currency.code}
            </span>
          </div>
        </SelectTrigger>
        <SelectContent 
          align="end" 
          className="min-w-[200px] z-[100] bg-popover border border-border shadow-lg rounded-xl"
          sideOffset={4}
        >
          {SUPPORTED_CURRENCIES.map((curr) => (
            <SelectItem 
              key={curr.code} 
              value={curr.code} 
              className="text-sm cursor-pointer hover:bg-accent focus:bg-accent rounded-lg"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 text-center text-sm font-semibold">{curr.symbol}</span>
                <span className="font-medium">{curr.code}</span>
                <span className="text-xs text-muted-foreground truncate">{curr.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}