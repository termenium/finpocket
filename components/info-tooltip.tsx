'use client';

import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface InfoTooltipProps {
  text: string;
  className?: string;
}

/**
 * Accessible info tooltip: works on hover, focus, AND touch (tap toggles it),
 * unlike the previous hover-only CSS hints.
 */
export function InfoTooltip({ text, className }: InfoTooltipProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={`Info: ${text}`}
            className={
              className ??
              'inline-flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-help'
            }
          >
            <Info className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-64 text-xs leading-relaxed">
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
